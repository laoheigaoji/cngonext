"use client";

import React, { useEffect, useRef } from 'react';
import WeatherWidget from './WeatherWidget';

// Component that injects WeatherWidget into the SSR-rendered info card slot
export default function WeatherInjector({ cityName, enCityName, language }: { cityName: string; enCityName: string; language: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    const slot = document.getElementById('weather-widget-slot');
    if (slot && ref.current) {
      slot.innerHTML = ''; // Clear any placeholder content
      slot.appendChild(ref.current);
    }
    setMounted(true);
  }, []);

  // On first render, create a hidden container for the weather widget
  // It will be moved into the slot by useEffect
  return (
    <div ref={ref} style={{ display: mounted ? 'contents' : 'none' }}>
      <WeatherWidget cityName={cityName} enCityName={enCityName} language={language} />
    </div>
  );
}
