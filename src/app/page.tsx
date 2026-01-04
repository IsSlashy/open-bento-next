'use client';

import { Sidebar } from '@/components/Sidebar';
import { BentoGrid } from '@/components/BentoGrid';
import { Toolbar } from '@/components/Toolbar';

export default function Home() {
  return (
    <>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <BentoGrid />
        </main>
      </div>
      <Toolbar />
    </>
  );
}
