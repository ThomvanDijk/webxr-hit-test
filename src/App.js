import React, { useState, useCallback } from 'react'
import { ARCanvas, useHitTest, Interactive } from '@react-three/xr'
import { useResource } from 'react-three-fiber'
import { Box } from '@react-three/drei'
import uuid from "short-uuid"
import './styles.css'

function Button() {
  const ref = useResource()
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState('blue')

  const [items, set] = useState([])
  const handleClick = useCallback(e => {
    set(items => [...items, uuid.generate()]), []
    console.log("onClick!")
  })

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0)
  }

  return (
    <Interactive onHover={() => setHover(true)} onBlur={() => setHover(false)} onSelect={handleClick}>
      <Box ref={ref} args={[0.1, 0.1, 0.1]} position={[0, 0, -0.8]}>
        <meshBasicMaterial attach="material" color={color}/>
      </Box>
      {items.map((key, index) => (
        <Spawned key={key} position={[0, index * 0.1, -0.8]} />
      ))}
    </Interactive>
  )
}

function Spawned(props) {
  return (
    <mesh {...props}>
      <sphereGeometry attach="geometry" args={[0.1, 16, 16]} />
      <meshStandardMaterial attach="material" color="hotpink" transparent />
    </mesh>
  )
}

function HitTestExample() {
  const ref = useResource()
  const [color, setColor] = useState('blue')
  const [items, set] = useState([])

  useHitTest((hit) => {
    hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  })

  // const onSelect = () => {
  //   setColor((Math.random() * 0xffffff) | 0)
  // }

  const handleClick = useCallback(e => {
    set(items => [...items, uuid.generate()]), []
    console.log("onClick!")
  })

  return (
    <>
      <Interactive onSelect={handleClick}>
        <Box ref={ref} args={[0.1, 0.1, 0.1]}>
          <meshBasicMaterial attach="material" color={color} />
        </Box>
      </Interactive>
      {items.map((key, index) => (
        <Spawned key={key} position={ref.current.position} />
      ))}
    </>
  )
}

export function App() {
  return (
    <ARCanvas sessionInit={{ requiredFeatures: ['hit-test'] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Button position={[0, 0, -0.8]} />
      <HitTestExample />
      {/* <DefaultXRControllers />  Apparently this gives bugs... */}
    </ARCanvas>
  )
}
