import { useState } from 'react'
import '../../App.css'
import { Slider } from '@mui/material'

function CoupledSliders() {
  const [slider1Val, setSlider1Val] = useState(0);
  const [slider2Val, setSlider2Val] = useState(0);

  return (
    <>
      This one thinks its free.
      <Slider aria-label="Slider 1" value={slider1Val} onChange={(e) => {
        const target = e.target as HTMLInputElement;
        setSlider1Val(Number(target.value))
      }} />
      One slider to rule them all.
      <Slider aria-label="Slider 2" value={slider2Val} onChange={(e) => {
        const target = e.target as HTMLInputElement;
        setSlider1Val(Number(target.value))
        setSlider2Val(Number(target.value))
      }}/>
    </>
  )
}

export default CoupledSliders
