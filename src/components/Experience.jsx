import React, { useEffect, useState } from "react";
import { Html, OrbitControls } from "@react-three/drei";
import skmeans from "skmeans";

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

  return (
    <>
      <OrbitControls />
      <Html transform position={[0, 0, -8]}>
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
      <Html transform position={[0, -5, -5]}>
        <h1>Centroides</h1>
        <div style={{ color: "black" }}>
          {result && result.centroids.map((d, i) => <p key={i}>{d}</p>)}
        </div>
      </Html>
    </>
  );
};
