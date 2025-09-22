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
  const {
    gapWidth,
    gapHeight,
    panelCount,
    doorsCount,
    doorsWidth,
    panelsWidth,
  } = useCalculator()
  const totalPanels = panelCount + doorsCount
  const totalDoorWidth = doorsWidth / 1000
  const totalPanelsWidth = panelsWidth / 1000

  const containerRef = useRef<HTMLDivElement>(null)
  const modelsRef = useRef<Record<string, Object3D>>({})
  const sceneRef = useRef<Scene | null>(null)

  const [modelsLoaded, setModelsLoaded] = useState(0)

  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

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
      modelFilename: string,
      refName: string,
      initialPosition?: Vector3
    ) => {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      loader.setDRACOLoader(dracoLoader)

      loader.load(
        `/models/parts/${modelFilename}.glb`,
        (gltf) => {
          const boundingBox = new Box3().setFromObject(gltf.scene)
          const boxCenter = boundingBox.getCenter(new Vector3())
          gltf.scene.position.sub(boxCenter)
          threeScene.add(gltf.scene)
          modelsRef.current[refName] = gltf.scene
          modelsRef.current[refName].position.copy(
            initialPosition || new Vector3(0, 0, 0)
          )

          setModelsLoaded((prev) => prev + 1)
        },
        undefined
      )
    },
    []
  )

  // SETUP SCENE
  useEffect(() => {
    const currentContainer = containerRef.current
    if (typeof window === 'undefined' || !currentContainer) {
      return
    }

    const { renderer } = setupRenderers(currentContainer)
    const scene = setupScene(renderer)
    sceneRef.current = scene // Armazenar referência da scene

    const camera = setupCamera(currentContainer)
    cameraRef.current = camera
    const controls = setupControls(camera, renderer)
    controlsRef.current = controls

    loadModel(scene, 'VDPL_porta_esq', 'VDPL_porta-1')

    for (let i = 0; i < panelCount; i++) {
      const trackY = 0.031
      const statingY = -(trackY * i + trackY)
      loadModel(
        scene,
        'VDPL_painel',
        `VDPL_painel-${i + 1}`,
        new Vector3(0, 0, statingY)
      )
    }

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

  // PORTA
  useEffect(() => {
    if (modelsLoaded >= 1 && sceneRef.current) {
      const porta1 = modelsRef.current['VDPL_porta-1']

      if (porta1) {
        const boneDoorCTRL = porta1.getObjectByName('BN_door_ctrl')
        // const boneDoorBase = porta1.getObjectByName('BN_door_base')
        const boneDoorW = porta1.getObjectByName('BN_door_w')
        const boneDoorH = porta1.getObjectByName('BN_door_h')
        const boneProfilesCTRL = porta1.getObjectByName('BN_track_ctrl')
        // const boneProfilesBase = porta1.getObjectByName('BN_track_base')
        const boneProfilesW = porta1.getObjectByName('BN_track_w')
        const boneProfilesH = porta1.getObjectByName('BN_track_h')
        porta1.position.set(0.0, 0, 0)
        if (
          boneProfilesCTRL &&
          boneProfilesW &&
          boneProfilesH &&
          boneDoorCTRL &&
          boneDoorW &&
          boneDoorH
        ) {
          boneProfilesCTRL.position.x = gapWidth / 1000
          boneProfilesW.position.x = gapWidth / 1000
          boneProfilesCTRL.position.y = gapHeight / 1000
          boneProfilesH.position.y = gapHeight / 1000
          boneDoorCTRL.position.x = totalDoorWidth
          boneDoorCTRL.position.y = gapHeight / 1000
          boneDoorW.position.x = totalDoorWidth
          boneDoorH.position.y = gapHeight / 1000
        }
      }
    }
  }, [modelsLoaded, gapHeight, gapWidth, totalDoorWidth])

  // PAINEL
  useEffect(() => {
    if (modelsLoaded >= 2 && sceneRef.current) {
      const painel1 = modelsRef.current['VDPL_painel-1']

      if (painel1) {
        const bonePanelCTRL = painel1.getObjectByName('BN_painel_ctrl')
        const boneDoorBase = painel1.getObjectByName('BN_painel_base')
        const bonePanelW = painel1.getObjectByName('BN_painel_w')
        const bonePanelH = painel1.getObjectByName('BN_painel_h')
        const boneProfilesCTRL = painel1.getObjectByName('BN_track_ctrl')
        // const boneProfilesBase = porta1.getObjectByName('BN_track_base')
        const boneProfilesW = painel1.getObjectByName('BN_track_w')
        const boneProfilesH = painel1.getObjectByName('BN_track_h')
        if (
          boneProfilesCTRL &&
          boneProfilesW &&
          boneProfilesH &&
          bonePanelCTRL &&
          bonePanelW &&
          bonePanelH &&
          boneDoorBase
        ) {
          boneDoorBase.position.x = totalDoorWidth
          boneProfilesCTRL.position.x = gapWidth / 1000
          boneProfilesW.position.x = gapWidth / 1000
          boneProfilesCTRL.position.y = gapHeight / 1000
          boneProfilesH.position.y = gapHeight / 1000
          bonePanelCTRL.position.x = panelsWidth / 1000
          bonePanelCTRL.position.y = gapHeight / 1000
          bonePanelW.position.x = panelsWidth / 1000
          bonePanelH.position.y = gapHeight / 1000
        }
      }
    }
  }, [modelsLoaded, gapHeight, gapWidth, totalDoorWidth, panelsWidth])

  // // PAINEIS
  // useEffect(() => {
  //   if (modelsLoaded >= 4 && sceneRef.current) {
  //     for (let i = 0; i < panelCount; i++) {
  //       setupPanel(i)
  //     }
  //   }
  // }, [modelsLoaded, panelCount, setupPanel])
  //

  // RECENTER SCENE
  //biome-ignore lint: need all the dependencies to run
  useEffect(() => {
    if (
      sceneRef.current &&
      cameraRef.current &&
      controlsRef.current &&
      modelsLoaded >= 4
    ) {
      fitCameraToScene(cameraRef.current, controlsRef.current, sceneRef.current)
    }
  }, [
    gapWidth,
    gapHeight,
    panelCount,
    doorsCount,
    doorsWidth,
    panelsWidth,
    modelsLoaded,
    fitCameraToScene,
  ])

  return (
    <div
      className="relative h-full max-h-[700px] min-h-[500px] w-full overflow-hidden rounded"
      ref={containerRef}
    />
  )
}

export default ThreeScene
