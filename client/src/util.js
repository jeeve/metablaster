import * as init from "./init";

export function getIndex(i, j) {
  return j * init.ni + i;
}

export function getI(n) {
  return n % init.ni;
}

export function getJ(n) {
  return Math.floor(n / init.ni);
}

export function blockAt(decor, i, j) {
  const n = getIndex(i, j);
  return !(decor[n].image === "");
}

export function emptyRandomPosition(decor) {
  const maxNumberTest = 1000;
  let numberTest = 0;
  while (numberTest < maxNumberTest) {
    const i = Math.floor(Math.random() * init.ni);
    const j = Math.floor(Math.random() * init.nj);
    if (!blockAt(decor, i, j)) {
      return { x: i*32, y: j*32 };
    }
    numberTest++;
  }
  return { x: -1, y: -1 };
}

export function spriteLeft(n) {
  return n - 1;
}

export function spriteRight(n) {
  return n + 1;
}

export function spriteUp(n) {
  return n - init.ni;
}

export function spriteDown(n) {
  return n + init.ni;
}

function getObjectsNearXY(decor, players, player, x, y) {
  const objects = decor.filter((sprite) => {
    return (
      sprite.image !== "" && !sprite.image.includes("bomb") /*&& sprite.x !== x && sprite.y !== y 
      Math.sqrt(
        Math.pow(sprite.x - x, 2) + Math.pow(sprite.y - y, 2) <=
          91
      )*/
    );
  });
  players.map((p) => {
    if (p !== player) {
    objects.push(p);
    }
  });
  return objects;
}

function pointInObject(object, x, y) {
  return x >= object.x && x <= object.x + 31 && y >= object.y && y <= object.y + 31;
}

export function isOkForXY(decor, players, player, x, y) {
  return (
    getObjectsNearXY(decor, players, player, x, y).filter((object) => {
      return (
        pointInObject(object, x + 1, y) ||
        pointInObject(object, x + 30, y) ||
        pointInObject(object, x + 30, y + 30) ||
        pointInObject(object, x + 1, y + 30)
      );
    }).length === 0)
}