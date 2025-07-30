"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [nameStatus, setNameStatus] = useState<string | null>(null);
  const [status, setStatus] = useState("Ativo");
  const [geometry, setGeometry] = useState("Ponto");
  const [latLng, setLatLng] = useState("");
  const [raio, setRaio] = useState("");
  const [areaUnicaCoords, setAreaUnicaCoords] = useState([{ latLng: "" }]);
  const [responsavel, setResponsavel] = useState("");
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  const handleCheckName = () => {
    setChecking(true);
    setNameStatus(null);
    axios
      .get(
        `http://localhost:3333/projects/findByName?name=${encodeURIComponent(
          projectName
        )}`
      )
      .then((res) => {
        const data = res.data;
        setNameStatus(data.id && "Nome já existe");
      })
      .catch(() => {
        setNameStatus("Nome disponível");
      })
      .finally(() => {
        setChecking(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let type = "";
    let radius: number = 0;

    let coordinates: [number, number] = [0, 0];
    let coordinatesPolygon: [number, number][] = [[0, 0]];

    if (geometry === "Ponto" || geometry === "Circulo") {
      type = geometry === "Ponto" ? "Point" : "Circle";
      radius = raio ? parseFloat(raio) : 0;

      const coordsArr = latLng
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      if (coordsArr.length === 2 && coordsArr.every((n) => !isNaN(n))) {
        coordinates = [coordsArr[0], coordsArr[1]];
      } else {
        alert(
          "Coordenadas inválidas: informe latitude e longitude separados por vírgula."
        );
        return;
      }
    }

    if (geometry === "Area unica") {
      type = "Polygon";
      const coordsArr = areaUnicaCoords.map((coord) =>
        coord.latLng.split(",").map((c) => parseFloat(c.trim()))
      );

      const allValid = coordsArr.every(
        (arr) => arr.length === 2 && arr.every((n) => !isNaN(n))
      );

      if (!allValid) {
        alert(
          "Coordenadas inválidas: informe latitude e longitude separados por vírgula em todos os campos."
        );
        return;
      }

      coordinatesPolygon = coordsArr.map((arr) => [arr[0], arr[1]]);

      console.log("Coordenadas do polígono:", [coordinatesPolygon]);
    }

    if (!nameStatus || nameStatus === "Nome já existe") {
      alert(
        "Nome do projeto já existe ou não verificado. Por favor, escolha outro nome ou verifique disponibilidade."
      );
      return;
    }

    if (!projectName || !status || !geometry || !coordinates || !responsavel) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    axios
      .post("http://localhost:3333/projects", {
        name: projectName,
        status,
        geometry: {
          type,
          coordinateType: {
            coordinates:
              geometry === "Area unica" ? coordinatesPolygon : coordinates,
            radius,
          },
        },

        responsible: responsavel,
      })
      .then(() => {
        router.push("/");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#282a36]">
      <div className="max-w-md w-full p-6 bg-slate-700 rounded-lg shadow-md relative">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar projeto</h1>
        <form className="space-y-5 pb-14" onSubmit={handleSubmit}>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium mb-1"
          >
            Nome do projeto:
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              required
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleCheckName}
              disabled={!projectName || checking}
              className=" inline-block px-4 py-2 bg-slate-700 text-white rounded hover:bg-[#282a36] transition border-1 border-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              Verificar
            </button>
          </div>
          {nameStatus && (
            <div
              className={`mb-3 text-sm font-semibold ${
                nameStatus === "Nome disponível"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {nameStatus}
            </div>
          )}

          <label className="block text-sm font-medium mb-1">Status:</label>
          <div className="flex gap-6 mb-3">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="status"
                value="Ativo"
                checked={status === "Ativo"}
                onChange={() => setStatus("Ativo")}
                className="accent-blue-600"
              />
              <span>Ativo</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="status"
                value="Finalizado"
                checked={status === "Finalizado"}
                onChange={() => setStatus("Finalizado")}
                className="accent-blue-600"
              />
              <span>Finalizado</span>
            </label>
          </div>

          <label htmlFor="geometry" className="block text-sm font-medium mb-1">
            Geometria:
          </label>
          <select
            required
            id="geometry"
            value={geometry}
            onChange={(e) => setGeometry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 mb-3  focus:ring-blue-500 bg-slate-700 text-white"
          >
            <option value="Ponto">Ponto</option>
            <option value="Circulo">Circulo</option>
            <option value="Area unica">Área única</option>
            {/* <option value="Múltiplas áreas">Múltiplas áreas</option> */}
          </select>

          {geometry === "Ponto" && (
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Coordenadas:
              </label>
              <input
                required
                type="text"
                placeholder="Latitude e Longitude devem ser separados por ','"
                value={latLng}
                onChange={(e) => setLatLng(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {geometry === "Circulo" && (
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Coordenadas
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  required
                  type="text"
                  placeholder="Latitude e Longitude devem ser separados por ','"
                  value={latLng}
                  onChange={(e) => setLatLng(e.target.value)}
                  className="w-2/3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  required
                  type="number"
                  placeholder="Raio"
                  value={raio}
                  onChange={(e) => setRaio(e.target.value)}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {geometry === "Area unica" && (
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Coordenadas:
              </label>
              {areaUnicaCoords.map((coord, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    required
                    type="text"
                    placeholder="Latitude e Longitude devem ser separados por ','"
                    value={coord.latLng}
                    onChange={(e) => {
                      const newCoords = [...areaUnicaCoords];
                      newCoords[idx].latLng = e.target.value;
                      setAreaUnicaCoords(newCoords);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                onClick={() =>
                  setAreaUnicaCoords([...areaUnicaCoords, { latLng: "" }])
                }
              >
                Adicionar coordenada
              </button>
            </div>
          )}

          {/* Responsável */}
          <label
            htmlFor="responsavel"
            className="block text-sm font-medium mb-1"
          >
            Responsável
          </label>
          <input
            id="responsavel"
            type="text"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          {/* Botão de submit pode ser adicionado futuramente */}
        </form>
        {/* Botões fixos */}
        <div className="absolute left-6 bottom-6 flex justify-between w-[calc(100%-3rem)]">
          <button
            type="button"
            className="inline-block px-4 py-2 bg-slate-700 text-white rounded  transition border-1 border-gray-300 hover:bg-[#282a36] disabled:cursor-not-allowed cursor-pointer"
            onClick={() => router.push("/")}
          >
            Voltar
          </button>
          <button
            type="submit"
            form="form"
            className="px-4 py-2 bg-blue-600 text-white rounded transition hover:bg-blue-700 cursor-pointer"
            onClick={handleSubmit}
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}
