import { useEffect, useState, useRef } from "react";
import Sprite from "./components/Sprite";
import Bomb from "./components/Bomb";
import Fire from "./components/Fire";
import Score from "./components/Score";
import Player from "./components/Player";
import Controls from "./components/Controls";
import * as init from "./init";
import * as util from "./util";
import * as engine from "./engine";
import * as robot from "./robot";
import * as api from "./api";

export default function Game() {
  const inputRef = useRef(null);
  const [playerId, setPlayerId] = useState(-1);
  const [soundOn, setSoundOn] = useState(false);
  const [displayName, setDisplayName] = useState(true);
  const [yourName, setYourName] = useState(1);
  const [decor, setDecor] = useState([]);
  const [decorOK, setDecorOK] = useState(false);
  const [players, setPlayers] = useState([
    {
      x: 0,
      y: 0,
      score: 0,
      dead: false,
      image: "player.png",
      n: 0,
      name: 1,
      bombs: init.nbBombsMax,
    },
  ]);
  const [fires, setFires] = useState([]);
  const [robotInertia, setRobotInertia] = useState(init.robotAgitation);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [displacement, setDisplacement] = useState("");

  useEffect(() => {
    api.getNbPlayers(playerId).then((nbPlayers) => {
      if (nbPlayers > 0) {
        api.downloadGame(playerId).then((game) => {
          setDisableUpdate(true);
          setDecor(game.decor);
          setPlayers(game.players);
          setDisableUpdate(false);
          setDecorOK(true);
          setPlayerId(nbPlayers);
          api.register(nbPlayers);
        });
      } else {
        setDecor(init.makeDecor(setDecorOK));
        setPlayerId(0);
        api.register(0);
      }
    });
  }, []);

  useEffect(() => {
    if (decorOK && playerId === 0) {
      const newPlayers = Object.assign([], players);
      const p = util.emptyRandomPosition(decor);
      newPlayers[0].x = p.x;
      newPlayers[0].y = p.y;
      setPlayers(newPlayers);
      setYourName(playerId + 1);
    }
  }, [decorOK]);

  useEffect(() => {
    if (playerId > 0) {
      const newPlayers = Object.assign([], players);
      const p = util.emptyRandomPosition(decor);
      const newPlayer = {
        x: p.x,
        y: p.y,
        score: 0,
        dead: false,
        image: "robot.png",
        n: players.length,
        name: playerId + 1,
        bombs: init.nbBombsMax,
      };
      newPlayers.push(newPlayer);
      setPlayers(newPlayers);
    }
    setYourName(playerId + 1);
  }, [playerId]);

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
          if (r.toUpdate.players) {
            api.downloadPlayers(playerId).then((rep) => {
              setDisableUpdate(true);
              setPlayers(rep.players);
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
    if (decorOK && !disableUpdate) {
      api.uploadDecor(playerId, decor);
    }
  }, [decor]);

  useEffect(() => {
    if (decorOK && !disableUpdate) {
      api.uploadPlayers(playerId, players);
    }
  }, [players]);

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

  const handleYourNameChange = (e) => {
    if (decorOK) {
      const newPlayers = Object.assign([], players);
      newPlayers[playerId].name = e.target.value;
      setPlayers(players);
      setYourName(e.target.value);
      api.uploadPlayers(playerId, players);
    }
  };

  const myPlayer = () => {
    return players[playerId];
  };
  /*
  const theRobot = () => {
    return players[1];
  };
*/
  function dropBomb(player) {
    if (player.dead || player.bombs === 0) return;
    const nextDecor = Object.assign([], decor);
    const i = Math.round(player.x / 32);
    const j = Math.round(player.y / 32);
    const n = util.getIndex(i, j);
    if (decor[n].image === "") {
      const x = util.getI(n) * 32;
      const y = util.getJ(n) * 32;
      if (!util.isOkForXY(decor, players, player, x, y)) {
        return; // on ne peut pas poser à cet endroit
      }
      nextDecor[n] = {
        x: x,
        y: y,
        image: "bomb1.png",
        n: n,
        owner: player.n,
      };
      setDecor(nextDecor);
      const newPlayers = Object.assign([], players);
      newPlayers[player.n].x = x;
      newPlayers[player.n].y = y;
      if (player.bombs > 0) {
        newPlayers[player.n].bombs--;
      }
      setPlayers(newPlayers);
    }
  }

  function handleControlDisplacement(displacement) {
    setDisplacement(displacement);
  }

  function handleControlBomb() {
    dropBomb(myPlayer());
  }

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

  const handleExplode = (n) => {
    const playersToIncreaseScore = [];
    let newPlayers = players.map((player) => {
      const newPlayer = { ...player };
      if (
        Math.abs(player.x - util.getI(n) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n) * 32) < 16
      ) {
        newPlayer.dead = true;
        newPlayer.score--;
        playersToIncreaseScore.push(player.n);
      }
      return newPlayer;
    });
    newPlayers = newPlayers.map((player) => {
      const newPlayer = { ...player };
      if (!playersToIncreaseScore.includes(player.n)) {
        // on crédite tous les autres
        newPlayer.score++;
      }
      return player;
    });
    const newDecor = Object.assign([], decor);
    newDecor[n].image = ""; // remove bomb
    setDecor(newDecor);
    newPlayers[decor[n].owner].bombs++; // on recredite le nombre de bombes dispo
    setPlayers(newPlayers);
    const newFires = [...fires];
    newFires.push(n);
    setFires(newFires);
  };

  const HandleBurn = (n) => {
    const playersToIncreaseScore = [];
    players.map((player) => {
      if (
        Math.abs(player.x - util.getI(n) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n) * 32) < 16
      ) {
        player.dead = true;
        player.score--;
      }
    });
 
    const newDecor = Object.assign([], decor);
    if (decor[n].image === "brick.png") {
      newDecor[n].image = "";
      setDecor(newDecor);
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
    setPlayers(newPlayers);
  };

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      robot.moveRobot(
        decor,
        robotInertia,
        setRobotInertia,
        players,
        theRobot,
        dropBomb,
        fires
      );

      switch (theRobot().displacement) {
        case "left": {
          engine.tryToGoLeft(decor, players, theRobot()).then((response) => {
            const newPlayers = Object.assign([], players);
            newPlayers[theRobot().n].x = response.x;
            newPlayers[theRobot().n].y = response.y;
            setPlayers(newPlayers);
          });
          break;
        }
        case "right": {
          engine.tryToGoRight(decor, players, theRobot()).then((response) => {
            const newPlayers = Object.assign([], players);
            newPlayers[theRobot().n].x = response.x;
            newPlayers[theRobot().n].y = response.y;
            setPlayers(newPlayers);
          });
          break;
        }
        case "down": {
          engine.tryToGoDown(decor, players, theRobot()).then((response) => {
            const newPlayers = Object.assign([], players);
            newPlayers[theRobot().n].x = response.x;
            newPlayers[theRobot().n].y = response.y;
            setPlayers(newPlayers);
          });
          break;
        }
        case "up": {
          engine.tryToGoUp(decor, players, theRobot()).then((response) => {
            const newPlayers = Object.assign([], players);
            newPlayers[theRobot().n].x = response.x;
            newPlayers[theRobot().n].y = response.y;
            setPlayers(newPlayers);
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
  }, [decor, players, robotInertia, fires]);
*/
  useEffect(() => {
    const interval = setInterval(() => {
      switch (displacement) {
        case "left": {
          engine.tryToGoLeft(decor, players, myPlayer()).then((response) => {
            if (
              players[myPlayer().n].x != response.x ||
              players[myPlayer().n].y != response.y
            ) {
              const newPlayers = Object.assign([], players);
              newPlayers[myPlayer().n].x = response.x;
              newPlayers[myPlayer().n].y = response.y;
              setPlayers(newPlayers);
            }
          });
          break;
        }
        case "right": {
          engine.tryToGoRight(decor, players, myPlayer()).then((response) => {
            if (
              players[myPlayer().n].x != response.x ||
              players[myPlayer().n].y != response.y
            ) {
              const newPlayers = Object.assign([], players);
              newPlayers[myPlayer().n].x = response.x;
              newPlayers[myPlayer().n].y = response.y;
              setPlayers(newPlayers);
            }
          });
          break;
        }
        case "down": {
          engine.tryToGoDown(decor, players, myPlayer()).then((response) => {
            if (
              players[myPlayer().n].x != response.x ||
              players[myPlayer().n].y != response.y
            ) {
              const newPlayers = Object.assign([], players);
              newPlayers[myPlayer().n].x = response.x;
              newPlayers[myPlayer().n].y = response.y;
              setPlayers(newPlayers);
            }
          });
          break;
        }
        case "up": {
          engine.tryToGoUp(decor, players, myPlayer()).then((response) => {
            if (
              players[myPlayer().n].x != response.x ||
              players[myPlayer().n].y != response.y
            ) {
              const newPlayers = Object.assign([], players);
              newPlayers[myPlayer().n].x = response.x;
              newPlayers[myPlayer().n].y = response.y;
              setPlayers(newPlayers);
            }
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
          />
        ))}
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
      </div>
      <div id="auteur">
        <a href="https://greduvent.herokuapp.com/" target="_blank">
          by jeeve
        </a>
      </div>
    </>
  );
}
