import { useRef, useEffect, useState } from "react";
import SidePanel from "../components/AnnotationsSidePanel"; 
import { SceneObject, PiPoint } from "../Types/Annotations/types";

export default function BackyardSceneAnnotated() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // When a dot is clicked inside the iframe, we store the selected object ID
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Your object metadata (React owns this, iframe only receives a copy)
  const objects: SceneObject[] = [
    {
      id: "BRAZIER_01",
      name: "Backyard Brazier",
      position: [-0.365, 0.731, 0.975],
      piTags: ["TEMP", "SMOKE"],
      description: "Outdoor brazier to farm complaints about smoke from the neighbours."
    },
    {
      id: "ROADCONE_121",
      name: "Orange Road Cone",
      position: [-0.22, 0.731, -1.967],
      piTags: ["VISIBILITY"],
      description: "Apparently valued at $36 to $50+."
    },
    {
      id: "WHEELBARROW_01",
      name: "Wheelbarrow",
      position: [9.9, 0.731, 2.277],
      piTags: ["FILLED_CAPACITY", "SPEED"],
      description: "Carries stuff I guess..."
    }
  ];

  // Send annotation objects into the iframe once it loads
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      iframe.contentWindow?.postMessage(
        {
          type: "annotateObjects",
          payload: { objects }
        },
        "*"
      );
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  // Listen for messages coming back from the iframe (objectSelected)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "objectSelected") {
        const id = event.data.payload.id;
        setSelectedObjectId(id);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Find the selected object metadata
  const selectedObject = objects.find(o => o.id === selectedObjectId);

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full">

      {/* The PlayCanvas iframe */}
      <iframe
        ref={iframeRef}
        src="/projects/backyard-gs-scene-annotated/index.html"
        title="Backyard GS Scene (Annotated)"
        className="w-full h-full border-0"
        allow="fullscreen"
      />

      {/* Slide-out side panel */}
      {selectedObject && (
        <SidePanel
          object={selectedObject}
          onClose={() => setSelectedObjectId(null)}
        />
      )}
    </div>
  );
}
