import * as Util from "./util"

export const dx = 5;
export const tolx = 16;
export const robotAgitation = 10;
export const nbBombsMax = 2;
export const speed = 25;
export const energyMax = 4;

export function makeDecor(ni, nj) {
    const sprites = [];
    for (let i = 0; i < nj; i++) {
      for (let j = 0; j < ni; j++) {
        if (i === 0 || i === nj - 1 || j === 0 || j === ni - 1) {
          sprites.push({
            x: Util.getI(sprites.length, ni) * 32,
            y: Util.getJ(sprites.length, ni) * 32,
            image: "rock.png",
            n: sprites.length,
            explode: false,
            owner: -1
          });
        } else {
          const k = Math.random();
          if (k > 0.2 && k <= 0.3) {
            sprites.push({
              x: Util.getI(sprites.length, ni) * 32,
              y: Util.getJ(sprites.length, ni) * 32,
              image: "rock.png",
              n: sprites.length,
              explode: false,
              owner: -1
            });
          } else if (k >= 0.3 && k < 0.55) {
            sprites.push({
              x: Util.getI(sprites.length, ni) * 32,
              y: Util.getJ(sprites.length, ni) * 32,
              image: "brick.png",
              n: sprites.length,
              explode: false,
              owner: -1
            });
          } else {
            sprites.push({
              x: Util.getI(sprites.length, ni) * 32,
              y: Util.getJ(sprites.length, ni) * 32,
              image: "",
              n: sprites.length,
              explode: false,
              owner: -1
            });
          }
        }
      }
    }
    return sprites;
  }

  export function makePlayer(n, x, y) {
    return {
      x: x,
      y: y,
      score: 0,
      dead: false,
      image: "player.png",
      n: n,
      name: n + 1,
      bombs: nbBombsMax,
    };
  }
