'use client';

import { MapContent } from '@/lib/types';
import { MapPin } from 'lucide-react';

interface MapCardProps {
  content: MapContent;
}

export function MapCard({ content }: MapCardProps) {
  const { lat, lng, zoom = 12 } = content;

  return (
    <div className="map-card">
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05}%2C${lat - 0.03}%2C${lng + 0.05}%2C${lat + 0.03}&layer=mapnik&marker=${lat}%2C${lng}`}
        loading="lazy"
        title="Location map"
      />
      <div className="map-label">
        <MapPin className="w-4 h-4 text-red-500" />
        <span>Based here</span>
      </div>
    </div>
  );
}
