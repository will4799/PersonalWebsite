import { SceneObject, PiPoint } from "../Types/Annotations/types";

export function fetchPiTimeseries(piTag: string): Promise<PiPoint[]> {
  const now = Date.now();
  const points: PiPoint[] = [];

  for (let i = 0; i < 50; i++) {
    points.push({
      timestamp: now - i * 60000,
      value: Math.random() * 100
    });
  }

  return Promise.resolve(points.reverse());
}