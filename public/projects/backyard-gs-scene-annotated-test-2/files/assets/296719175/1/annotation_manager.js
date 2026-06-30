var AnnotationManager = pc.createScript('annotationManager');

AnnotationManager.prototype.initialize = function () {
    this.managerEntity = this.entity;

    this.annotations = this.app.annotations;
    console.log("Loaded annotations:", this.annotations);

    // --- Create a Screen for UI buttons ---
    this.screen = new pc.Entity("HotspotScreen");
    this.screen.addComponent("screen", {
        space: pc.SCREENSPACE,
        referenceResolution: new pc.Vec2(1920, 1080),
        scaleMode: pc.SCALEMODE_BLEND
    });
    this.app.root.addChild(this.screen);

    this.hotspots = [];
    this.buttons = [];

    this.spawnHotspots();

    AnnotationManager.prototype.forceUILast = function () {
        const cameraEntity = this.app.root.findByName("Camera");
        const cam = cameraEntity.camera;

        // Get current camera layer IDs
        const layerIds = cam.layers.slice(); // clone

        // Find UI layer ID
        const uiLayer = this.app.scene.layers.getLayerByName("UI");
        const uiId = uiLayer.id;

        // Remove UI layer from its current position
        const index = layerIds.indexOf(uiId);
        if (index !== -1) {
            layerIds.splice(index, 1);
        }

        // Add UI layer at the end
        layerIds.push(uiId);

        // Apply new order
        cam.layers = layerIds;

        console.log("UI layer forced last in camera layer order:", layerIds);
    };
    this.forceUILast();

    AnnotationManager.prototype.printLayerOrder = function () {
        console.log("---- FINAL LAYER ORDER ----");
        this.app.scene.layers.layerList.forEach(layer => {
            console.log(layer.name);
        });
        console.log("---------------------------");
    };
    this.printLayerOrder();

};

AnnotationManager.prototype.spawnHotspots = function () {
    this.annotations.forEach(asset => {

        // --- Create a 3D hotspot anchor (invisible) ---
        const hotspot = new pc.Entity(asset.id);
        hotspot.setPosition(asset.position[0], asset.position[1], asset.position[2]);
        this.managerEntity.addChild(hotspot);
        this.hotspots.push(hotspot);

        // --- Create a UI button for this hotspot ---
        const button = new pc.Entity("Button_" + asset.id);
        button.addComponent("element", {
            type: pc.ELEMENTTYPE_IMAGE,
            width: 40,
            height: 40,
            useInput: true,
            color: new pc.Color(1, 0, 0)
        });

        // Optional: add text label
        const label = new pc.Entity("Label_" + asset.id);
        label.addComponent("element", {
            type: pc.ELEMENTTYPE_TEXT,
            text: asset.id,
            fontSize: 16,
            color: new pc.Color(1, 1, 1)
        });
        button.addChild(label);

        // Add click handler
        button.element.on('click', () => {
            console.log("Clicked hotspot:", asset.id);
        });

        this.screen.addChild(button);
        this.buttons.push(button);

        console.log("Spawned UI button for hotspot:", asset.id);
    });
    AnnotationManager.prototype.printButtonLayers = function () {
            console.log("---- BUTTON LAYERS ----");

            this.buttons.forEach(button => {
                const layers = button.element.layers;
                console.log(button.name, "layers:", layers);
            });

            console.log("-----------------------");
        };
    this.printButtonLayers();
};

// Fix GSplat overriding layer order every frame
AnnotationManager.prototype.postCameraFix = function () {
    const cameraEntity = this.app.root.findByName("Camera");
    const cam = cameraEntity.camera;

    const layerIds = cam.layers.slice(); // clone

    const uiLayer = this.app.scene.layers.getLayerByName("UI");
    const uiId = uiLayer.id;

    const index = layerIds.indexOf(uiId);
    if (index !== -1) {
        layerIds.splice(index, 1);
    }

    layerIds.push(uiId); // force UI last

    cam.layers = layerIds;
};


// ⭐ This function actually exists now
AnnotationManager.prototype.updateButtons = function (dt) {
    const cameraEntity = this.app.root.findByName("Camera");
    const camera = cameraEntity.camera;

    const device = this.app.graphicsDevice;
    const width = device.width;
    const height = device.height;

    for (let i = 0; i < this.hotspots.length; i++) {
        const hotspot = this.hotspots[i];
        const button = this.buttons[i];

        const worldPos = hotspot.getPosition();
        const screenPos = new pc.Vec3();

        // Correct projection for your GSplat build
        screenPos.copy(worldPos);
        screenPos.project(
            cameraEntity.getWorldTransform(),
            camera.projectionMatrix,
            width,
            height
        );

        button.setLocalPosition(screenPos.x, height - screenPos.y, 0);
    }
};


// ⭐ Main update loop
AnnotationManager.prototype.update = function (dt) {
    this.postCameraFix();     // force UI last every frame
    this.updateButtons(dt);   // now this function exists
};
