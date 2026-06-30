export interface PiPoint {
  timestamp: number;
  value: number;
}

export interface SceneObject {
  id: string;
  name: string;
  position: [number, number, number];
  piTags: string[];
  description: string;
}
