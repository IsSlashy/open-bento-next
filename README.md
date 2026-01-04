# Open Bento

A free, open-source alternative to [bento.me](https://bento.me) for creating beautiful portfolio pages.

![Open Bento Preview](./preview.png)

## Features

- Drag & drop card arrangement
- Multiple card types: Social links, Images, Videos, GIFs, Maps, Text, GitHub stats
- Auto-detection of social platforms (Twitter, Instagram, TikTok, YouTube, Twitch, Spotify, etc.)
- GIF support with animation preservation
- Image/GIF repositioning tool
- Responsive grid layout
- Local storage persistence
- No account required

## Status

**This is a Beta version** - Frontend only, no backend yet.

### Current Limitations

- Data is stored in browser's localStorage only
- No user accounts or authentication
- No shareable public URLs (yet)

### Roadmap

- [ ] Backend API (Node.js/Express or Next.js API routes)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Dynamic URLs (`/username` for public portfolios)
- [ ] Custom domain support
- [ ] Export/Import functionality
- [ ] Theme customization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/IsSlashy/open-bento.git
cd open-bento

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Edit your profile** - Click on your name, title, bio, or tags to edit them
2. **Change avatar** - Click the upload button on your profile picture
3. **Add cards** - Use the toolbar at the bottom:
   - Paste a link (auto-detects platform)
   - Upload images/videos/GIFs
   - Add section titles
   - Add location map
4. **Rearrange cards** - Drag and drop to reorder
5. **Resize cards** - Hover over a card and use the size selector
6. **Delete cards** - Hover and click the trash icon
7. **Reposition images** - Hover over an image and click the move icon

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [@dnd-kit](https://dndkit.com/) - Drag and drop
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icons

## Self-Hosting

Since there's no backend yet, you can run this entirely on your local machine:

```bash
# Clone, install, and run
git clone https://github.com/IsSlashy/open-bento.git
cd open-bento
npm install
npm run dev
```

To expose your local instance:

```bash
# Using ngrok
ngrok http 3000

# Or using localtunnel
npx localtunnel --port 3000
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by [bento.me](https://bento.me)
- Built with love for the open-source community

---

**Note:** This project is not affiliated with bento.me.
