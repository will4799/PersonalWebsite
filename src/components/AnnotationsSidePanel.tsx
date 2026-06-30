import { useEffect, useRef, useState } from "react";
import { fetchPiTimeseries } from "../data/mockApi";
import { Line } from "react-chartjs-2";
import { SceneObject, PiPoint } from "../Types/Annotations/types";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale
);

interface SidePanelProps {
  object: SceneObject;
  onClose: () => void;
}

export default function SidePanel({ object, onClose }: SidePanelProps) {
  const cacheRef = useRef<Record<string, PiPoint[]>>({});
  const [data, setData] = useState<Record<string, PiPoint[]>>({});

  useEffect(() => {
    async function load() {
      const result: Record<string, PiPoint[]> = {};

      for (const tag of object.piTags) {
        const fullTag = `${object.id}.${tag}`;

        // If we already fetched this tag before, reuse it
        if (cacheRef.current[fullTag]) {
          result[fullTag] = cacheRef.current[fullTag];
          continue;
        }

        // Otherwise fetch and store it
        const series = await fetchPiTimeseries(fullTag);
        cacheRef.current[fullTag] = series;
        result[fullTag] = series;
      }

      setData(result);
    }

    load();
  }, [object.id]);


  return (
    <div className="fixed right-0 top-14 w-96 h-[calc(100vh-3.5rem)] bg-surface shadow-xl p-4 overflow-y-auto">

      {/* Close (X) button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-ink-light-600 hover:text-accent text-2xl leading-none"
        aria-label="Close panel"
      >
        ×
      </button>

      <h2 className="text-xl font-bold mt-8">{object.name}</h2>
      <p className="text-ink-light-600 mb-4">{object.description}</p>

      {Object.entries(data).map(([tag, series]) => (
        <div key={tag} className="mb-6">
          <h4 className="font-semibold mb-2">{tag}</h4>

          <Line
            data={{
              labels: series.map((p: PiPoint) =>
                new Date(p.timestamp).toLocaleTimeString()
              ),
              datasets: [
                {
                  label: tag,
                  data: series.map((p: PiPoint) => p.value),
                  borderColor: "rgba(100, 100, 255, 0.8)",
                  backgroundColor: "rgba(100, 100, 255, 0.2)",
                }
              ]
            }}
          />
        </div>
      ))}

      <h3 className="font-semibold mt-6 mb-2">Links</h3>
      <ul>
        <li><a href="#" className="text-ink-light-600 hover:text-accent">Open External Viewer</a></li>
        <li><a href="#" className="text-ink-light-600 hover:text-accent">Open Documentation</a></li>
      </ul>
    </div>
  );
}