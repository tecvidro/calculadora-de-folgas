import type React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (typeof window === "undefined" || !currentContainer) {
      return;
    }

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      currentContainer.clientWidth,
      currentContainer.clientHeight,
    );
    currentContainer.appendChild(renderer.domElement);

    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdd_dd_dd);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      currentContainer.clientWidth / currentContainer.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Model Loader
    const loader = new GLTFLoader();
    loader.load(
      "/models/vdpo-2-portas.glb",
      (gltf) => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);
        scene.add(gltf.scene);
      },
      undefined,
    );

    let animationFrameId: number;
    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (currentContainer) {
        const width = currentContainer.clientWidth;
        const height = currentContainer.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="aspect-square h-full w-full overflow-hidden rounded"
      ref={containerRef}
    />
  );
};

export default ThreeScene;
