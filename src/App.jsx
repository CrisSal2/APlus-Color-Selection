import { useState } from 'react'
import './App.css'
import ColorSwatchGrid from "./components/ColorSwatchGrid";
import { COLORS } from "./data/colors";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <ColorSwatchGrid colors={COLORS} />
      </main>
    </>
  )
}

export default App
