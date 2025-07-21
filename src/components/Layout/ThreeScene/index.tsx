import { useCallback, useEffect, useRef } from "react";
import {
  Box3,
  Color,
  type Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

type ThreeSceneProps = {
  filename: string;
  labels: {
    panel: string;
    door: string;
    masonry: string;
  };
};

const ThreeScene = ({ filename, labels }: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract renderer setup logic
  const setupRenderers = useCallback((container: HTMLDivElement) => {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.pointerEvents = "none";
    container.appendChild(labelRenderer.domElement);

    return { renderer, labelRenderer };
  }, []);

  // Extract scene setup logic
  const setupScene = useCallback((renderer: WebGLRenderer) => {
    const environment = new RoomEnvironment();
    const pmremGenerator = new PMREMGenerator(renderer);

    const scene = new Scene();
    scene.background = new Color(0xdd_dd_dd);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    return scene;
  }, []);

  // Extract camera setup logic
  const setupCamera = useCallback((container: HTMLDivElement) => {
    const camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;
    return camera;
  }, []);

  // Extract controls setup logic
  const setupControls = useCallback(
    (camera: PerspectiveCamera, renderer: WebGLRenderer) => {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = false;
      controls.minPolarAngle = 0;
      controls.maxPolarAngle = Math.PI / 2;
      controls.autoRotateSpeed = -2.0;
      return controls;
    },
    [],
  );

  // Extract camera fitting logic
  const fitCameraToScene = useCallback(
    (cam: PerspectiveCamera, ctrls: OrbitControls, obj: Object3D) => {
      const boundingBox = new Box3().setFromObject(obj);
      const boxCenter = boundingBox.getCenter(new Vector3());
      const boxSize = boundingBox.getSize(new Vector3());

      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
      const fov = cam.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

      cameraZ *= 1.2; // Add some padding

      cam.position.set(boxCenter.x, boxCenter.y, boxCenter.z + cameraZ);
      ctrls.target.copy(boxCenter);
      ctrls.update();
    },
    [],
  );

  // Extract label text determination logic
  const getLabelText = useCallback(
    (objectName: string, labelsConfig: ThreeSceneProps["labels"]) => {
      const lowerName = objectName.toLowerCase();
      if (lowerName.startsWith("painel")) {
        return labelsConfig.panel;
      }
      if (lowerName.startsWith("porta")) {
        return labelsConfig.door;
      }
      if (lowerName.startsWith("alvenaria")) {
        return labelsConfig.masonry;
      }
      return "";
    },
    [],
  );

  // Extract label creation logic
  const createLabel = useCallback((text: string) => {
    const labelDiv = document.createElement("div");
    labelDiv.className = "label";
    labelDiv.textContent = text;
    labelDiv.style.backgroundColor = "rgba(255,255,255,0.5)";
    labelDiv.style.padding = "5px";
    labelDiv.style.borderRadius = "3px";
    labelDiv.style.fontSize = "16px";
    labelDiv.style.color = "black";
    labelDiv.style.whiteSpace = "nowrap";
    return new CSS2DObject(labelDiv);
  }, []);

  // Extract label processing logic
  const processLabels = useCallback(
    (
      threeScene: Scene,
      gltfScene: Object3D,
      labelsConfig: ThreeSceneProps["labels"],
    ) => {
      gltfScene.traverse((object) => {
        if (object.type === "Object3D" && object.name.startsWith("label")) {
          const objectName = object.name.split("-")[1];
          const labelText = getLabelText(objectName, labelsConfig);

          if (labelText) {
            const label = createLabel(labelText);
            const worldPosition = new Vector3();
            object.getWorldPosition(worldPosition);
            label.position.copy(worldPosition);
            threeScene.add(label);
          }
        }
      });
    },
    [getLabelText, createLabel],
  );

  // Extract model loading logic
  const loadModel = useCallback(
    (
      threeScene: Scene,
      perspectiveCamera: PerspectiveCamera,
      orbitControls: OrbitControls,
      modelFilename: string,
      labelsConfig: ThreeSceneProps["labels"],
    ) => {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        `/models/${modelFilename}.glb`,
        (gltf) => {
          const boundingBox = new Box3().setFromObject(gltf.scene);
          const boxCenter = boundingBox.getCenter(new Vector3());
          gltf.scene.position.sub(boxCenter);
          threeScene.add(gltf.scene);

          fitCameraToScene(perspectiveCamera, orbitControls, gltf.scene);
          processLabels(threeScene, gltf.scene, labelsConfig);
        },
        undefined,
      );
    },
    [fitCameraToScene, processLabels],
  );

  // Extract resize handler logic
  const createResizeHandler = useCallback(
    (
      containerElement: HTMLDivElement,
      perspectiveCamera: PerspectiveCamera,
      webGLRenderer: WebGLRenderer,
      css2DRenderer: CSS2DRenderer,
    ) => {
      return () => {
        const width = containerElement.clientWidth;
        const height = containerElement.clientHeight;

        perspectiveCamera.aspect = width / height;
        perspectiveCamera.updateProjectionMatrix();

        webGLRenderer.setSize(width, height);
        css2DRenderer.setSize(width, height);
      };
    },
    [],
  );

  // Extract animation loop logic
  const createAnimationLoop = useCallback(
    (
      orbitControls: OrbitControls,
      webGLRenderer: WebGLRenderer,
      css2DRenderer: CSS2DRenderer,
      threeScene: Scene,
      perspectiveCamera: PerspectiveCamera,
    ) => {
      const animate = (): number => {
        orbitControls.update();
        webGLRenderer.render(threeScene, perspectiveCamera);
        css2DRenderer.render(threeScene, perspectiveCamera);
        return requestAnimationFrame(animate);
      };

      return animate();
    },
    [],
  );

  // Extract cleanup logic
  const createCleanup = useCallback(
    (
      frameId: number,
      resizeHandler: () => void,
      orbitControls: OrbitControls,
      webGLRenderer: WebGLRenderer,
      css2DRenderer: CSS2DRenderer,
      containerElement: HTMLDivElement,
    ) => {
      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resizeHandler);
        orbitControls.dispose();
        webGLRenderer.dispose();
        containerElement.removeChild(webGLRenderer.domElement);
        containerElement.removeChild(css2DRenderer.domElement);
      };
    },
    [],
  );

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (typeof window === "undefined" || !currentContainer) {
      return;
    }

    const { renderer, labelRenderer } = setupRenderers(currentContainer);
    const scene = setupScene(renderer);
    const camera = setupCamera(currentContainer);
    const controls = setupControls(camera, renderer);

    loadModel(scene, camera, controls, filename, labels);

    const frameId = createAnimationLoop(
      controls,
      renderer,
      labelRenderer,
      scene,
      camera,
    );
    const handleResize = createResizeHandler(
      currentContainer,
      camera,
      renderer,
      labelRenderer,
    );

    window.addEventListener("resize", handleResize);

    return createCleanup(
      frameId,
      handleResize,
      controls,
      renderer,
      labelRenderer,
      currentContainer,
    );
  }, [
    filename,
    labels,
    setupRenderers,
    setupScene,
    setupCamera,
    setupControls,
    loadModel,
    createAnimationLoop,
    createResizeHandler,
    createCleanup,
  ]);

  return (
    <div
      className="relative h-full max-h-[700px] min-h-[500px] w-full overflow-hidden rounded"
      ref={containerRef}
    />
  );
};

export default ThreeScene;
