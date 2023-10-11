class Game {
    constructor() {
      this.nx = -1;
      this.ny = -1;
      this.decor = [];
      this.sprite = {};
      this.players = [];
      this.fires = [];
      this.toUpdateDecor = [];
      this.toUpdatePlayers = [];
      this.toUpdateSprite = [];
      this.toUpdatePlayer = [];
      this.toUpdateFires = [];
      this.signals = new Map;
      this.idPlayersToDecrease = [];
    }

    init() {
      this.nx = -1;
      this.ny = -1;
      this.decor = [];
      this.sprite = {};
      this.players = [];
      this.fires = [];
      this.toUpdateDecor = [];
      this.toUpdateSprite = [];
      this.toUpdatePlayer = [];
      this.toUpdatePlayers = [];
      this.toUpdateDecor = [];
      this.toUpdateFires = [];
      this.signals.clear();
      this.idPlayersToDecrease = [];
    }

    nbPlayers() {
      return this.players.length;
    }

    deletePlayer(idPlayer) {
      console.log("delete player " + idPlayer);
      this.players.map((elt) => {
        if (elt.n !== idPlayer) {
          if (!this.toUpdatePlayers.includes(elt.n)) {
            this.toUpdatePlayers.push(elt.n);
          }
        }
      });

      this.players = this.players.filter((elt, i) => elt.n !== idPlayer);

      for (let i = idPlayer; i < this.players.length; i++) {
        if (!this.idPlayersToDecrease.includes(i+1)) {
          this.idPlayersToDecrease.push(i+1);
        }
      }

      this.signals.clear();

      this.reindexPlayers();
      console.log("toUpdatePlayers : " + this.toUpdatePlayers)
      console.log("idPlayersToDecrease : " + this.idPlayersToDecrease)
      console.log("signals : " + this.signals)
    }

    signalsAnalyse() {
      this.signals.forEach((value, key, map) => {
        const t = Date.now();
        if (t - value > 5000) {
          this.deletePlayer(key);
        }
      });
    }

    reindexPlayers() {
      this.players.map((elt, i) => {
        elt.n = i;
      });
    }

}
 
const game = new Game();

setInterval(game.signalsAnalyse.bind(game), 5000);

module.exports = { game }