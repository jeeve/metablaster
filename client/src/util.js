export function getIndex(i, j, ni) {
  return j * ni + i;
}

export function getI(n, ni) {
  return n % ni;
}

export function getJ(n, ni) {
  return Math.floor(n / ni);
}

export function blockAt(decor, i, j, ni) {
  const n = getIndex(i, j, ni);
  return !(decor[n].image === "");
}

export function playerAt(n, players, ni) {
  let ok = false;
  players.map((player) => {
    if (
      Math.abs(player.x - getI(n, ni) * 32) < 16 &&
      Math.abs(player.y - getJ(n, ni) * 32) < 16
    ) {
      ok = true;
    }
  });
  return ok;
}

export function emptyRandomPosition(decor, ni, nj) {
  const maxNumberTest = 1000;
  let numberTest = 0;
  while (numberTest < maxNumberTest) {
    const i = Math.floor(Math.random() * ni);
    const j = Math.floor(Math.random() * nj);
    if (!blockAt(decor, i, j, ni)) {
      return { x: i * 32, y: j * 32 };
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

export function spriteUp(n, ni) {
  return n - ni;
}

export function spriteDown(n, ni) {
  return n + ni;
}

function getObjectsNearXY(decor, players, player, x, y) {
  const objects = decor.filter((sprite) => {
    return (
      sprite.image !== "" &&
      !sprite.image.includes("bomb") /*&& sprite.x !== x && sprite.y !== y 
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
  return (
    x >= object.x && x <= object.x + 31 && y >= object.y && y <= object.y + 31
  );
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
    }).length === 0
  );
}
