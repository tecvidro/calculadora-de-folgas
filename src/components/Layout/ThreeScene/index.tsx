'use client'
import { useCallback, useEffect, useRef } from 'react'
import {
  Box3,
  Color,
  type Group,
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
  const { gapHeight, gapWidth } = useCalculator()
  const containerRef = useRef<HTMLDivElement>(null)

  const trilhoSupRef = useRef<Group | null>(null)
  const trilhoInfRef = useRef<Group | null>(null)
  const initialWidthRef = useRef<number | null>(null)

  const rendererRef = useRef<WebGLRenderer | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  const centerModel = useCallback((gltfGroup: Group) => {
    const box = new Box3().setFromObject(gltfGroup)
    const center = box.getCenter(new Vector3())
    gltfGroup.position.sub(center)
    return box.getSize(new Vector3())
  }, [])

  const updateTransforms = useCallback(() => {
    if (
      !(
        trilhoSupRef.current &&
        trilhoInfRef.current &&
        initialWidthRef.current
      ) ||
      gapWidth === 0
    ) {
      return
    }

    const scaleX = gapWidth / initialWidthRef.current / 1000
    trilhoSupRef.current.scale.set(scaleX, 1, 1)
    trilhoInfRef.current.scale.set(scaleX, 1, 1)
    trilhoSupRef.current.position.y = gapHeight / 1000
  }, [gapHeight, gapWidth])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const container = containerRef.current

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const scene = new Scene()
    scene.background = new Color(0xdd_dd_dd)

    const environment = new RoomEnvironment()
    const pmremGenerator = new PMREMGenerator(renderer)
    scene.environment = pmremGenerator.fromScene(environment).texture
    sceneRef.current = scene

    const camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controlsRef.current = controls

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    loader.load('/models/parts/trilho-inf.glb', (gltf) => {
      const group = gltf.scene
      const size = centerModel(group)
      initialWidthRef.current = size.x
      trilhoInfRef.current = group
      scene.add(group)
      updateTransforms()
    })

    loader.load('/models/parts/trilho-sup.glb', (gltf) => {
      const group = gltf.scene
      const size = centerModel(group)
      initialWidthRef.current = size.x
      trilhoSupRef.current = group
      scene.add(group)
      updateTransforms()
    })

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!container) {
        return
      }
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      container.removeChild(renderer.domElement)
      trilhoInfRef.current = null
      trilhoSupRef.current = null
      initialWidthRef.current = null
      sceneRef.current = null
      cameraRef.current = null
      controlsRef.current = null
      rendererRef.current = null
    }
  }, [centerModel])

  useEffect(() => {
    updateTransforms()
  }, [updateTransforms])

  return (
    <div
      className="relative h-full max-h-[700px] min-h-[500px] w-full overflow-hidden rounded"
      ref={containerRef}
    />
  )
}

export default ThreeScene
