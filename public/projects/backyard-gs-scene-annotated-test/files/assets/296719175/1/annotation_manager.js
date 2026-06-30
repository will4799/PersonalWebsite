const SCALER = 0.1; // Only affects size, not position

var AnnotationManager = pc.createScript('annotationManager');

AnnotationManager.prototype.initialize = function () {
    this.managerEntity = this.entity;

    this.annotations = this.app.annotations;
    console.log("Loaded annotations:", this.annotations);

    this.spawnHotspots();
};

AnnotationManager.prototype.spawnHotspots = function () {
    this.annotations.forEach(asset => {

        // --- HOTSPOT ENTITY ---
        const hotspot = new pc.Entity(asset.id);

        // Use a BOX instead of a PLANE (planes vanish in GSplat)
        hotspot.addComponent("model", {
            type: "box"
        });

        // Scale down using your SCALER
        hotspot.setLocalScale(SCALER, SCALER, SCALER);

        // Emissive red so it ALWAYS shows
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(1, 0, 0);
        material.emissive = new pc.Color(1, 0, 0);
        material.emissiveIntensity = 2;
        material.cull = pc.CULLFACE_NONE;
        material.update();

        hotspot.model.material = material;

        // Position (unchanged)
        hotspot.setPosition(
            asset.position[0],
            asset.position[1],
            asset.position[2]
        );

        this.managerEntity.addChild(hotspot);

        console.log("Spawned hotspot cube at:", hotspot.getPosition());
    });
};

AnnotationManager.prototype.update = function (dt) {
    const camera = this.app.root.findByName("Camera");

    // Billboard the cube by rotating it to face the camera
    this.managerEntity.children.forEach(hotspot => {
        hotspot.lookAt(camera.getPosition());
    });
};
