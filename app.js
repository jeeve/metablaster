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
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ id: game.nbPlayers() }));
});

app.get("/api/signal/:idplayer", (req, res) => {
  const idPlayer = Number(req.params.idplayer);
  //console.log("signal " + idPlayer);
  game.signals.set(idPlayer, Date.now());
  const toUpdate = { decor: false, players: false, fires: false, idPlayer: -1 };
  if (game.toUpdateDecor.includes(idPlayer)) {
    toUpdate.decor = true;
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
  game.decor = [];
  game.players = [];
  res.setHeader("Content-Type", "application/json");
  res.end();
});

app.post("/api/uploadgame/", (req, res) => {
  const idPlayer = Number(req.body.idplayer);
  console.log("upload game " + idPlayer);
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
  res.end(JSON.stringify({ decor: game.decor, players: game.players }));
});

app.get("/api/downloaddecor/:idplayer", (req, res) => {
  const idPlayer = Number(req.params.idplayer);
  console.log("download decor " + idPlayer);
  game.toUpdateDecor = game.toUpdateDecor.filter((elt) => elt != idPlayer);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ decor: game.decor }));
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

/*
const { infos } = require("./models/infosModel");

app.get("/init/:nbEcrans", (req, res) => {
  infos.nbEcrans = Number(req.params.nbEcrans) - 1;
  console.log(Date() + " - Init");
  infos.tagDecorEstModifie = [false];
  infos.score = { a: 0, b: 0 };
  infos.tempoScore = 0;
  infos.signaux = [];
  infos.idEcransModifies = [];
  infos.ajouteEcran();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ nbEcrans: infos.nbEcrans }));
});

app.get("/register/", (req, res) => {
  infos.ajouteEcran();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ id: infos.nbEcrans }));
});

app.post("/render/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(infos.render(req.body.id)));
});

app.post("/sprite/", (req, res) => {
  let id = req.body.id;
  let b = [];
  let nouvellesBriques = [];
  infos.nouvellesBriques.forEach((brique) => {
    if (infos.blocEstDansDecor(brique, id)) {
      b.push({
        x: brique.x - (id - 1) * 100,
        y: brique.y,
        classe: brique.classe,
      });
    } else {
      nouvellesBriques.push({
        x: brique.x,
        y: brique.y,
        classe: brique.classe,
      });
    }
  });
  infos.nouvellesBriques = nouvellesBriques;

  let bMortes = [];
  let briquesMortes = [];
  infos.briquesMortes.forEach((brique) => {
    if (infos.blocEstDansDecor(brique, id)) {
      bMortes.push({
        x: brique.x - (id - 1) * 100,
        y: brique.y,
        classe: brique.classe,
      });
    } else {
      briquesMortes.push({ x: brique.x, y: brique.y, classe: brique.classe });
    }
  });
  infos.briquesMortes = briquesMortes;

  let aPerdu = "";
  if (infos.nbEcrans == 1) {
    if (id == 1 || id == infos.nbEcrans) {
      if (infos.perduGauche) {
        aPerdu = "gauche";
        infos.perduGauche = false;
      }
      if (infos.perduDroit) {
        aPerdu = "droit";
        infos.perduDroit = false;
      }
    }
  } else {
    if (id == 1) {
      if (infos.perduGauche) {
        aPerdu = "gauche";
        infos.perduGauche = false;
      }
    }
    if (id == infos.nbEcrans) {
      if (infos.perduDroit) {
        aPerdu = "droit";
        infos.perduDroit = false;
      }
    }
  }

  let sprite = {
    balle: infos.getBalle(id),
    alerte: infos.alerte,
    briques: b,
    briquesMortes: bMortes,
    perdu: aPerdu,
  };

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(sprite));
});

app.get("/nouvellebrique/", (req, res) => {
  let brique = infos.creeBrique();
  if (brique) {
    infos.nouvellesBriques.push(brique);
  }
  res.end();
});

app.post("/metajourraquette/", (req, res) => {
  let id = req.body.id;
  let raquette = req.body.raquette;
  infos.decor.raquettes[id - 1] = [];
  raquette.forEach(function (blocRaquette) {
    infos.decor.raquettes[id - 1].push({
      x: blocRaquette.x,
      y: blocRaquette.y,
    });
  });
  res.end();
});

app.get("/decorestmodifie/:numeroEcran", (req, res) => {
  let numeroEcran = Number(req.params.numeroEcran);
  let estModifie = infos.getTagDecorEstModifie(numeroEcran);
  infos.setTagDecorEstModifie(numeroEcran, false);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ tag: estModifie }));
});

app.get("/score/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(infos.getScore()));
});

app.get("/signal/:numeroEcran", (req, res) => {
  if (infos.nbEcrans > 0) {
    let numeroEcran = Number(req.params.numeroEcran);
    if (numeroEcran <= infos.signaux.length) {
      infos.signaux[numeroEcran - 1].temps = Date.now();
    }

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ nbEcrans: infos.nbEcrans }));
  } else {
    res.end(JSON.stringify({ nbEcrans: 0 }));
  }
});

app.get("/idecranachange/:numeroEcran", (req, res) => {
  let numeroEcran = Number(req.params.numeroEcran);
  let nouvelIdEcran = numeroEcran;
  let aChange = false;
  let i = infos.idEcransModifies.findIndex((elt) => elt.id == numeroEcran);
  if (i != -1) {
    nouvelIdEcran = infos.idEcransModifies[i].nouvelId;
    infos.idEcransModifies.splice(i, 1);
    infos.signaux = [];
    for (let i = 0; i < infos.nbEcrans; i++) {
      infos.signaux.push({ id: i + 1, temps: Date.now() });
    }
  }
  if (nouvelIdEcran != numeroEcran) {
    aChange = true;
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ aChange: aChange, id: nouvelIdEcran }));
});

app.get("/alerte/", (req, res) => {
  infos.alerte = !infos.alerte;
  res.end();
});

app.post("/vitesse/", (req, res) => {
  if (infos.nbEcrans > 0) {
    let id = req.body.id;
    let dv = req.body.dv;

    if (
      Math.abs(infos.decor.balle.vx * dv) < 3 &&
      Math.abs(infos.decor.balle.vy * dv < 2)
    ) {
      infos.decor.balle.vx = infos.decor.balle.vx * dv;
      infos.decor.balle.vy = infos.decor.balle.vy * dv;
    }
  }
  res.end();
});

*/
module.exports = app;
