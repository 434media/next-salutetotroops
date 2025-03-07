import { BackgroundVideo } from "./components/BackgroundVideo"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen">
        <BackgroundVideo />
      </div>
      <Footer />
    </>
  )
}

