import { Canvas, useFrame } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 30 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
