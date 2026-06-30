import { useEffect, useState } from "react";
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
  const [data, setData] = useState<Record<string, PiPoint[]>>({});

  useEffect(() => {
    async function load() {
      const result: Record<string, PiPoint[]> = {};

      for (const tag of object.piTags) {
        const fullTag = `${object.id}.${tag}`;
        result[fullTag] = await fetchPiTimeseries(fullTag);
      }

      setData(result);
    }

    load();
  }, [object]);

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-xl p-4 overflow-y-auto">
      <button onClick={onClose} className="text-sm mb-4">Close</button>

      <h2 className="text-xl font-bold">{object.name}</h2>
      <p className="text-gray-600 mb-4">{object.description}</p>

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
                  backgroundColor: "rgba(100, 100, 255, 0.2)"
                }
              ]
            }}
          />
        </div>
      ))}

      <h3 className="font-semibold mt-6 mb-2">Links</h3>
      <ul>
        <li><a href="#">Open in PI Vision</a></li>
        <li><a href="#">Open in Asset Framework</a></li>
        <li><a href="#">Open in Historian</a></li>
      </ul>
    </div>
  );
}