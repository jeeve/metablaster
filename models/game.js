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
      this.signals.clear();
      this.idPlayersToDecreas = [];
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

      this.signals.delete(idPlayer);

      const newSignals = new Map;
      this.signals.forEach((value, key, map) => {
        if (key > idPlayer) {
          newSignals.set(key - 1, value);
        } else {
          newSignals.set(key, value);
        }
      });
      this.signals = newSignals;

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