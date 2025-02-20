import { useState } from 'react'
import '../../App.css'
import { Divider, Button, Chip } from '@mui/material'
import CoupledSliders from '../../components/CoupledSliders/CoupledSliders';

function StartPage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CoupledSliders />

      <Divider textAlign='left'>
        <Chip label='a'/>
      <div>here is some text</div>
      <div>more text</div>
      </Divider>

      <Divider textAlign='center'>
        <Chip label='b'/>
        <div>here is some text</div>
        <div>more text</div>
      </Divider>

      <Divider textAlign='right'>
        <Chip label='c'/>
        <div>here is some text</div>
        <div>more text</div>
      </Divider>

      <Button
        variant='contained'
        onClick={() => {
          setCount((count) => count + 1)
          }
        }
      >
        count izz {count}
      </Button>
    </>
  )
}

export default StartPage
