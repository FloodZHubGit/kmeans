import React, { useEffect, useState, useRef } from "react";
import { Html, OrbitControls } from "@react-three/drei";
import skmeans from "skmeans";
import { Girl } from "./Girl";

import { Color } from "three";
import { useFrame } from "@react-three/fiber";

export const Experience = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [centroidsInput, setCentroidsInput] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (data.length > 0) {
      const initialCentroids = centroidsInput.split(",").map(Number);
      var res = skmeans(data, 3, initialCentroids);
      setResult(res);
      console.log(res);
    }
  }, [data, centroidsInput]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleDataSubmit = () => {
    const newData = input.split(",").map(Number);
    setData(newData);
  };

  const handleCentroidsInputChange = (event) => {
    setCentroidsInput(event.target.value);
  };

  const colorRef = useRef(new Color("#ececec"));
  const [color, setColor] = useState("#ececec");
  const targetColorRef = useRef(
    new Color(Math.random(), Math.random(), Math.random())
  );

  useFrame(() => {
    colorRef.current.lerp(targetColorRef.current, 0.01);
    setColor(`#${colorRef.current.getHexString()}`);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      targetColorRef.current.set(Math.random(), Math.random(), Math.random());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <color attach="background" args={[color]} />

      <OrbitControls />
      <Girl position={[0, -5, 45]} scale={0.15} rotation={[0, Math.PI, 0]} />
      <group scale={[0.1, 0.1, 0.1]} position={[0, 0.25, 0]}>
        <Html transform center occlude>
          <div
            style={{
              color: "black",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h1>Kmeans</h1>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Entrer les données séparées par des virgules"
              style={{ margin: "10px 0", padding: "5px", width: "300px" }}
            />
            <input
              type="text"
              value={centroidsInput}
              onChange={handleCentroidsInputChange}
              placeholder="Entrer les centroïdes séparés par des virgules"
              style={{ margin: "10px 0", padding: "5px", width: "300px" }}
            />
            <button
              onClick={handleDataSubmit}
              style={{
                padding: "5px 10px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Submit
            </button>
          </div>
        </Html>
      </group>
      <group position={[0, -0.25, 0]} scale={0.1}>
        <Html transform>
          <div
            style={{
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h1>Centroides</h1>
            <div style={{ color: "black" }}>
              {result && result.centroids.map((d, i) => <p key={i}>{d}</p>)}
            </div>
            <h1>Affectations</h1>
            <div style={{ color: "black" }}>
              {result && result.idxs.join(", ")}
            </div>
          </div>
        </Html>
      </group>
    </>
  );
};
