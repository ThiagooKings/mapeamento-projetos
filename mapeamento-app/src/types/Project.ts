export type Project = {
  id: number;
  name: string;
  responsible: string;
  createdAt: string;
  statusId: string;
  geometryId: string;
  status: Status;
  geometry: Geometry;
};

type Status = {
  id: string;
  name: string;
  createdAt: string;
};

type Geometry = {
  id: string;
  type: string;
  coordinateType: Circle | Point | Polygon | MultiPolygon;
};

type MultiPolygon = {
  coordinates: Polygon[];
};

type Polygon = {
  coordinates: number[][];
};

type Point = {
  coordinates: [number, number];
};

type Circle = {
  coordinates: [number, number];
  radius: number;
};
