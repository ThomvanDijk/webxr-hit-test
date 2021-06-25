import React, { useState, useCallback, Suspense } from 'react'
import { ARCanvas, useHitTest, Interactive, useInteraction } from '@react-three/xr'
import { useResource } from 'react-three-fiber'
import { Sphere, useGLTF } from '@react-three/drei'
import uuid from 'short-uuid'
import './styles.css'

// The HitTestSphere is placed at the position of the hit from HitTest
function HitTestSphere(props) {
  const color = '#' + Math.floor(Math.random()*16777215).toString(16)

  return (
    <Sphere {...props} attach="geometry" args={[0.1, 16, 16]} >
      <meshBasicMaterial attach="material" color={'white'} />
    </Sphere>
  )
}

function HitTest() {
  const gltf = useGLTF('reticle/reticle.gltf')
  const ref = useResource()
  const [items, set] = useState([])

  // Hit is the position on a surface where the camera looks at 
  useHitTest((hit) => {
    hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  })

  useInteraction(ref, 'onSelect', () => {
    set(items => [...items, uuid.generate()]), []
  })

  return (
    <>
      <primitive ref={ref} object={gltf.scene} scale={1}/>
      {items.map((key) => (
        <HitTestSphere key={key} position={ref.current.position} />
      ))}
    </>
  )
}

export function App() {
  return (
    <ARCanvas sessionInit={{ requiredFeatures: ['hit-test'] }}>
      <Suspense fallback={null}>
        <HitTest />
      </Suspense>
    </ARCanvas>
  )
}
