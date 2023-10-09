import { useState, useEffect } from "react";
import useSound from 'use-sound'
import mySound from '../assets/sounds/explode.wav' 

export default function Bomb({ x, y, n, onExplode, explode, soundOn, ni }) {
  const [image, setImage] = useState("bomb1.png");
  const [count, setCount] = useState(5);
  const [playSound] = useSound(mySound);

  const deltax = Math.floor(window.innerWidth / 2 - (ni * 32) / 2);
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
        playSound();
      }
      onExplode(n);
    }
  }, [count]);

  return <img style={style} src={"/images/" + image} alt="" />;
}
