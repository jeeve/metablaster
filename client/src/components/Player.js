import { useState, useEffect } from "react";
import * as init from "../init";

export default function Player({
  x,
  y,
  n,
  image,
  name,
  displayName,
  dead,
  onReborn,
}) {
  const deadTime = 20;
  const [visibility, setVisibilty] = useState(true);
  const [count, setCount] = useState(deadTime);

  const deltax = Math.floor(window.innerWidth / 2 - (init.ni * 32) / 2);
  const style = {
    left: deltax + x,
    top: y,
    visibility: visibility? "visible" : "hidden",
  };
  let interval;

  const startTimer = () => {
    return setInterval(() => {
      if (dead) {
        setCount((prevCount) => prevCount - 1);
        setVisibilty((prevVisibilty) => !prevVisibilty);
      }
    }, 200);
  };

  useEffect(() => {
    if (dead) {
      interval = startTimer();

      return () => {
        clearInterval(interval);
        setVisibilty(true);
      };
    }
  }, [dead]);

  useEffect(() => {
    if (dead && count === 0) {
      clearInterval(interval);
      setCount(deadTime);
      onReborn(n);
    }
  }, [dead, count]);

  return (
    <div className="player" style={style}>
      <img src={"/images/" + image} alt="" />
      {displayName ? <span className="name">{name}</span> : <></>}
    </div>
  );
}
