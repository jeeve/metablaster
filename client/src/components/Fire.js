import { useEffect, useState } from "react";
import Sprite from "./Sprite";
import * as init from "../init";
import * as util from "../util";

export default function Fire({ decor, n, onBurn, onEnd }) {
  const [end, setEnd] = useState(false);
  const [burned, setBurned] = useState([]);
  const [energy, setEnergy] = useState(init.energyMax);
  const [spritesL, setSpritesL] = useState([]);
  const [spritesR, setSpritesR] = useState([]);
  const [spritesU, setSpritesU] = useState([]);
  const [spritesD, setSpritesD] = useState([]);
  const [nbBurnedL, setNbBurnedL] = useState(0);
  const [nbBurnedR, setNbBurnedR] = useState(0);
  const [nbBurnedU, setNbBurnedU] = useState(0);
  const [nbBurnedD, setNbBurnedD] = useState(0);

  const getNbBurnedL = () => nbBurnedL;
  const getNbBurnedR = () => nbBurnedR;
  const getNbBurnedU = () => nbBurnedU;
  const getNbBurnedD = () => nbBurnedD;

  const startTimer = () => {
    return setInterval(() => {
      setEnergy((prevEnergy) => prevEnergy - 1);
    }, 80);
  };

  useEffect(() => {
    const newBurned = [...burned];
    spread(
      setSpritesL,
      setNbBurnedL,
      getNbBurnedL,
      -1,
      0,
      "fire-h.png",
      "fire-h-l.png",
      "fire-h-r.png",
      "fire-h-e.png",
      newBurned
    );
    spread(
      setSpritesR,
      setNbBurnedR,
      getNbBurnedR,
      +1,
      0,
      "fire-h.png",
      "fire-h-r.png",
      "fire-h-l.png",
      "fire-h-e.png",
      newBurned
    );
    spread(
      setSpritesU,
      setNbBurnedU,
      getNbBurnedU,
      0,
      -1,
      "fire-v.png",
      "fire-v-u.png",
      "fire-v-d.png",
      "fire-v-e.png",
      newBurned
    );
    spread(
      setSpritesD,
      setNbBurnedD,
      getNbBurnedD,
      0,
      +1,
      "fire-v.png",
      "fire-v-d.png",
      "fire-v-u.png",
      "fire-v-e.png", 
      newBurned
    );
    setBurned(newBurned);
    setEnd(true);
  }, [energy]);

  const spread = (
    setSprites,
    setNbBurned,
    nbBurned,
    di,
    dj,
    image1,
    image2,
    image3,
    image4,
    burned
  ) => {
    if (energy > init.energyMax / 2) {
      setSprites((prevSprites) => {
        const newSprites = [...prevSprites];
        let k;
        if (newSprites.length === 0) {
          k = n;
        } else {
          k = util.getIndex(
            Math.floor(newSprites[newSprites.length - 1].x / 32),
            Math.floor(newSprites[newSprites.length - 1].y / 32)
          );
        }
        const i = util.getI(k) + di;
        const j = util.getJ(k) + dj;
        const newK = util.getIndex(i, j);
        if (decor[newK].image === "" && nbBurned() < 1) {
          newSprites.push({
            x: i * 32,
            y: j * 32,
            image: image2,
          });
        }
        if (newSprites.length > 1) {
          newSprites[newSprites.length - 2].image = image1;
        }
        if (decor[newK].image === "brick.png") {
          setNbBurned((prevNbBurned) => prevNbBurned + 1);
        }
        if (nbBurned() === 0) {
          //burned.push(newK);
          onBurn(newK);
        }
        return newSprites;
      });
    } else {
      setSprites((prevSprites) => {
        const newSprites = [...prevSprites];
        newSprites.shift();
        return newSprites;
      });
    }
    setSprites((prevSprites) => {
      if (prevSprites.length > 0  && energy < init.energyMax) {
        const newSprites = [...prevSprites];
        newSprites[0].image = image3;
        return newSprites;
      }
      return prevSprites;
    });
    setSprites((prevSprites) => {
      if (prevSprites.length === 1) {
        const newSprites = [...prevSprites];
        newSprites[0].image = image4;
        return newSprites;
      }
      return prevSprites;
    });
  };

  useEffect(() => {
    burned.map((i) => {
    //  onBurn(i);
    })
  }, [burned]);
 
  useEffect(() => {
    const interval = startTimer();

    return () => {
      clearInterval(interval);
    };
  }, [n]);

  useEffect(() => {
    if (end && spritesD.length ===0 && spritesL.length === 0 && spritesR.length === 0 && spritesU.length === 0) {
      onEnd(n);
    }
  }, [end, spritesD, spritesL, spritesR, spritesU]);

  return (
    <div>
      {energy > init.energyMax / 2 + 1 ? (
        <Sprite
          x={util.getI(n) * 32}
          y={util.getJ(n) * 32}
          image="fire-c.png"
        />
      ) : (
        <></>
      )}
      <>
        {spritesL.map((sprite, n) => (
          <Sprite key={n} x={sprite.x} y={sprite.y} image={sprite.image} />
        ))}
        {spritesR.map((sprite, n) => (
          <Sprite key={n} x={sprite.x} y={sprite.y} image={sprite.image} />
        ))}
        {spritesU.map((sprite, n) => (
          <Sprite key={n} x={sprite.x} y={sprite.y} image={sprite.image} />
        ))}
        {spritesD.map((sprite, n) => (
          <Sprite key={n} x={sprite.x} y={sprite.y} image={sprite.image} />
        ))}
      </>
    </div>
  );
}
