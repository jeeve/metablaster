import * as init from "./init";
import * as util from "./util";

export function moveRobot(
  decor,
  robotInertia,
  setRobotInertia,
  players,
  robot,
  dropBomb,
  fires
) {
  function danger(n) {
    return decor[n].image.includes("bomb") || fires.includes(n);
  }

  function flee(n) {
    let d = "";

    if (danger(n)) {
      if (!something(util.spriteUp(n))) {
        d = "up";
      } else if (!something(util.spriteDown(n))) {
        d = "down";
      } else if (!something(util.spriteLeft(n))) {
        d = "left";
      } else {
        d = "right";
      }
    }
    if (danger(util.spriteLeft(n)) || danger(util.spriteRight(n))) {
        if (!something(util.spriteUp(n))) {
          d = "up";
        } else {
          d = "down";
        }
    }
    if (danger(util.spriteUp(n)) || danger(util.spriteDown(n))) {
        if (!something(util.spriteRight(n))) {
          d = "right";
        } else {
          d = "left";
        } 
    }
    return d;
  }

  function something(n) {
    const i = util.getI(n);
    const j = util.getJ(n);
    if (decor[n].image !== "") {
      return true;
    }
    if (
      players.filter(
        (p) => Math.abs(p.x - i * 32) < 16 && Math.abs(p.y - j * 32) < 16
      ).length > 0
    ) {
      return true;
    }
    if (fires.includes(n)) {
      return true;
    }
    return false;
  }

  function goTo() {
    const go = { x: 0, y: 0 };
    if (players[0].x > robot().x) {
      go.x = 1;
    } else if (players[0].x < robot().x) {
      go.x = -1;
    }
    if (players[0].y > robot().y) {
      go.y = 1;
    } else if (players[0].y < robot().y) {
      go.y = -1;
    }
    return go;
  }

  function nDirection(d, n) {
    let n2;
    switch (d) {
      case "up":
        n2 = util.spriteUp(n);
        break;
      case "down":
        n2 = util.spriteDown(n);
        break;
      case "left":
        n2 = util.spriteLeft(n);
        break;
      case "right":
        n2 = util.spriteRight(n);
        break;
      default:
        break;
    }
    return n;
  }

  let inertia = robotInertia;
  const iRobot = Math.round(robot().x / 32);
  const jRobot = Math.round(robot().y / 32);
  const nRobot = util.getIndex(iRobot, jRobot);
  let d1 = "";
  let d2 = "";

  if (danger(nRobot)) {
    robot().displacement = flee(nRobot);
    d1 = "danger";
  } else {
    d1 = flee(nRobot);
    d2 = flee(nDirection(d1, nRobot));

    if (d2 !== "") {
      robot().displacement = d2;
    } else {
      if (d1 !== "") {
        robot().displacement = d1;
      }
    }
  }

  if (d1 === "" && d2 === "" && inertia === 0) {
    const r = Math.round(Math.random() * 100);
    const go = goTo();
    if (r > 0 && (r <= (go.y <  0 ? 15 : 10))) {
      robot().displacement = "up";
    } else if (r > 20 && (r <= (go.y > 0 ? 35 : 30))) {
      robot().displacement = "down";
    } else if (r > 40 && (r <= (go.x < 0 ? 55 : 50))) {
      robot().displacement = "left";
    } else if (r > 60 && (r <= (go.x > 0 ? 75 : 70))) {
      robot().displacement = "right";
    } else if (r > 80 && r <= 85) {
      dropBomb(robot());
    }
  }

  if (inertia === 0) {
    inertia = Math.round(Math.random() * init.robotAgitation);
  } else {
    inertia--;
  }

  setRobotInertia(inertia);
}
