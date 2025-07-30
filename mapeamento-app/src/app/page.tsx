"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
} from "react-leaflet";
import Link from "next/link";

import { Project } from "@/types/Project";
import MapController from "@/components/MapController";
import { selectColor } from "@/utils/SelectColor";

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

  React.useEffect(() => {
    import("../utils/leaflet-config");
  }, []);

  console.log("selected project:", projects);

  const filtered = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Coluna da esquerda */}
      <div className="w-[30%] border-r border-gray-400 p-6 overflow-y-auto">
        <Link
          href="/criar-projeto"
          className="mb-4 inline-block px-4 py-2 bg-[#282a36] text-white rounded hover:bg-slate-700 transition border-1 border-gray-400"
        >
          Criar projeto
        </Link>
        <input
          type="text"
          placeholder="Buscar projeto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-400 rounded"
        />
        <div className="flex flex-col gap-0 border-t border-l border-r border-gray-400 rounded-t-md">
          {filtered.map((project, idx) => (
            <div
              key={project.id}
              className={`p-4 flex flex-col cursor-pointer border-b border-gray-400 rounded-t-md hover:bg-slate-700 transition ${
                idx === 0 ? "rounded-t-md" : ""
              } ${
                selectedProject?.id === project.id
                  ? "bg-slate-900"
                  : "bg-[#282a36]"
              }`}
              onClick={() => {
                setSelectedProject(project);
                setZoomScale(11);
              }}
            >
              <span className="font-semibold text-lg">{project.name}</span>
              <span
                className={`mt-1 text-sm font-medium  ${
                  project.status?.name === "Ativo"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <b>{project.status?.name}</b>
              </span>
              <span className="mt-1 text-xs text-gray-300">
                Responsável: {project.responsible}
              </span>
            </div>
          ))}
        </div>
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

          {selectedProject && selectedProject.geometry ? (
            <>
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
                  pathOptions={{ color: "red" }}
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
                  pathOptions={{ color: "red" }}
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
                  pathOptions={{ color: "red" }}
                  radius={
                    (
                      selectedProject.geometry.coordinateType as {
                        radius?: number;
                      }
                    )?.radius || 20
                  }
                >
                  <Popup>{selectedProject.name}</Popup>
                </Circle>
              )}
            </>
          ) : (
            <>
              {projects.map((project, idx) => {
                const color = selectColor(idx % 10);
                return project.geometry?.type === "Point" ? (
                  <Marker
                    key={project.id}
                    position={
                      project.geometry.coordinateType?.coordinates as [
                        number,
                        number
                      ]
                    }
                  >
                    <Popup>{project.name}</Popup>
                  </Marker>
                ) : project.geometry?.type === "Polygon" ? (
                  <Polygon
                    key={project.id}
                    pathOptions={{ color }}
                    positions={
                      (project.geometry.coordinateType?.coordinates as
                        | [number, number][]
                        | undefined) || []
                    }
                  >
                    <Popup>{project.name}</Popup>
                  </Polygon>
                ) : project.geometry?.type === "MultiPolygon" ? (
                  <Polygon
                    key={project.id}
                    pathOptions={{ color }}
                    positions={
                      (project.geometry.coordinateType?.coordinates as
                        | [number, number][]
                        | undefined) || []
                    }
                  >
                    <Popup>{project.name}</Popup>
                  </Polygon>
                ) : project.geometry?.type === "Circle" ? (
                  <Circle
                    key={project.id}
                    center={
                      project.geometry.coordinateType?.coordinates as [
                        number,
                        number
                      ]
                    }
                    pathOptions={{ color }}
                    radius={
                      (project.geometry.coordinateType as { radius?: number })
                        ?.radius || 20
                    }
                  >
                    <Popup>{project.name}</Popup>
                  </Circle>
                ) : null;
              })}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
