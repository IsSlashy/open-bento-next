import { NextResponse } from 'next/server';

// Cache contribution data for 1 hour
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  // Check cache
  const cached = cache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `bearer ${token}`;
    }

    // GraphQL query for contributions
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories {
            totalCount
          }
          followers {
            totalCount
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      // Fallback to REST API for basic info
      const restResponse = await fetch(`https://api.github.com/users/${username}`, {
        headers: token ? { Authorization: `token ${token}` } : {},
      });

      if (!restResponse.ok) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const userData = await restResponse.json();
      const fallbackData = {
        username: userData.login,
        stats: {
          repos: userData.public_repos,
          followers: userData.followers,
          contributions: 0,
        },
        contributions: null,
      };

      cache.set(username, { data: fallbackData, timestamp: Date.now() });
      return NextResponse.json(fallbackData);
    }

    const data = await response.json();
    const user = data.data?.user;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const calendar = user.contributionsCollection.contributionCalendar;

    // Flatten contributions to a simple array (last 17 weeks x 7 days = 119 days)
    const allDays = calendar.weeks
      .flatMap((week: { contributionDays: { contributionCount: number; date: string }[] }) =>
        week.contributionDays.map((day: { contributionCount: number; date: string }) => day.contributionCount)
      )
      .slice(-119); // Last 17 weeks

    // Normalize to 0-4 levels
    const max = Math.max(...allDays, 1);
    const normalized = allDays.map((count: number) => {
      if (count === 0) return 0;
      if (count <= max * 0.25) return 1;
      if (count <= max * 0.5) return 2;
      if (count <= max * 0.75) return 3;
      return 4;
    });

    const result = {
      username,
      stats: {
        repos: user.repositories.totalCount,
        followers: user.followers.totalCount,
        contributions: calendar.totalContributions,
      },
      contributions: normalized,
    };

    cache.set(username, { data: result, timestamp: Date.now() });
    return NextResponse.json(result);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
