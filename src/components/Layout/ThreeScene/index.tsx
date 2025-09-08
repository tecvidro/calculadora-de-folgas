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
import { p } from 'motion/react-client'

const ThreeScene = () => {
  const { gapWidth, gapHeight, panelCount, doorsCount } = useCalculator()
  let totalPanels = panelCount + doorsCount
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
    loadModel(scene, camera, controls, 'perfil-u-laminado')

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

  const scaleAndPosition = useCallback(
    (
      object: Object3D,
      originalSize: Vector3,
      desiredSize: { width?: number; height?: number },
      position: { x: number; y: number; z: number }
    ) => {
      const originalWidth = originalSize.x
      const originalHeight = originalSize.y
      const desiredWidth = desiredSize.width
        ? desiredSize.width
        : originalSize.x
      const desiredHeight = desiredSize.height
        ? desiredSize.height
        : originalSize.y

      if (originalWidth > 0 && desiredSize.width) {
        const scaleFactorWidth = desiredWidth / originalWidth
        object.scale.x = scaleFactorWidth
      }

      if (originalHeight > 0 && desiredSize.height) {
        const scaleFactorHeight = desiredHeight / originalHeight
        object.scale.y = scaleFactorHeight
      }

      object.position.set(position.x, position.y, position.z)
    },
    []
  )

  const clearClones = useCallback((name: string) => {
    if (!sceneRef.current) {
      return
    }
    for (const key of Object.keys(clonedModelsRef.current).filter((k) =>
      k.startsWith(`${name}-clone`)
    )) {
      sceneRef.current.remove(clonedModelsRef.current[key])
      delete clonedModelsRef.current[key]
    }
  }, [])

  // CREATE TRACKS CLONES
  const createTracksClones = useCallback(
    (object: Object3D, name: string) => {
      if (!sceneRef.current) {
        return
      }
      const numberOfClones =
        panelCount + doorsCount > 1 ? panelCount + doorsCount - 1 : 0

      for (let i = 0; i < numberOfClones; i++) {
        const trilhoSupClone = object.clone()
        const objectPosition = object.position
        trilhoSupClone.position.set(
          objectPosition.x,
          objectPosition.y,
          objectPosition.z + 0.031 * (i + 1)
        )
        sceneRef.current.add(trilhoSupClone)
        clonedModelsRef.current[`${name}-clone-${i}`] = trilhoSupClone
      }
    },
    [panelCount, doorsCount]
  )

  // CREATE DOOR/U-PROFILE CLONE
  const createDoorAndUProfileClone = useCallback(
    (object: Object3D, name: string) => {
      if (!sceneRef.current) {
        return
      }
      const pertfilUClone = object.clone()
      pertfilUClone.position.set(gapWidth / 1000, 0, (totalPanels - 1) * 0.031)
      sceneRef.current.add(pertfilUClone)
      pertfilUClone.rotateY(Math.PI)
      clonedModelsRef.current[`${name}-clone`] = pertfilUClone
    },
    [totalPanels, gapWidth]
  )

  // TRILHOS SUPERIORES
  useEffect(() => {
    if (modelsLoaded >= 2 && sceneRef.current) {
      const trilhoSup = modelsRef.current['trilho-sup']
      const trilhoSupOriginalSize = originalDimensionsRef.current['trilho-sup']

      if (trilhoSup && trilhoSupOriginalSize) {
        scaleAndPosition(
          trilhoSup,
          trilhoSupOriginalSize,
          { width: gapWidth / 1000 },
          {
            x: 0,
            y: gapHeight / 1000,
            z: 0,
          }
        )
        clearClones('trilho-sup')
        createTracksClones(trilhoSup, 'trilho-sup')
      }
    }
  }, [
    modelsLoaded,
    gapHeight,
    gapWidth,
    scaleAndPosition,
    clearClones,
    createTracksClones,
  ])

  // TRILHOS INFERIORES
  useEffect(() => {
    if (modelsLoaded >= 2 && sceneRef.current) {
      const trilhoInf = modelsRef.current['trilho-inf']
      const trilhoInfOriginalSize = originalDimensionsRef.current['trilho-inf']

      if (trilhoInf && trilhoInfOriginalSize) {
        scaleAndPosition(
          trilhoInf,
          trilhoInfOriginalSize,
          { width: gapWidth / 1000 },
          { x: 0, y: 0, z: 0 }
        )
        clearClones('trilho-inf')
        createTracksClones(trilhoInf, 'trilho-inf')
      }
    }
  }, [
    modelsLoaded,
    gapWidth,
    scaleAndPosition,
    clearClones,
    createTracksClones,
  ])

  // PERFIL U
  useEffect(() => {
    if (modelsLoaded >= 2 && sceneRef.current) {
      const perfilU = modelsRef.current['perfil-u-laminado']
      const perfilUOriginalSize =
        originalDimensionsRef.current['perfil-u-laminado']
      if (perfilU && perfilUOriginalSize) {
        scaleAndPosition(
          perfilU,
          perfilUOriginalSize,
          { height: gapHeight / 1000 - 0.04 },
          { x: 0, y: 0, z: 0 }
        )
        clearClones('perfil-u')
        createDoorAndUProfileClone(perfilU, 'perfil-u')
      }
    }
  }, [
    modelsLoaded,
    gapHeight,
    clearClones,
    createDoorAndUProfileClone,
    scaleAndPosition,
  ])

  return (
    <div
      className="relative h-full max-h-[700px] min-h-[500px] w-full overflow-hidden rounded"
      ref={containerRef}
    />
  )
}

export default ThreeScene
