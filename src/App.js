import React, { useState, useCallback, Suspense } from 'react'
import { ARCanvas, useHitTest, Interactive } from '@react-three/xr'
import { useResource } from 'react-three-fiber'
import { Box, Sphere, useGLTF } from '@react-three/drei'
import uuid from 'short-uuid'
import './styles.css'

// For some reason this import doesn't work!
import reticle from './assets/reticle/reticle.gltf'

// The Anchor is used as the origin of the scene
const Anchor = (props) => {
  const ref = useResource()

  return (
    <Box {...props} ref={ref} args={[0.1, 0.1, 0.1]} rotation={[0, Math.PI / 4, Math.PI / 4]}>
      <meshBasicMaterial attach="material" color={'orange'}/>
    </Box>
  )
}

// The HitTestSphere is placed at the position of the hit from HitTestExample 
function HitTestSphere(props) {
  return (
    <Sphere {...props} attach="geometry" args={[0.1, 16, 16]} >
      <meshBasicMaterial attach="material" color={'hotpink'} />
    </Sphere>
  )
}

function HitTestExample() {
  const gltf = useGLTF('reticle.gltf')
  const ref = useResource()
  const [items, set] = useState([])

  useHitTest((hit) => {
    hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  })

  const handleClick = useCallback(e => {
    set(items => [...items, uuid.generate()]), []
  })

  return (
    <>
      <Interactive onSelect={handleClick}>
        <primitive ref={ref} object={gltf.scene} scale={1}/>
        {/* <Sphere ref={ref} attach="geometry" args={[0.2, 32, 32]} >
          <meshBasicMaterial attach="material" color={'white'} opacity={0.5} />
        </Sphere> */}
      </Interactive>
      {items.map((key, index) => (
        <HitTestSphere key={key} position={ref.current.position} />
      ))}
    </>
  )
}

export function App() {
  return (
    <ARCanvas sessionInit={{ requiredFeatures: ['hit-test'] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Anchor position={[0, 0, -0.8]} />
      <Suspense fallback={null}>
        <HitTestExample />
      </Suspense>
    </ARCanvas>
  )
}
