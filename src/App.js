import React, { useState, useRef, Suspense } from 'react'
import { ARCanvas, useHitTest, useInteraction } from '@react-three/xr'
import { Sphere, useGLTF } from '@react-three/drei'

function HitTest() {
  const reticle = useGLTF('reticle/reticle.gltf')
  const ref = useRef()
  const [items, set] = useState([])
  let item_id = 0

  // Hit is the position on a surface where the camera looks at 
  useHitTest((hit) => {
    hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  })

  // This function adds a new item, which is just an id, to the items list when the reticle is selected
  useInteraction(ref, 'onSelect', () => {
    set([...items, item_id++])
  })

  return (
    <>
      <primitive ref={ref} object={reticle.scene} scale={1}/>
      {items.map(() => (
        <Sphere position={ref.current.position} args={[0.1, 16, 16]} />
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
