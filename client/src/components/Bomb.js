import { useState, useEffect } from "react";
import * as init from "../init";

export default function Bomb({ x, y, n, onExplode, explode, soundOn }) {
  const [image, setImage] = useState("bomb1.png");
  const [count, setCount] = useState(5);

  const deltax = Math.floor(window.innerWidth / 2 - (init.ni * 32) / 2);
  const style = {
    left: deltax + x,
    top: y,
  };

  const startTimer = () => {
    return setInterval(() => {
      setCount((prevCount) => prevCount - 1);
      setImage((prevImage) =>
        prevImage === "bomb1.png" ? "bomb2.png" : "bomb1.png"
      );
    }, 200);
  };

  useEffect(() => {
    if (explode) {
      onExplode(n);
    }
  }, [explode, onExplode]);

  useEffect(() => {
    const interval = startTimer();

    return () => {
      clearInterval(interval);
    };
  }, [n]);

  useEffect(() => {
    if (count === 0) {
      if (soundOn) {
        const audio = new Audio("./sounds/explode.wav");
        audio.play();
      }
      onExplode(n);
    }
  }, [count, n, soundOn]);

  return <img style={style} src={"/images/" + image} alt="" />;
}
