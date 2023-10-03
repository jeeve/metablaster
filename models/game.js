class Game {
    constructor() {
      this.decor = [];
      this.players = [];
      this.fires = [];
      this.toUpdateDecor = [];
      this.toUpdatePlayers = [];
      this.toUpdateFires = [];
      this.signals = new Map;
      this.idPlayersToDecrease = [];
    }

    init() {
      this.decor = [];
      this.players = [];
      this.fires = [];
      this.toUpdateDecor = [];
      this.toUpdatePlayers = [];
      this.toUpdateDecor = [];
      this.toUpdateFires = [];
      this.idPlayersToDecreas = [];
      this.signals.clear();
    }

    nbPlayers() {
      return this.players.length;
    }

    deletePlayer(idPlayer) {
      console.log("delete player " + idPlayer);
      this.players.map((elt) => {
        if (elt.n != idPlayer) {
          if (!this.toUpdatePlayers.includes(elt.n)) {
            this.toUpdatePlayers.push(elt.n);
          }
        }
      });
      this.players = this.players.filter((elt, i) => elt.n !== idPlayer);
      for (let i = idPlayer; i < this.players.length; i++) {
        this.idPlayersToDecrease.push(i);
      }
      this.reindexPlayers();
      this.signals.delete(idPlayer);
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