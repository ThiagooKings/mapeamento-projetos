"use client";

import React, { useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import "./leaflet-config";

export default function Home() {
  const [search, setSearch] = useState("");
  const [objects] = useState([
    { id: 1, name: "Projeto A" },
    { id: 2, name: "Projeto B" },
    { id: 3, name: "Projeto C" },
  ]);

  const filtered = objects.filter((obj) =>
    obj.name.toLowerCase().includes(search.toLowerCase())
  );

  const redOptions = { color: "red" };

  return (
    <div className="flex h-screen">
      {/* Coluna da esquerda */}
      <div className="w-[30%] border-r border-gray-200 p-6">
        <input
          type="text"
          placeholder="Buscar projeto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <ul>
          {filtered.map((obj) => (
            <li key={obj.id} className="mb-2">
              {obj.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-6">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <CircleMarker
            center={[51.51, -0.12]}
            pathOptions={redOptions}
            radius={20}
          >
            <Popup>Popup in CircleMarker</Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    </div>
  );
}
