"use client";

import React from "react";
import { useMap } from "react-leaflet";

function MapController({
  zoom,
  position,
}: {
  zoom: number;
  position?: [number, number];
}) {
  const map = useMap();
  React.useEffect(() => {
    map.setZoom(zoom);
    if (position) {
      map.setView(position);
    }
  }, [zoom, position, map]);
  return null;
}

export default MapController;
