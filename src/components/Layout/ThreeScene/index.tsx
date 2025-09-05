'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box3,
  Color,
  type Object3D,
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
import { useCalculator } from '@/context/calculator-context'

const ThreeScene = () => {
  const { gapWidth, gapHeight, panelCount, doorsCount } = useCalculator()
  const containerRef = useRef<HTMLDivElement>(null)
  const modelsRef = useRef<Record<string, Object3D>>({})
  const originalDimensionsRef = useRef<Record<string, Vector3>>({})
  const sceneRef = useRef<Scene | null>(null) // Nova ref para a scene
  const clonedModelsRef = useRef<Record<string, Object3D>>({}) // Nova ref para clones

  const [modelsLoaded, setModelsLoaded] = useState(0)

  // RENDERERS
  const setupRenderers = useCallback((container: HTMLDivElement) => {
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    return { renderer }
  }, [])

  // SCENE
  const setupScene = useCallback((renderer: WebGLRenderer) => {
    const environment = new RoomEnvironment()
    const pmremGenerator = new PMREMGenerator(renderer)

    const scene = new Scene()
    scene.background = new Color(0xdd_dd_dd)
    scene.environment = pmremGenerator.fromScene(environment).texture

    return scene
  }, [])

  //CAMERA
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

  // Controls
  const setupControls = useCallback(
    (camera: PerspectiveCamera, renderer: WebGLRenderer) => {
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.autoRotate = false
      controls.minPolarAngle = 0
      controls.maxPolarAngle = Math.PI / 2
      controls.autoRotateSpeed = -2.0
      return controls
    },
    []
  )

  // FIt Camera
  const fitCameraToScene = useCallback(
    (cam: PerspectiveCamera, ctrls: OrbitControls, obj: Object3D) => {
      const boundingBox = new Box3().setFromObject(obj)
      const boxCenter = boundingBox.getCenter(new Vector3())
      const boxSize = boundingBox.getSize(new Vector3())

      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z)
      const fov = cam.fov * (Math.PI / 180)
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))

      cameraZ *= 1.2 // Add some padding

      cam.position.set(boxCenter.x, boxCenter.y, boxCenter.z + cameraZ)
      ctrls.target.copy(boxCenter)
      ctrls.update()
    },
    []
  )

  // RESIZE
  const createResizeHandler = useCallback(
    (
      containerElement: HTMLDivElement,
      perspectiveCamera: PerspectiveCamera,
      webGLRenderer: WebGLRenderer
    ) => {
      return () => {
        const width = containerElement.clientWidth
        const height = containerElement.clientHeight

        perspectiveCamera.aspect = width / height
        perspectiveCamera.updateProjectionMatrix()

        webGLRenderer.setSize(width, height)
      }
    },
    []
  )

  //Animation
  const createAnimationLoop = useCallback(
    (
      orbitControls: OrbitControls,
      webGLRenderer: WebGLRenderer,
      threeScene: Scene,
      perspectiveCamera: PerspectiveCamera
    ) => {
      const animate = (): number => {
        orbitControls.update()
        webGLRenderer.render(threeScene, perspectiveCamera)
        return requestAnimationFrame(animate)
      }

      return animate()
    },
    []
  )

  // CLEAN UP
  const createCleanup = useCallback(
    (
      frameId: number,
      resizeHandler: () => void,
      orbitControls: OrbitControls,
      webGLRenderer: WebGLRenderer,
      containerElement: HTMLDivElement
    ) => {
      return () => {
        cancelAnimationFrame(frameId)
        window.removeEventListener('resize', resizeHandler)
        orbitControls.dispose()
        webGLRenderer.dispose()
        containerElement.removeChild(webGLRenderer.domElement)
      }
    },
    []
  )

  // LOADER
  const loadModel = useCallback(
    (
      threeScene: Scene,
      perspectiveCamera: PerspectiveCamera,
      orbitControls: OrbitControls,
      modelFilename: string
    ) => {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      loader.setDRACOLoader(dracoLoader)

      loader.load(
        `/models/parts/${modelFilename}.glb`,
        (gltf) => {
          const boundingBox = new Box3().setFromObject(gltf.scene)
          const size = boundingBox.getSize(new Vector3())
          originalDimensionsRef.current[modelFilename] = size.clone() // Store original size
          const boxCenter = boundingBox.getCenter(new Vector3())
          gltf.scene.position.sub(boxCenter)
          threeScene.add(gltf.scene)
          modelsRef.current[modelFilename] = gltf.scene
          modelsRef.current[modelFilename].position.set(0, 0, 0)
          fitCameraToScene(perspectiveCamera, orbitControls, gltf.scene)

          setModelsLoaded((prev) => prev + 1)
        },
        undefined
      )
    },
    [fitCameraToScene]
  )

  useEffect(() => {
    const currentContainer = containerRef.current
    if (typeof window === 'undefined' || !currentContainer) {
      return
    }

    const { renderer } = setupRenderers(currentContainer)
    const scene = setupScene(renderer)
    sceneRef.current = scene // Armazenar referência da scene

    const camera = setupCamera(currentContainer)
    const controls = setupControls(camera, renderer)

    loadModel(scene, camera, controls, 'trilho-sup')
    loadModel(scene, camera, controls, 'trilho-inf')

    const frameId = createAnimationLoop(controls, renderer, scene, camera)
    const handleResize = createResizeHandler(currentContainer, camera, renderer)

    window.addEventListener('resize', handleResize)

    return createCleanup(
      frameId,
      handleResize,
      controls,
      renderer,
      currentContainer
    )
  }, [
    setupRenderers,
    setupScene,
    setupCamera,
    setupControls,
    loadModel,
    createAnimationLoop,
    createResizeHandler,
    createCleanup,
  ])

  const scaleAndPositionTrilhoSup = useCallback(
    (trilhoSup: Object3D, trilhoSupOriginalSize: Vector3) => {
      const originalWidth = trilhoSupOriginalSize.x
      const desiredWidth = gapWidth / 1000

      if (originalWidth > 0) {
        const scaleFactor = desiredWidth / originalWidth
        trilhoSup.scale.x = scaleFactor
      }

      trilhoSup.position.set(0, gapHeight / 1000, 0)
    },
    [gapWidth, gapHeight]
  )

  const clearTrilhoSupClones = useCallback(() => {
    if (!sceneRef.current) {
      return
    }
    for (const key of Object.keys(clonedModelsRef.current).filter((k) =>
      k.startsWith('trilho-sup-clone')
    )) {
      sceneRef.current.remove(clonedModelsRef.current[key])
      delete clonedModelsRef.current[key]
    }
  }, [])

  const createTrilhoSupClones = useCallback(
    (trilhoSup: Object3D) => {
      if (!sceneRef.current) {
        return
      }
      const numberOfClones =
        panelCount + doorsCount > 1 ? panelCount + doorsCount - 1 : 0

      for (let i = 0; i < numberOfClones; i++) {
        const trilhoSupClone = trilhoSup.clone()
        trilhoSupClone.position.set(0, gapHeight / 1000, 0.03 * (i + 1))
        sceneRef.current.add(trilhoSupClone)
        clonedModelsRef.current[`trilho-sup-clone-${i}`] = trilhoSupClone
      }
    },
    [panelCount, doorsCount, gapHeight]
  )

  useEffect(() => {
    if (modelsLoaded >= 2 && sceneRef.current) {
      const trilhoSup = modelsRef.current['trilho-sup']
      const trilhoSupOriginalSize = originalDimensionsRef.current['trilho-sup']

      if (trilhoSup && trilhoSupOriginalSize) {
        scaleAndPositionTrilhoSup(trilhoSup, trilhoSupOriginalSize)
        clearTrilhoSupClones()
        createTrilhoSupClones(trilhoSup)
      }
    }
  }, [
    modelsLoaded,
    scaleAndPositionTrilhoSup,
    clearTrilhoSupClones,
    createTrilhoSupClones,
  ])

  useEffect(() => {
    if (modelsLoaded >= 2) {
      const trilhoInf = modelsRef.current['trilho-inf']
      const trilhoInfOriginalSize = originalDimensionsRef.current['trilho-inf']

      if (trilhoInf && trilhoInfOriginalSize) {
        const originalWidth = trilhoInfOriginalSize.x
        const desiredWidth = gapWidth / 1000

        if (originalWidth > 0) {
          const scaleFactor = desiredWidth / originalWidth
          trilhoInf.scale.x = scaleFactor
        }

        trilhoInf.position.set(0, 0, 0)
      }
    }
  }, [modelsLoaded, gapWidth])

  return (
    <div
      className="relative h-full max-h-[700px] min-h-[500px] w-full overflow-hidden rounded"
      ref={containerRef}
    />
  )
}

export default ThreeScene
