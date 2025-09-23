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
import { useParams } from 'next/navigation'

type ThreeSceneProps = {
  loadingTitle: string
  loadingText: string
}

const ThreeScene = ({ loadingTitle, loadingText }: ThreeSceneProps) => {
  const params = useParams()
  const isNotVdpl = params.products !== 'vdpl-2-portas'
  const {
    gapWidth,
    gapHeight,
    panelCount,
    doorsCount,
    doorsWidth,
    panelsWidth,
    lockDiscounts,
  } = useCalculator()

  const totalDoorWidth = doorsWidth / 1000 + lockDiscounts[0] / 1000

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
    (
      cam: PerspectiveCamera,
      ctrls: OrbitControls,
      obj: Object3D,
      manualBox?: Box3
    ) => {
      const boundingBox = manualBox || new Box3().setFromObject(obj)

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
    setModelsLoaded(0)
    modelsRef.current = {}
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
    loadModel(scene, 'VDPL_porta_dir', 'VDPL_porta-2')

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
    panelCount,
  ])

  // PORTA
  useEffect(() => {
    if (modelsLoaded >= panelCount && sceneRef.current) {
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
  }, [modelsLoaded, gapHeight, gapWidth, totalDoorWidth, panelCount])

  // PORTA 2
  useEffect(() => {
    if (modelsLoaded >= +panelCount && sceneRef.current) {
      const porta2 = modelsRef.current['VDPL_porta-2']

      if (porta2) {
        const boneDoorCTRL = porta2.getObjectByName('BN_door_ctrl')
        const boneDoorBase = porta2.getObjectByName('BN_door_base')
        const boneDoorW = porta2.getObjectByName('BN_door_w')
        const boneDoorH = porta2.getObjectByName('BN_door_h')
        const boneProfilesCTRL = porta2.getObjectByName('BN_track_ctrl')
        // const boneProfilesBase = porta1.getObjectByName('BN_track_base')
        const boneProfilesW = porta2.getObjectByName('BN_track_w')
        const boneProfilesH = porta2.getObjectByName('BN_track_h')
        porta2.position.set(0.0, 0, -(panelCount + doorsCount - 1) * 0.031)
        const firstPanelXLoc = totalDoorWidth
        const panelXLoc =
          firstPanelXLoc +
          (panelsWidth / 1000) * panelCount -
          0.015 * panelCount -
          0.019
        if (
          boneProfilesCTRL &&
          boneProfilesW &&
          boneProfilesH &&
          boneDoorCTRL &&
          boneDoorW &&
          boneDoorH &&
          boneDoorBase
        ) {
          boneDoorBase.position.x = panelXLoc
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
  }, [
    modelsLoaded,
    gapHeight,
    gapWidth,
    panelCount,
    doorsCount,
    totalDoorWidth,
    panelsWidth,
  ])

  const setupPanel = useCallback(
    (panelIndex: number) => {
      const painel = modelsRef.current[`VDPL_painel-${panelIndex + 1}`]
      const firstPanelXLoc = totalDoorWidth
      const panelXLoc =
        firstPanelXLoc +
        (panelsWidth / 1000) * panelIndex -
        0.015 * panelIndex -
        0.019

      if (!painel) {
        return
      }

      if (painel) {
        const bonePanelCTRL = painel.getObjectByName('BN_painel_ctrl')
        const bonePanelBase = painel.getObjectByName('BN_painel_base')
        const bonePanelW = painel.getObjectByName('BN_painel_w')
        const bonePanelH = painel.getObjectByName('BN_painel_h')
        const boneProfilesCTRL = painel.getObjectByName('BN_track_ctrl')
        // const boneProfilesBase = porta1.getObjectByName('BN_track_base')
        const boneProfilesW = painel.getObjectByName('BN_track_w')
        const boneProfilesH = painel.getObjectByName('BN_track_h')

        if (
          boneProfilesCTRL &&
          boneProfilesW &&
          boneProfilesH &&
          bonePanelCTRL &&
          bonePanelW &&
          bonePanelH &&
          bonePanelBase
        ) {
          bonePanelBase.position.x = panelXLoc
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
    },
    [gapHeight, gapWidth, totalDoorWidth, panelsWidth]
  )

  useEffect(() => {
    if (modelsLoaded >= +panelCount && sceneRef.current) {
      for (let i = 0; i < panelCount; i++) {
        setupPanel(i)
      }
    }
  }, [modelsLoaded, panelCount, setupPanel])

  // RECENTER SCENE
  //biome-ignore lint: need all the dependencies to run
  useEffect(() => {
    if (
      sceneRef.current &&
      cameraRef.current &&
      controlsRef.current &&
      modelsLoaded === 2 + panelCount
    ) {
      const depth = (panelCount + doorsCount) * 0.031
      const center = new Vector3(gapWidth / 2000, gapHeight / 2000, -depth / 2)
      const size = new Vector3(gapWidth / 1000, gapHeight / 1000, depth)
      const manualBox = new Box3().setFromCenterAndSize(center, size)

      fitCameraToScene(
        cameraRef.current,
        controlsRef.current,
        sceneRef.current,
        manualBox
      )
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

  const isLoading = modelsLoaded < 2 + panelCount

  return (
    <div className="relative h-full max-h-[700px] min-h-[500px] w-full overflow-hidden rounded bg-gray-100">
      {isLoading && (
        <div className=" flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <div className="flex w-full justify-center text-orange">
              <svg
                className="animate-spin"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Loader</title>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <p className="font-semibold text-lg text-orange">{loadingTitle}</p>
            <p className="rounded bg-dark-blue px-2 py-1 text-sm text-white">
              {modelsLoaded} de {2 + panelCount} {loadingText}
            </p>
          </div>
        </div>
      )}
      {isNotVdpl && (
        <div className=" flex h-full w-full items-center justify-center">
          <div>
            <p>Arquivo não encontrado</p>
          </div>
        </div>
      )}
      <div
        className="h-full w-full"
        ref={containerRef}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  )
}

export default ThreeScene
