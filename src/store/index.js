import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: "",
    gameId: "",
    selectedOwnCards: {
      weapon: "",
      clue: "",
    },
    
    
  },
  getters: {
  },
  mutations: {
      setWeapon(state, card) {
        state.selectedOwnCards.weapon = card.card;
      },
      setClue(state, card) {
        state.selectedOwnCards.clue = card.card;
      },
      setUsername(state, username) {
        console.log(username);
        state.username = username.username;
      },
      setGameId(state, gameId) {
        console.log(gameId);
        state.gameId = gameId.gameId;
      }
  },
  actions: {
  },
  modules: {
  }
})
