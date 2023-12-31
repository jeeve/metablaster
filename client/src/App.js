import { useEffect, useState, useRef } from "react";
import Sprite from "./components/Sprite";
import Bomb from "./components/Bomb";
import Fire from "./components/Fire";
import Score from "./components/Score";
import Player from "./components/Player";
import Controls from "./components/Controls";
import Help from "./components/Help";
import * as init from "./init";
import * as util from "./util";
import * as engine from "./engine";
import * as robot from "./robot";
import * as api from "./api";

export default function Game() {
  const inputRef = useRef(null);
  const [nx, setNx] = useState(-1);
  const [ny, setNy] = useState(-1);
  const [playerId, setPlayerId] = useState(-1);
  const [soundOn, setSoundOn] = useState(false);
  const [displayName, setDisplayName] = useState(true);
  const [autoMode, setAutoMode] = useState(false);
  const [yourName, setYourName] = useState(1);
  const [decor, setDecor] = useState([]);
  const [decorOK, setDecorOK] = useState(false);
  const [players, setPlayers] = useState([]);
  const [fires, setFires] = useState([]);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [displacement, setDisplacement] = useState("");
  const [changePlayer, setChangePlayer] = useState(false);
  const [robotInertia, setRobotInertia] = useState(init.robotAgitation);

  useEffect(() => {
    api.getNbPlayers(playerId).then((nbPlayers) => {
      if (nbPlayers > 0) {
        api.downloadGame(playerId).then((game) => {
          api.register(nbPlayers).then(() => {
            setDisableUpdate(true);
            setNx(game.nx);
            setNy(game.ny);
            setDecor(game.decor);
            setPlayers(game.players);
            setDisableUpdate(false);
            setDecorOK(true);
            setPlayerId(nbPlayers);
            setChangePlayer(true);
          });
        });
      } else {
        const nx0 = Math.floor(window.innerWidth / 32);
        const ni0 = nx0 <= 20 ? nx0 : 20;
        const nj0 = 15;
        setNx(ni0);
        setNy(nj0);
        const decor0 = init.makeDecor(ni0, nj0);
        setDecor(decor0);
        api.uploadDecor(0, ni0, nj0, decor0);
        setDecorOK(true);
        setPlayerId(0);
        setChangePlayer(true);
        api.register(0);
      }
      setYourName(nbPlayers + 1);
    });
  }, []);

  useEffect(() => {
    if (decorOK && playerId === 0) {
      const newPlayers = [];
      const p = util.emptyRandomPosition(decor, nx, ny);
      const newPlayer = init.makePlayer(0, p.x, p.y);
      newPlayers.push(newPlayer);
      api.uploadPlayers(playerId, newPlayers).then(() => {
        setPlayers(newPlayers);
      });
    }
  }, [decorOK]);

  useEffect(() => {
    if (decorOK && playerId > 0) {
      const newPlayers = Object.assign([], players);
      const p = util.emptyRandomPosition(decor, nx, ny);
      console.log(p);
      const newPlayer = init.makePlayer(players.length, p.x, p.y);
      newPlayers.push(newPlayer);
      api.uploadPlayers(playerId, newPlayers).then(() => {
        setPlayers(newPlayers);
      });
      console.log(newPlayers);
    }
  }, [decorOK, changePlayer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (decorOK) {
        api.signal(playerId).then((r) => {
          if (r.toUpdate.decor) {
            api.downloadDecor(playerId).then((rep) => {
              setDisableUpdate(true);
              setDecor(rep.decor);
            });
          }
          if (r.toUpdate.sprite) {
            setDecor((oldDecor) => {
              const newDecor = [...oldDecor];
              newDecor[r.toUpdate.newSprite.n] = r.toUpdate.newSprite;
              return newDecor;
            });
          }
          if (r.toUpdate.players) {
            setPlayers((oldPlayers) => {
              const newPlayers = r.toUpdate.newPlayers;
              newPlayers[playerId].x = oldPlayers[playerId].x;
              newPlayers[playerId].y = oldPlayers[playerId].y;
              newPlayers[playerId].bombs = oldPlayers[playerId].bombs;
              return newPlayers;
            });
            setYourName(r.toUpdate.newPlayers[playerId].name);
          }
          if (r.toUpdate.fires) {
            api.downloadFires(playerId).then((rep) => {
              setDisableUpdate(true);
              setFires(rep.fires);
            });
          }
          if (r.toUpdate.idPlayer > -1) {
            console.log(r.toUpdate.idPlayer);
            setPlayerId(r.toUpdate.idPlayer);
          }
        });
      }
      setDisableUpdate(false);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [decorOK]);

  useEffect(() => {
    const interval = setInterval(() => {
      switch (displacement) {
        case "left": {
          setPlayers((oldPlayers) => {
            const { x, y } = engine.tryToGoLeft(
              decor,
              oldPlayers,
              oldPlayers[playerId]
            );
            if (x !== -1 || y !== -1) {
              if (
                oldPlayers[oldPlayers[playerId].n].x != x ||
                oldPlayers[oldPlayers[playerId].n].y != y
              ) {
                const newPlayers = oldPlayers.map((item) => ({ ...item }));
                newPlayers[oldPlayers[playerId].n].x = x;
                newPlayers[oldPlayers[playerId].n].y = y;
                api.uploadPlayer(playerId, newPlayers[oldPlayers[playerId].n]);
                return newPlayers;
              }
            }
            return oldPlayers;
          });
          break;
        }
        case "right": {
          setPlayers((oldPlayers) => {
            const { x, y } = engine.tryToGoRight(
              decor,
              oldPlayers,
              oldPlayers[playerId]
            );
            if (x !== -1 || y !== -1) {
              if (
                oldPlayers[oldPlayers[playerId].n].x != x ||
                oldPlayers[oldPlayers[playerId].n].y != y
              ) {
                const newPlayers = oldPlayers.map((item) => ({ ...item }));
                newPlayers[oldPlayers[playerId].n].x = x;
                newPlayers[oldPlayers[playerId].n].y = y;
                api.uploadPlayer(playerId, newPlayers[oldPlayers[playerId].n]);
                return newPlayers;
              }
            }
            return oldPlayers;
          });
          break;
        }
        case "down": {
          setPlayers((oldPlayers) => {
            const { x, y } = engine.tryToGoDown(
              decor,
              oldPlayers,
              oldPlayers[playerId]
            );
            if (x !== -1 || y !== -1) {
              if (
                oldPlayers[oldPlayers[playerId].n].x != x ||
                oldPlayers[oldPlayers[playerId].n].y != y
              ) {
                const newPlayers = oldPlayers.map((item) => ({ ...item }));
                newPlayers[oldPlayers[playerId].n].x = x;
                newPlayers[oldPlayers[playerId].n].y = y;
                api.uploadPlayer(playerId, newPlayers[oldPlayers[playerId].n]);
                return newPlayers;
              }
            }
            return oldPlayers;
          });
          break;
        }
        case "up": {
          setPlayers((oldPlayers) => {
            const { x, y } = engine.tryToGoUp(
              decor,
              oldPlayers,
              oldPlayers[playerId]
            );
            if (x !== -1 || y !== -1) {
              if (
                oldPlayers[oldPlayers[playerId].n].x != x ||
                oldPlayers[oldPlayers[playerId].n].y != y
              ) {
                const newPlayers = oldPlayers.map((item) => ({ ...item }));
                newPlayers[oldPlayers[playerId].n].x = x;
                newPlayers[oldPlayers[playerId].n].y = y;
                api.uploadPlayer(playerId, newPlayers[oldPlayers[playerId].n]);
                return newPlayers;
              }
            }
            return oldPlayers;
          });
          break;
        }
        default: {
          break;
        }
      }
  
    }, init.speed);

    return () => {
      clearInterval(interval);
    };
  }, [displacement]);

  useEffect(() => {
    if (decorOK && playerId > 0) {
      const newPlayers = Object.assign([], players);
      const p = util.emptyRandomPosition(decor, nx, ny);
      console.log(p);
      const newPlayer = init.makePlayer(players.length, p.x, p.y);
      newPlayers.push(newPlayer);
      api.uploadPlayers(playerId, newPlayers).then(() => {
        setPlayers(newPlayers);
      });
      console.log(newPlayers);
    }
  }, [decorOK, changePlayer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (decorOK && autoMode) {
        robot.moveRobot(decor, robotInertia, setRobotInertia, players, myPlayer, dropBomb, fires, nx, setDisplacement);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [decorOK, decor, players, fires, autoMode, robotInertia]);

  useEffect(() => {
    if (decorOK && !disableUpdate) {
      api.uploadFires(playerId, fires);
    }
  }, [fires]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSoundOnChange = () => {
    setSoundOn(!soundOn);
  };

  const handleDisplayName = () => {
    setDisplayName(!displayName);
  };

  const handleAutoModeChange = () => {
    setAutoMode(!autoMode);
  };

  const handleYourNameChange = (e) => {
    if (decorOK) {
      const newPlayers = Object.assign([], players);
      newPlayers[playerId].name = e.target.value;
      api.uploadPlayer(playerId, newPlayers[playerId]);
      setPlayers(players);
      setYourName(e.target.value);
    }
  };

  const myPlayer = () => {
    return players[playerId];
  };

  function dropBomb(player) {
    if (player.dead || player.bombs === 0) return;
    const i = Math.round(player.x / 32);
    const j = Math.round(player.y / 32);
    const n = util.getIndex(i, j, nx);
    if (decor[n].image === "") {
      const x = util.getI(n, nx) * 32;
      const y = util.getJ(n, nx) * 32;
      if (!util.isOkForXY(decor, players, player, x, y)) {
        return; // on ne peut pas poser à cet endroit
      }
      const newDecor = Object.assign([], decor);
      newDecor[n] = {
        x: x,
        y: y,
        image: "bomb1.png",
        n: n,
        owner: player.n,
      };
      setDecor(newDecor);
      api.uploadSprite(playerId, newDecor[n]);
      const newPlayers = Object.assign([], players);
      newPlayers[player.n].x = x;
      newPlayers[player.n].y = y;
      if (player.bombs > 0) {
        newPlayers[player.n].bombs--;
      }
      api.uploadPlayer(playerId, newPlayers[player.n]);
      setPlayers(newPlayers);
    }
  }

  function handleControlDisplacement(displacement) {
    setDisplacement(displacement);
  }

  function handleControlBomb() {
    dropBomb(myPlayer());
  }

  const handleExplode = (n) => {
    const newPlayers = players.map((item) => ({ ...item }));
    newPlayers.map((player) => {
      if (
        Math.abs(player.x - util.getI(n, nx) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n, nx) * 32) < 16
      ) {
        player.dead = true;
        player.score--;
        api.uploadPlayer(playerId, player);
      }
    });
    newPlayers[decor[n].owner].bombs++;
    api.uploadPlayer(playerId, newPlayers[decor[n].owner]);
    setPlayers(newPlayers);

    const newDecor = decor.map((item) => ({ ...item }));
    newDecor[n].image = ""; // remove bomb
    setDecor(newDecor);
    api.uploadSprite(playerId, newDecor[n]);
    const newFires = [...fires];
    newFires.push(n);
    setFires(newFires);
  };

  const HandleBurn = (n) => {
    const newPlayers = Object.assign([], players);
    newPlayers.map((player) => {
      if (
        Math.abs(player.x - util.getI(n, nx) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n, nx) * 32) < 16
      ) {
        if (!player.dead) {
          player.dead = true;
          player.score--;
          api.uploadPlayer(playerId, player);
        }
      }
    });
    setPlayers(newPlayers);

    const newDecor = Object.assign([], decor);
    if (decor[n].image === "brick.png") {
      newDecor[n].image = "";
      setDecor(newDecor);
      api.uploadSprite(playerId, newDecor[n]);
    } else if (decor[n].image.includes("bomb")) {
      newDecor[n].explode = true; // chain reaction
      setDecor(newDecor);
      const newFires = [...fires];
      fires.push(n);
      setFires(newFires);
    }
  };

  function handleFireEnd(n) {
    setFires(fires.filter((elt) => elt !== n)); // on supprime le fire
  }

  const handleReborn = (n) => {
    const newPlayers = Object.assign([], players);
    newPlayers[n].dead = false;
    newPlayers[n].bombs = init.nbBombsMax;
    api.uploadPlayer(playerId, newPlayers[n]);
    setPlayers(newPlayers);
  };

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      event.preventDefault();
      setDisplacement("left");
    }
    if (event.code === "ArrowRight") {
      event.preventDefault();
      setDisplacement("right");
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      setDisplacement("down");
    }
    if (event.code === "ArrowUp") {
      event.preventDefault();
      setDisplacement("up");
    }
    if (event.code === "Space") {
      event.preventDefault();
      dropBomb(myPlayer());
    }
  }

  function handleKeyUp(event) {
    if (event.code === "ArrowLeft" && displacement === "left") {
      event.preventDefault();
      setDisplacement("");
    }
    if (event.code === "ArrowRight" && displacement === "right") {
      event.preventDefault();
      setDisplacement("");
    }
    if (event.code === "ArrowDown" && displacement === "down") {
      event.preventDefault();
      setDisplacement("");
    }
    if (event.code === "ArrowUp" && displacement === "up") {
      event.preventDefault();
      setDisplacement("");
    }
  }

  function handleInitGame() {
    api.initGame();
    document.location = "/";
  }

  return (
    <>
      <div id="infos">
        <span id="titre">Metablaster</span>
      </div>
      <div className="score">
        <ul>
          {players.map((player) => (
            <li className={myPlayer() == player ? "score1" : "score2"}>
              <Score
                n={player.score}
                name={player.name}
                displayName={displayName}
              ></Score>
            </li>
          ))}
        </ul>
      </div>
      <div
        id="board"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex="0"
        ref={inputRef}
      >
        {decor.map((sprite, n) => (
          <Sprite
            key={n}
            x={sprite.x}
            y={sprite.y}
            ni={nx}
            image={
              sprite.image === "" || sprite.image.includes("bomb")
                ? "grass.png"
                : sprite.image
            }
          />
        ))}
        {players.map((player, n) => (
          <Player
            key={n}
            x={player.x}
            y={player.y}
            n={n}
            ni={nx}
            name={player.name}
            displayName={displayName}
            dead={player.dead}
            image={myPlayer() == player ? "player.png" : "robot.png"}
            onReborn={handleReborn}
          />
        ))}
        {decor
          .filter((sprite) => {
            return sprite.image.includes("bomb");
          })
          .map((sprite) => (
            <Bomb
              key={sprite.n}
              x={sprite.x}
              y={sprite.y}
              n={sprite.n}
              ni={nx}
              onExplode={handleExplode}
              explode={sprite.explode}
              soundOn={soundOn}
            />
          ))}
        {fires.map((sprite, n) => (
          <Fire
            key={n}
            decor={decor}
            n={sprite}
            onBurn={HandleBurn}
            onEnd={handleFireEnd}
            ni={nx}
          />
        ))}
        <Help ni={nx}></Help>
      </div>
      <Controls
        onDisplacement={handleControlDisplacement}
        onBomb={handleControlBomb}
      ></Controls>

      <button
        id="initgame"
        onClick={handleInitGame}
        type="button"
        className="controle"
      >
        init game
      </button>

      <div id="parameters">
        <input
          type="checkbox"
          checked={soundOn}
          onChange={handleSoundOnChange}
          name="sound"
        />
        <label htmlFor="sound">sound | </label>
        <input
          type="checkbox"
          checked={displayName}
          onChange={handleDisplayName}
          name="displayname"
        />
        <label htmlFor="displayname">names</label>
        {displayName ? (
          <input
            className="yourname"
            type="text"
            name="yourname"
            value={yourName}
            maxLength="2"
            size="2"
            onChange={handleYourNameChange}
          />
        ) : (
          <></>
        )}
        <label htmlFor="sep"> | </label>
        <input
          type="checkbox"
          checked={autoMode}
          onChange={handleAutoModeChange}
          name="automode"
        />
        <label htmlFor="mode">auto</label>
      </div>
      <div id="auteur">
        <a href="https://greduvent.herokuapp.com/" target="_blank">
          by jeeve
        </a>
      </div>
    </>
  );
}
