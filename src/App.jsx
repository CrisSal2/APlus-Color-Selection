import './App.css'
import SiteHeader from './components/SiteHeader';
import ColorSwatchGrid from "./components/ColorSwatchGrid";
import SiteFooter from './components/SiteFooter';
import { COLORS } from "./data/colors";

function App() {

  return (
    <>
      <SiteHeader />
      <main>
        <ColorSwatchGrid colors={COLORS} />
      </main>
      <SiteFooter />
    </>
  )
}

export default App
