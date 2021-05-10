import React, { useState, useCallback } from 'react'
import { ARCanvas, useHitTest, Interactive } from '@react-three/xr'
import { useResource } from 'react-three-fiber'
import { Box, Ring, Sphere } from '@react-three/drei'
import uuid from "short-uuid"
import './styles.css'

// The Anchor is used as the origin of the scene
function Anchor(props) {
  const ref = useResource()
  return (
    <Box {...props} ref={ref} args={[0.1, 0.1, 0.1]} >
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
        <Sphere ref={ref} attach="geometry" args={[0.2, 32, 32]} >
          <meshBasicMaterial attach="material" color={'white'} opacity={0.5} />
        </Sphere>
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
      <HitTestExample />
    </ARCanvas>
  )
}
