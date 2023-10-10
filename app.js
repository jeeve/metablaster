const express = require("express");
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); 

app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static("public"));
app.get("/", function (request, response) {
  response.sendFile("./index.html", { root: __dirname + '/public' });
});

const { game } = require("./models/game");

app.get("/api/init", (req, res) => {
  game.init(); 
  res.end();
});

app.get("/api/nbplayers", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ nbPlayers: game.nbPlayers() }));
});

app.get("/api/register/:idplayer", (req, res) => {
  game.players.push({ n: game.players.length });
  const idPlayer = Number(req.params.idplayer);
  console.log("register " + idPlayer);
  game.players.map((elt, i) => {
    if (i != idPlayer) {
      if (!game.toUpdatePlayers.includes(elt.n)) {
        game.toUpdatePlayers.push(i);
      }
    }
  });
  game.reindexPlayers();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ id: game.nbPlayers() }));
});

app.get("/api/signal/:idplayer", (req, res) => {
  const idPlayer = Number(req.params.idplayer);
  //console.log("signal " + idPlayer);
  game.signals.set(idPlayer, Date.now());
  const toUpdate = { decor: false, sprite: false, players: false, fires: false, idPlayer: -1 };
  if (game.toUpdateDecor.includes(idPlayer)) {
    toUpdate.decor = true;
  }
  if (game.toUpdateSprite.includes(idPlayer)) {
    toUpdate.sprite = true;
  }
  if (game.toUpdatePlayers.includes(idPlayer)) {
    toUpdate.players = true;
  }
  if (game.toUpdateFires.includes(idPlayer)) {
    toUpdate.fires = true;
  }
  if (game.idPlayersToDecrease.includes(idPlayer)) {
    if (idPlayer > 0) {
      toUpdate.idPlayer = idPlayer - 1;
    }
    console.log("idplayer " + idPlayer + " -> " + toUpdate.idPlayer);
    game.idPlayersToDecrease = game.idPlayersToDecrease.filter((elt) => elt !== idPlayer);
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ toUpdate: toUpdate }));
});

app.get("/api/initgame/", (req, res) => {
  console.log("init game");
  game.nx = -1;
  game.ny = -1;
  game.decor = [];
  game.players = [];
  game.fires = [];
  res.setHeader("Content-Type", "application/json");
  res.end();
});

app.post("/api/uploadgame/", (req, res) => {
  const idPlayer = Number(req.body.idplayer);
  console.log("upload game " + idPlayer);
  game.nx = req.body.nx;
  game.ny = req.body.ny;
  game.decor = req.body.decor;
  game.players = req.body.players;
  game.players.map((elt) => {
    if (elt.n != idPlayer) {
      if (!game.toUpdateDecor.includes(elt.n)) {
        game.toUpdateDecor.push(elt.n);
      }
    }
  });
  game.players.map((elt) => {
    if (elt.n != idPlayer) {
      if (!game.toUpdatePlayers.includes(elt.n)) {
        game.toUpdatePlayers.push(elt.n);
      }
    }
  });
  game.toUpdateDecor = game.toUpdateDecor.filter((elt) => elt != idPlayer);
  game.toUpdatePlayers = game.toUpdatePlayers.filter((elt) => elt != idPlayer);
  res.end();
});

app.post("/api/uploaddecor/", (req, res) => {
  const idPlayer = Number(req.body.idPlayer);
  console.log("upload decor " + idPlayer);
  game.nx = req.body.nx;
  game.ny = req.body.ny;
  game.decor = req.body.decor;
  game.players.map((elt) => {
    if (elt.n != idPlayer) {
      if (!game.toUpdateDecor.includes(elt.n)) {
        game.toUpdateDecor.push(elt.n);
      }
    }
  });
  game.toUpdateDecor = game.toUpdateDecor.filter((elt) => elt != idPlayer);
  res.end();
});

app.post("/api/uploadsprite/", (req, res) => {
  const idPlayer = Number(req.body.idPlayer);
  console.log("upload sprite " + idPlayer);
  const sprite = req.body.sprite;
  game.sprite = sprite;
  game.players.map((elt) => {
    if (elt.n != idPlayer) {
      if (!game.toUpdateSprite.includes(elt.n)) {
        game.toUpdateSprite.push(elt.n);
      }
    }
  });
  game.toUpdateSprite = game.toUpdateSprite.filter((elt) => elt != idPlayer);
  res.end();
});

app.post("/api/uploadplayers/", (req, res) => {
  const idPlayer = Number(req.body.idPlayer);
  console.log("upload players " + idPlayer);
  game.players = req.body.players;
  console.log(game.toUpdatePlayers);
  game.players.map((elt) => {
    if (elt.n != idPlayer) {
      if (!game.toUpdatePlayers.includes(elt.n)) {
        game.toUpdatePlayers.push(elt.n);
      }
    }
  });
  game.toUpdatePlayers = game.toUpdatePlayers.filter((elt) => elt != idPlayer);
  console.log(game.toUpdatePlayers);
  res.end();
});

app.post("/api/uploadfires/", (req, res) => {
  const idPlayer = Number(req.body.idPlayer);
  console.log("upload fires " + idPlayer);
  game.fires = req.body.fires;
  console.log(game.toUpdateFires);
  game.players.map((elt) => {
    if (elt.n != idPlayer) {
      if (!game.toUpdateFires.includes(elt.n)) {
        game.toUpdateFires.push(elt.n);
      }
    }
  });
  game.toUpdateFires = game.toUpdateFires.filter((elt) => elt != idPlayer);
  console.log(game.toUpdateFires);
  res.end();
});

app.get("/api/downloadgame/:idplayer", (req, res) => {
  const idPlayer = Number(req.params.idplayer);
  console.log("download game " + idPlayer);
  game.toUpdateDecor = game.toUpdateDecor.filter((elt) => elt != idPlayer);
  game.toUpdatePlayers = game.toUpdatePlayers.filter((elt) => elt != idPlayer);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ nx: game.nx, ny: game.ny, decor: game.decor, players: game.players }));
});

app.get("/api/downloaddecor/:idplayer", (req, res) => {
  const idPlayer = Number(req.params.idplayer);
  console.log("download decor " + idPlayer);
  game.toUpdateDecor = game.toUpdateDecor.filter((elt) => elt != idPlayer);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ nx: game.nx, ny: game.ny,decor: game.decor }));
});

app.get("/api/downloadsprite/:idplayer", (req, res) => {
  const idPlayer = Number(req.params.idplayer);
  console.log("download sprite " + idPlayer);
  game.toUpdateSprite = game.toUpdateSprite.filter((elt) => elt != idPlayer);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ sprite: game.sprite }));
});

app.get("/api/downloadplayers/:idplayer", (req, res) => {
  const idPlayer = Number(req.params.idplayer);
  console.log("download players " + idPlayer);
  game.toUpdatePlayers = game.toUpdatePlayers.filter((elt) => elt != idPlayer);
  console.log(game.toUpdatePlayers);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ players: game.players }));
});

app.get("/api/downloadfires/:idplayer", (req, res) => {
  const idPlayer = Number(req.params.idplayer);
  console.log("download fires " + idPlayer);
  game.toUpdateFires = game.toUpdateFires.filter((elt) => elt != idPlayer);
  console.log(game.toUpdateFires);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ fires: game.fires }));
});

module.exports = app;
