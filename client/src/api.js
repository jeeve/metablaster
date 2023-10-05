export async function getNbPlayers() {
  let nbPlayers = -1;

  const init = {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
  };

  await fetch("/api/nbplayers/", init)
    .then((response) => response.json())
    .then((response) => (nbPlayers = response.nbPlayers));

  return nbPlayers;
}

export function uploadGame(idPlayer, decor, players) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idPlayer: idPlayer,
      decor: decor,
      players: players
    }),
    mode: "cors",
    credentials: "same-origin",
  };

  fetch("/api/uploadgame/", init);
}

export function uploadDecor(idPlayer, decor) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idPlayer: idPlayer,
      decor: decor,
    }),
    mode: "cors",
    credentials: "same-origin",
  };

  fetch("/api/uploaddecor/", init);
}

export function uploadPlayers(idPlayer, players) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idPlayer: idPlayer,
      players: players,
    }),
    mode: "cors",
    credentials: "same-origin",
  };

  fetch("/api/uploadplayers/", init);
}

export function uploadFires(idPlayer, fires) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idPlayer: idPlayer,
      fires: fires,
    }),
    mode: "cors",
    credentials: "same-origin",
  };

  fetch("/api/uploadfires/", init);
}

export async function register(idPlayer) {
  const init = {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
  };

  await fetch("/api/register/" + idPlayer, init);
}

export function initGame() {
  const init = {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
  };

  fetch("/api/initgame/", init);
}

export async function downloadGame(idPlayer) {

  let game = {};

  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "same-origin",
  };

  await fetch("/api/downloadgame/"+ idPlayer, init).then(response => response.json())
  .then(response => game = response );

  return game;
}

export async function downloadDecor(idPlayer) {

  let decor = {};

  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "same-origin",
  };

  await fetch("/api/downloaddecor/"+ idPlayer, init).then(response => response.json())
  .then(response => decor = response);

  return decor;
}

export async function downloadPlayers(idPlayer) {

  let players = {};

  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "same-origin",
  };

  await fetch("/api/downloadplayers/"+ idPlayer, init).then(response => response.json())
  .then(response => players = response);

  return players;
}

export async function downloadFires(idPlayer) {

  let fires = {};

  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "same-origin",
  };

  await fetch("/api/downloadfires/"+ idPlayer, init).then(response => response.json())
  .then(response => fires = response);

  return fires;
}

export async function signal(idPlayer) {

  let toUpdate = {};

  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "same-origin",
  };

  await fetch("/api/signal/"+ idPlayer, init).then(response => response.json())
  .then(response => toUpdate = response);

  return toUpdate;
}

