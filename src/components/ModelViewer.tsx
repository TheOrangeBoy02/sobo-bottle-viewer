import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ModelViewerProps {
  selectedModel: File | null;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ selectedModel }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    const loader = new GLTFLoader();

    if (selectedModel) {
      const objectURL = URL.createObjectURL(selectedModel);
      loader.load(
        objectURL,
        (gltf) => {
          // Clear existing scene objects if necessary
          scene.clear();

          // Add the loaded model to the scene
          scene.add(gltf.scene);
          URL.revokeObjectURL(objectURL);

          // Center and scale the model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          gltf.scene.scale.multiplyScalar(scale);

          gltf.scene.position.sub(center.multiplyScalar(scale));
          camera.position.z = Math.max(size.x, size.y) * 2;

          controls.update();
        },
        undefined,
        (error) => {
          console.error('An error happened', error);
        }
      );
    } else {
      // Render a default cube if no model is loaded
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentRef) return;
      const { clientWidth, clientHeight } = currentRef;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      currentRef.removeChild(renderer.domElement);
    };
  }, [selectedModel]);

  return <div ref={mountRef} className="flex-1 h-[80vh] bg-black shadow-lg rounded-md" />;
};

export default ModelViewer;
