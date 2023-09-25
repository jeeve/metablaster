import * as init from "./init";
import * as util from "./util";

export function tryToGoLeft(decor, players, player) {
  function isInZonePlayer(sprite) {
    return (
      sprite.y <= player.y + 64 &&
      sprite.y >= player.y - 64 &&
      sprite.x + 32 >= player.x - init.dx &&
      sprite.x + 32 <= player.x
    );
  }

  function getObjectsArroundPlayer() {
    const objects = decor.filter((sprite) => {
      return sprite.image !== "" && isInZonePlayer(sprite);
    });
    players.map((p) => {
      if (p !== player) {
        if (isInZonePlayer(p)) {
          objects.push(p);
        }
      }
    });

    objects.sort((a, b) => {
      return a.y - b.y;
    });
    return objects;
  }

  function getCoupleWithSpace(objects, y) {
    if (objects.length < 2) return null;
    for (let i = 0; i < objects.length - 1; i++) {
      if (Math.abs(objects[i].y - objects[i + 1].y) >= 64) {
        if (
          y >= objects[i].y + 32 - init.tolx &&
          y + 32 <= objects[i + 1].y + init.tolx
        ) {
          return [objects[i], objects[i + 1]];
        }
      }
    }
    return null;
  }

  function getSpaceAtLeft(objects, y) {
    const list = objects.filter((object) => {
      return object.y >= y + 32 - init.tolx && object.y <= y + 32;
    });
    if (list.length > 0) {
      const obj = list[0];
      if (
        objects.filter((object) => {
          return object.y + 32 <= obj.y && object.y + 32 >= obj.y - 32;
        }).length === 0
      ) {
        return obj;
      }
    }
    return null;
  }

  function getSpaceAtRight(objects, y) {
    const list = objects.filter((object) => {
      return object.y + 32 >= y && object.y + 32 <= y + init.tolx;
    });
    if (list.length > 0) {
      const obj = list[0];
      if (
        objects.filter((object) => {
          return object.y >= obj.y + 32 && object.y <= obj.y + 32;
        }).length === 0
      ) {
        return obj;
      }
    }
    return null;
  }

  function getObjectAtTop(objects, y) {
    const list = objects.filter((object) => {
      return (
        (object.y + 32 >= y && object.y + 32 <= y + 32) ||
        (object.y <= y + 32 && object.y >= y)
      );
    });
    list.sort((a, b) => {
      return b.x - a.x;
    });
    if (list.length > 0) {
      return list[0];
    }
    return null;
  }

  return new Promise((resolve, reject) => {
    let x = player.x;
    let y = player.y;
    const objects = getObjectsArroundPlayer();
    let ok =
      objects.filter((o) => {
        return o.y + 32 > player.y && o.y < player.y + 32;
      }).length === 0;
    if (!ok) {
      const couple = getCoupleWithSpace(objects, player.y);
      if (couple !== null) {
        if (
          couple[0].y + 32 <= player.y + init.tolx &&
          couple[0].y + 32 >= player.y
        ) {
          ok = true;
          y = couple[0].y + 32;
        } else {
          if (
            couple[1].y >= player.y + 32 - init.tolx &&
            couple[1].y <= player.y + 32
          ) {
            ok = true;
            y = couple[1].y - 32;
          }
        }
      } else {
        let object = getSpaceAtLeft(objects, player.y);
        if (object !== null) {
          ok = true;
          y = object.y - 32;
        } else {
          object = getSpaceAtRight(objects, player.y);
          if (object !== null) {
            ok = true;
            y = object.y + 32;
          } else {
            object = getObjectAtTop(objects, player.y);
            if (object !== null) {
              ok = true;
              x = object.x + 32;
            }
          }
        }
      }
    } else {
      x = player.x - init.dx;
    }
    if (util.isOkForXY(decor, players, player, x, y)) {
      resolve({ x, y });
    }
  });
}

export function tryToGoRight(decor, players, player) {
  function isInZonePlayer(sprite) {
    return (
      sprite.y <= player.y + 64 &&
      sprite.y >= player.y - 64 &&
      sprite.x >= player.x + 32 &&
      sprite.x <= player.x + 32 + init.dx
    );
  }

  function getObjectsArroundPlayer() {
    const objects = decor.filter((sprite) => {
      return sprite.image !== "" && isInZonePlayer(sprite);
    });
    players.map((p) => {
      if (p !== player) {
        if (isInZonePlayer(p)) {
          objects.push(p);
        }
      }
    });

    objects.sort((a, b) => {
      return a.y - b.y;
    });
    return objects;
  }

  function getCoupleWithSpace(objects, y) {
    if (objects.length < 2) return null;
    for (let i = 0; i < objects.length - 1; i++) {
      if (Math.abs(objects[i].y - objects[i + 1].y) >= 64) {
        if (
          y >= objects[i].y + 32 - init.tolx &&
          y + 32 <= objects[i + 1].y + init.tolx
        ) {
          return [objects[i], objects[i + 1]];
        }
      }
    }
    return null;
  }

  function getSpaceAtLeft(objects, y) {
    const list = objects.filter((object) => {
      return object.y >= y + 32 - init.tolx && object.y <= y + 32;
    });
    if (list.length > 0) {
      const obj = list[0];
      if (
        objects.filter((object) => {
          return object.y + 32 <= obj.y && object.y + 32 >= obj.y - 32;
        }).length === 0
      ) {
        return obj;
      }
    }
    return null;
  }

  function getSpaceAtRight(objects, y) {
    const list = objects.filter((object) => {
      return object.y + 32 >= y && object.y + 32 <= y + init.tolx;
    });
    if (list.length > 0) {
      const obj = list[0];
      if (
        objects.filter((object) => {
          return object.y >= obj.y + 32 && object.y <= obj.y + 32;
        }).length === 0
      ) {
        return obj;
      }
    }
    return null;
  }

  function getObjectAtRight(objects, y) {
    const list = objects.filter((object) => {
      return (
        (object.y + 32 >= y && object.y + 32 <= y + 32) ||
        (object.y <= y + 32 && object.y >= y)
      );
    });
    list.sort((a, b) => {
      return a.x - b.x;
    });
    if (list.length > 0) {
      return list[0];
    }
    return null;
  }

  return new Promise((resolve, reject) => {
    let x = player.x;
    let y = player.y;
    const objects = getObjectsArroundPlayer();
    let ok =
      objects.filter((o) => {
        return o.y + 32 > player.y && o.y < player.y + 32;
      }).length === 0;
    if (!ok) {
      const couple = getCoupleWithSpace(objects, player.y);
      if (couple !== null) {
        if (
          couple[0].y + 32 <= player.y + init.tolx &&
          couple[0].y + 32 >= player.y
        ) {
          ok = true;
          y = couple[0].y + 32;
        } else {
          if (
            couple[1].y >= player.y + 32 - init.tolx &&
            couple[1].y <= player.y + 32
          ) {
            ok = true;
            y = couple[1].y - 32;
          }
        }
      } else {
        let object = getSpaceAtLeft(objects, player.y);
        if (object !== null) {
          ok = true;
          y = object.y - 32;
        } else {
          object = getSpaceAtRight(objects, player.y);
          if (object !== null) {
            ok = true;
            y = object.y + 32;
          } else {
            object = getObjectAtRight(objects, player.y);
            if (object !== null) {
              ok = true;
              x = object.x - 32;
            }
          }
        }
      }
    } else {
      x = player.x + init.dx;
    }
    if (util.isOkForXY(decor, players, player, x, y)) {
      resolve({ x, y });
    }
  });
}

export function tryToGoUp(decor, players, player) {
  function isInZonePlayer(sprite) {
    return (
      sprite.x <= player.x + 64 &&
      sprite.x >= player.x - 64 &&
      sprite.y + 32 >= player.y - init.dx &&
      sprite.y + 32 <= player.y
    );
  }

  function getObjectsArroundPlayer() {
    const objects = decor.filter((sprite) => {
      return sprite.image !== "" && isInZonePlayer(sprite);
    });
    players.map((p) => {
      if (p !== player) {
        if (isInZonePlayer(p)) {
          objects.push(p);
        }
      }
    });

    objects.sort((a, b) => {
      return a.x - b.x;
    });
    return objects;
  }

  function getCoupleWithSpace(objects, x) {
    if (objects.length < 2) return null;
    for (let i = 0; i < objects.length - 1; i++) {
      if (Math.abs(objects[i].x - objects[i + 1].x) >= 64) {
        if (
          x >= objects[i].x + 32 - init.tolx &&
          x + 32 <= objects[i + 1].x + init.tolx
        ) {
          return [objects[i], objects[i + 1]];
        }
      }
    }
    return null;
  }

  function getSpaceAtLeft(objects, x) {
    const list = objects.filter((object) => {
      return object.x >= x + 32 - init.tolx && object.x <= x + 32;
    });
    if (list.length > 0) {
      const obj = list[0];
      if (
        objects.filter((object) => {
          return object.x + 32 <= obj.x && object.x + 32 >= obj.x - 32;
        }).length === 0
      ) {
        return obj;
      }
    }
    return null;
  }

  function getSpaceAtRight(objects, x) {
    const list = objects.filter((object) => {
      return object.x + 32 >= x && object.x + 32 <= x + init.tolx;
    });
    if (list.length > 0) {
      const obj = list[0];
      if (
        objects.filter((object) => {
          return object.x >= obj.x + 32 && object.x <= obj.x + 32;
        }).length === 0
      ) {
        return obj;
      }
    }
    return null;
  }

  function getObjectAtTop(objects, x) {
    const list = objects.filter((object) => {
      return (
        (object.x + 32 >= x && object.x + 32 <= x + 32) ||
        (object.x <= x + 32 && object.x >= x)
      );
    });
    list.sort((a, b) => {
      return b.y - a.y;
    });
    if (list.length > 0) {
      return list[0];
    }
    return null;
  }

  return new Promise((resolve, reject) => {
    let x = player.x;
    let y = player.y;
    const objects = getObjectsArroundPlayer();
    let ok =
      objects.filter((o) => {
        return o.x + 32 > player.x && o.x < player.x + 32;
      }).length === 0;
    if (!ok) {
      const couple = getCoupleWithSpace(objects, player.x);
      if (couple !== null) {
        if (
          couple[0].x + 32 <= player.x + init.tolx &&
          couple[0].x + 32 >= player.x
        ) {
          ok = true;
          x = couple[0].x + 32;
        } else {
          if (
            couple[1].x >= player.x + 32 - init.tolx &&
            couple[1].x <= player.x + 32
          ) {
            ok = true;
            x = couple[1].x - 32;
          }
        }
      } else {
        let object = getSpaceAtLeft(objects, player.x);
        if (object !== null) {
          ok = true;
          x = object.x - 32;
        } else {
          object = getSpaceAtRight(objects, player.x);
          if (object !== null) {
            ok = true;
            x = object.x + 32;
          } else {
            object = getObjectAtTop(objects, player.x);
            if (object !== null) {
              ok = true;
              y = object.y + 32;
            }
          }
        }
      }
    } else {
      y = player.y - init.dx;
    }
    if (util.isOkForXY(decor, players, player, x, y)) {
      resolve({ x, y });
    }
  });
}

export function tryToGoDown(decor, players, player) {
  function isInZonePlayer(sprite) {
    return (
      sprite.x <= player.x + 64 &&
      sprite.x >= player.x - 64 &&
      sprite.y >= player.y + 32 &&
      sprite.y <= player.y + 32 + init.dx
    );
  }

  function getObjectsArroundPlayer() {
    const objects = decor.filter((sprite) => {
      return sprite.image !== "" && isInZonePlayer(sprite);
    });
    players.map((p) => {
      if (p !== player) {
        if (isInZonePlayer(p)) {
          objects.push(p);
        }
      }
    });

    objects.sort((a, b) => {
      return a.x - b.x;
    });
    return objects;
  }

  function getCoupleWithSpace(objects, x) {
    if (objects.length < 2) return null;
    for (let i = 0; i < objects.length - 1; i++) {
      if (Math.abs(objects[i].x - objects[i + 1].x) >= 64) {
        if (
          x >= objects[i].x + 32 - init.tolx &&
          x + 32 <= objects[i + 1].x + init.tolx
        ) {
          return [objects[i], objects[i + 1]];
        }
      }
    }
    return null;
  }

  function getSpaceAtLeft(objects, x) {
    const list = objects.filter((object) => {
      return object.x >= x + 32 - init.tolx && object.x <= x + 32;
    });
    if (list.length > 0) {
      const obj = list[0];
      if (
        objects.filter((object) => {
          return object.x + 32 <= obj.x && object.x + 32 >= obj.x - 32;
        }).length === 0
      ) {
        return obj;
      }
    }
    return null;
  }

  function getSpaceAtRight(objects, x) {
    const list = objects.filter((object) => {
      return object.x + 32 >= x && object.x + 32 <= x + init.tolx;
    });
    if (list.length > 0) {
      const obj = list[0];
      if (
        objects.filter((object) => {
          return object.x >= obj.x + 32 && object.x <= obj.x + 32;
        }).length === 0
      ) {
        return obj;
      }
    }
    return null;
  }

  function getObjectAtBottom(objects, x) {
    const list = objects.filter((object) => {
      return (
        (object.x + 32 >= x && object.x + 32 <= x + 32) ||
        (object.x <= x + 32 && object.x >= x)
      );
    });
    list.sort((a, b) => {
      return a.y - b.y;
    });
    if (list.length > 0) {
      return list[0];
    }
    return null;
  }

  return new Promise((resolve, reject) => {
    let x = player.x;
    let y = player.y;
    const objects = getObjectsArroundPlayer();
    let ok =
      objects.filter((o) => {
        return o.x + 32 > player.x && o.x < player.x + 32;
      }).length === 0;
    if (!ok) {
      const couple = getCoupleWithSpace(objects, player.x);
      if (couple !== null) {
        if (
          couple[0].x + 32 <= player.x + init.tolx &&
          couple[0].x + 32 >= player.x
        ) {
          ok = true;
          x = couple[0].x + 32;
        } else {
          if (
            couple[1].x >= player.x + 32 - init.tolx &&
            couple[1].x <= player.x + 32
          ) {
            ok = true;
            x = couple[1].x - 32;
          }
        }
      } else {
        let object = getSpaceAtLeft(objects, player.x);
        if (object !== null) {
          ok = true;
          x = object.x - 32;
        } else {
          object = getSpaceAtRight(objects, player.x);
          if (object !== null) {
            ok = true;
            x = object.x + 32;
          } else {
            object = getObjectAtBottom(objects, player.x);
            if (object !== null) {
              ok = true;
              y = object.y - 32;
            }
          }
        }
      }
    } else {
      y = player.y + init.dx;
    }
    if (util.isOkForXY(decor, players, player, x, y)) {
      resolve({ x, y });
    }
  });
}
