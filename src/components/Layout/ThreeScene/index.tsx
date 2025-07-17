import { useEffect, useRef } from 'react'
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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

type ThreeSceneProps = {
  filename: string
  labels: {
    panel: string
    door: string
  }
}

const ThreeScene = ({ filename, labels }: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentContainer = containerRef.current
    if (typeof window === 'undefined' || !currentContainer) {
      return
    }

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(
      currentContainer.clientWidth,
      currentContainer.clientHeight
    )
    currentContainer.appendChild(renderer.domElement)

    // CSS2DRenderer for labels
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(
      currentContainer.clientWidth,
      currentContainer.clientHeight
    )
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0px'
    labelRenderer.domElement.style.pointerEvents = 'none' // Allow interaction with the canvas below
    currentContainer.appendChild(labelRenderer.domElement)

    const environment = new RoomEnvironment()
    const pmremGenerator = new PMREMGenerator(renderer)

    // Scene
    const scene = new Scene()
    scene.background = new Color(0xdd_dd_dd)
    scene.environment = pmremGenerator.fromScene(environment).texture

    // Camera
    const camera = new PerspectiveCamera(
      45,
      currentContainer.clientWidth / currentContainer.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = true // Enable auto-rotation
    controls.autoRotateSpeed = -2.0 // Set rotation speed

    // Stop auto-rotation after a few seconds
    setTimeout(() => {
      controls.autoRotate = false
    }, 3000) // 5 seconds

    // Model Loader
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load(
      `/models/${filename}.glb`,
      (gltf) => {
        const box = new Box3().setFromObject(gltf.scene)
        const center = box.getCenter(new Vector3())
        gltf.scene.position.sub(center)
        scene.add(gltf.scene)

        // Function to fit camera to scene
        const fitCameraToScene = (
          cam: PerspectiveCamera,
          ctrls: OrbitControls,
          obj: Object3D
        ) => {
          const box2 = new Box3().setFromObject(obj)
          const center2 = box2.getCenter(new Vector3())
          const size = box2.getSize(new Vector3())

          const maxDim = Math.max(size.x, size.y, size.z)
          const fov = cam.fov * (Math.PI / 180)
          let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))

          cameraZ *= 1.2 // Add some padding

          cam.position.set(center2.x, center2.y, center2.z + cameraZ)
          ctrls.target.copy(center2)
          ctrls.update()
        }

        fitCameraToScene(camera, controls, gltf.scene)

        // Add labels to model objects
        gltf.scene.traverse((object) => {
          if (object.type === 'Object3D' && object.name.startsWith('label')) {
            const labelDiv = document.createElement('div')
            const name = object.name.split('-')[1]
            let labelText = ''

            if (name.toLowerCase().startsWith('painel')) {
              labelText = labels.panel
            } else if (name.toLowerCase().startsWith('porta')) {
              labelText = labels.door
            }

            labelDiv.className = 'label'
            labelDiv.textContent = labelText
            labelDiv.style.backgroundColor = 'rgba(255,255,255,0.5)'
            labelDiv.style.padding = '5px'
            labelDiv.style.borderRadius = '3px'
            labelDiv.style.fontSize = '16px'
            labelDiv.style.color = 'black'
            labelDiv.style.whiteSpace = 'nowrap'

            const label = new CSS2DObject(labelDiv)
            // Get the world position of the object and set the label's position
            const worldPosition = new Vector3()
            object.getWorldPosition(worldPosition)
            label.position.copy(worldPosition)
            scene.add(label)
          }
        })
      },
      undefined
    )

    let animationFrameId: number
    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera) // Render labels
    }
    animate()

    const handleResize = () => {
      if (currentContainer) {
        const width = currentContainer.clientWidth
        const height = currentContainer.clientHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()

        renderer.setSize(width, height)
        labelRenderer.setSize(width, height) // Resize label renderer
      }
    }

    window.addEventListener('resize', handleResize)

    // Clean up the event listener when the component is unmounted
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      renderer.dispose()
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement)
        currentContainer.removeChild(labelRenderer.domElement) // Clean up label renderer
      }
    }
  }, [filename, labels])

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded"
      ref={containerRef}
    />
  )
}

export default ThreeScene
