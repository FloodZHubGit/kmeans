import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ARButton, XR } from "@react-three/xr";

function App() {
  return (
    <>
      <ARButton />
      <Canvas shadows camera={{ position: [0, 0, 7], fov: 30 }}>
        <XR>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
