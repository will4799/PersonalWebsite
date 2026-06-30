let annotations = [];
let camera = null;

pc.app.on("start", () => {
    camera = pc.app.root.findByName("Camera");
});

window.addEventListener("message", (event) => {
    const { type, payload } = event.data;

    if (type === "annotateObjects") {
        createAnnotations(payload.objects);
    }
});

function createAnnotations(objects) {
    const container = document.body;

    annotations = objects.map(obj => {
        const el = document.createElement("div");
        el.className = "annotation-dot";
        el.title = obj.name;

        // CLICK HANDLER → send message to React
        el.addEventListener("click", () => {
            window.parent.postMessage(
                {
                    type: "objectSelected",
                    payload: { id: obj.id }
                },
                "*"
            );
        });

        container.appendChild(el);

        return {
            el,
            position: new pc.Vec3(...obj.position)
        };
    });
}


pc.app.on("update", () => {
    if (!camera || !camera.camera || annotations.length === 0) return;

    const device = pc.app.graphicsDevice;
    const width = device.width;
    const height = device.height;

    annotations.forEach(a => {
        const screenPos = new pc.Vec3();

        // Correct API: use the camera component
        camera.camera.worldToScreen(a.position, screenPos);

        // Hide if behind camera
        if (screenPos.z < 0) {
            a.el.style.display = "none";
            return;
        }

        a.el.style.display = "block";

        a.el.style.left = screenPos.x + "px";
        a.el.style.top = screenPos.y + "px";
    });
});