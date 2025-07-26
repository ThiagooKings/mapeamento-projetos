export type Geometry = {
  id: string;
  type: string;
  coordinateType: Circle | Point | Polygon | MultiPolygon;
};

export type MultiPolygon = {
  coordinates: Polygon[];
};

export type Polygon = {
  coordinates: number[][];
};

export type Point = {
  coordinates: [number, number];
};

export type Circle = {
  coordinates: [number, number];
  radius: number;
};
