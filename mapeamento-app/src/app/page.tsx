"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
} from "react-leaflet";

import "./leaflet-config";
import { Project } from "@/types/Project";
import MapController from "@/components/MapController";

export default function Home() {
  const [search, setSearch] = useState("");
  const [zoomScale, setZoomScale] = useState(2);
  const [projects, setProjects] = useState([] as Project[]);
  const [selectedProject, setSelectedProject] = useState({} as Project);

  useEffect(() => {
    axios
      .get("http://localhost:3333/projects")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Erro ao buscar projetos:", error));
  }, []);

  console.log("selected project:", projects);

  const filtered = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
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
          {filtered.map((project) => (
            <li
              key={project.id}
              className="mb-2 cursor-pointer"
              onClick={() => {
                setSelectedProject(project);
                setZoomScale(11);
              }}
            >
              {project.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-6">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={zoomScale}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <MapController
            zoom={zoomScale}
            position={
              selectedProject.geometry?.type === "MultiPolygon"
                ? Array.isArray(
                    selectedProject.geometry.coordinateType?.coordinates
                  ) &&
                  selectedProject.geometry.coordinateType?.coordinates.length >
                    0 &&
                  Array.isArray(
                    selectedProject.geometry.coordinateType?.coordinates[0]
                  ) &&
                  selectedProject.geometry.coordinateType?.coordinates[0]
                    .length > 0
                  ? (selectedProject.geometry.coordinateType
                      ?.coordinates[0][0] as unknown as [number, number])
                  : undefined
                : selectedProject.geometry?.type === "Polygon"
                ? Array.isArray(
                    selectedProject.geometry.coordinateType?.coordinates
                  ) &&
                  selectedProject.geometry.coordinateType?.coordinates.length >
                    0
                  ? (selectedProject.geometry.coordinateType
                      ?.coordinates[0] as [number, number])
                  : undefined
                : selectedProject.geometry?.type === "Point" ||
                  selectedProject.geometry?.type === "Circle"
                ? (selectedProject.geometry.coordinateType?.coordinates as [
                    number,
                    number
                  ])
                : undefined
            }
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedProject.geometry?.type === "Point" && (
            <Marker
              position={
                selectedProject.geometry.coordinateType?.coordinates as [
                  number,
                  number
                ]
              }
            >
              <Popup>{selectedProject.name}</Popup>
            </Marker>
          )}

          {selectedProject.geometry?.type === "Polygon" && (
            <Polygon
              pathOptions={redOptions}
              positions={
                (selectedProject.geometry.coordinateType?.coordinates as
                  | [number, number][]
                  | undefined) || []
              }
            >
              <Popup>{selectedProject.name}</Popup>
            </Polygon>
          )}

          {selectedProject.geometry?.type === "MultiPolygon" && (
            <Polygon
              pathOptions={redOptions}
              positions={
                (selectedProject.geometry.coordinateType?.coordinates as
                  | [number, number][]
                  | undefined) || []
              }
            >
              <Popup>{selectedProject.name}</Popup>
            </Polygon>
          )}
          {selectedProject.geometry?.type === "Circle" && (
            <Circle
              center={
                selectedProject.geometry.coordinateType?.coordinates as [
                  number,
                  number
                ]
              }
              pathOptions={redOptions}
              radius={
                selectedProject.geometry?.type === "Circle"
                  ? (
                      selectedProject.geometry.coordinateType as {
                        radius?: number;
                      }
                    )?.radius || 20
                  : 20
              }
            >
              <Popup>{selectedProject.name}</Popup>
            </Circle>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
