"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import "./leaflet-config";
import { Project } from "@/types/Project";

export default function Home() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([] as Project[]);
  const [selectedProject, setSelectedProject] = useState({} as Project);

  useEffect(() => {
    axios
      .get("http://localhost:3333/projects")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Erro ao buscar projetos:", error));
  }, []);

  console.log("Projects:", projects);

  const filtered = projects.filter((obj) =>
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
