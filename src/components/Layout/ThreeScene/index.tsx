'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box3,
  Color,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import {
  DRACOLoader,
  GLTFLoader,
  OrbitControls,
  RoomEnvironment,
} from 'three/examples/jsm/Addons.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useCalculator } from '@/context/calculator-context'

const ThreeScene = () => {
  const { gapHeight } = useCalculator()
  const containerRef = useRef<HTMLDivElement>(null)
  const [trilhoSup, setTrilhoSup] = useState<GLTF | null>(null)

  // Renderer setup
  const setupRenderers = useCallback((container: HTMLDivElement) => {
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    return { renderer }
  }, [])

  // Scene setup
  const setupScene = useCallback((renderer: WebGLRenderer) => {
    const environment = new RoomEnvironment()
    const pmremGenerator = new PMREMGenerator(renderer)
    const scene = new Scene()
    scene.background = new Color(0xdd_dd_dd)
    scene.environment = pmremGenerator.fromScene(environment).texture

    return scene
  }, [])

  // Camera setup
  const setupCamera = useCallback((container: HTMLDivElement) => {
    const camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    return camera
  }, [])

  // Controls setup
  const setupControls = useCallback(
    (camera: PerspectiveCamera, renderer: WebGLRenderer) => {
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      return controls
    },
    []
  )

  const loadModel = useCallback((threeScene: Scene) => {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    // Load trilho inferiror
    loader.load(
      '/models/parts/trilho-inf.glb',
      (gltf) => {
        const boundingBox = new Box3().setFromObject(gltf.scene)
        const boxCenter = boundingBox.getCenter(new Vector3())
        gltf.scene.position.sub(boxCenter)
        threeScene.add(gltf.scene)
      },
      undefined
    )

    // Load trilho Superior
    loader.load(
      '/models/parts/trilho-sup.glb',
      (trilhoSupGltf) => {
        const boundingBox = new Box3().setFromObject(trilhoSupGltf.scene)
        const boxCenter = boundingBox.getCenter(new Vector3())
        trilhoSupGltf.scene.position.sub(boxCenter)
        threeScene.add(trilhoSupGltf.scene)
        setTrilhoSup(trilhoSupGltf)
      },
      undefined
    )
  }, [])

  useEffect(() => {
    const currentContainer = containerRef.current
    if (typeof window === 'undefined' || !currentContainer) {
      return
    }

    const { renderer } = setupRenderers(currentContainer)
    const scene = setupScene(renderer)
    const camera = setupCamera(currentContainer)
    const controls = setupControls(camera, renderer)

    loadModel(scene)

    const animate = () => {
      requestAnimationFrame(animate)

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (currentContainer) {
        camera.aspect =
          currentContainer.clientWidth / currentContainer.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(
          currentContainer.clientWidth,
          currentContainer.clientHeight
        )
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [loadModel, setupCamera, setupControls, setupRenderers, setupScene])

  useEffect(() => {
    if (trilhoSup) {
      trilhoSup.scene.position.y = gapHeight / 1000
    }
  }, [gapHeight, trilhoSup])

  return (
    <div
      className="relative h-full max-h-[700px] min-h-[500px] w-full overflow-hidden rounded"
      ref={containerRef}
    />
  )
}

export default ThreeScene
