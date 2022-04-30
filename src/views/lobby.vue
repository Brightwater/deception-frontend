<template>
    <div v-if="gameState" id="lobby">
        <h3> Waiting for players to join.. </h3>
        <div id="gameId"> Game ID: {{gameId}}</div>
        <br />
        <div class="inGame">
            <h4> Players in Game: </h4>
            <hr />
            <div id="scrollContainer">
                <div v-for="(player, index) in gameState.players" class="playerName" :key="index"> {{player.username}} </div>
            </div>
        </div>
        <br /> <br />
        <button v-if="gameState.playerCount < 4 || gameState.players[0].username !== username" @click="startGame()" id="bad"> Start Game </button>
        <button v-else @click="startGame()" id="good"> Start Game </button>
        <br />
        <div id="gameError"> {{gameError}} </div>
    </div>
</template>

<script>
import axios from "axios"
import { mapMutations } from 'vuex';

export default {
    data: () => ({
        userList: [],
        gameError: "",
        gameState: {},
        counter: {}
    }),

    props: {
        username: {},
        gameId: {}
    },

    methods: {
        startGame() {
            // Verifying enough players:
            if (this.gameState.players.length < 4) {
                this.gameError = "You need at least 4 players to start the game.";
            } else if (this.gameState.players.length > 12) {
                this.gameError = "You have too many friends. Pick the top 12.";
            } else if (this.gameState.players[0].username != this.username) {
                this.gameError = "You aren't the game host."
            } else {
                this.gameError = "";
                // Starting game:
                axios.get(
                    "http://192.168.1.3:8076/events/startGame/" + this.gameId + "/" + this.username,
                    {
                        headers: {
                            crossDomain: true,
                            //"Content-Type": "application/json",
                            //"Authorization": this.jwt
                        },
                    }
                ).then(response => {});
            }
        },

        async getGameState() {
            axios.get(
                    "http://192.168.1.3:8076/gameState/" + this.gameId + "/" + this.username,
                    {
                        headers: {
                            crossDomain: true,
                            //"Content-Type": "application/json",
                            //"Authorization": this.jwt
                        },
                    }
                ).then(response => {this.gameState = response.data});
        }
    },

    mounted: function () {

        this.$nextTick(async function () {
            this.getGameState();
            this.counter = window.setInterval(() => {
                this.getGameState();
            },1000);
        })
    },

    beforeDestroy() {
        clearInterval(this.counter)
    },

    watch: {
        gameState() {
            if (this.gameState.state !== null) {
                this.$router.push({name: 'game', params: {gameId: this.gameId, username: this.username}});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$hrColor: rgba(255, 255, 190, 0.2);
$buttonColor: rgb(255, 255, 190);
$baseColor: rgba(0, 0, 0, .6);
hr {
    border: 1.5px solid $hrColor;
    background-color: $hrColor;
    margin: 2%;
}
button {
    background-color: $buttonColor;
    border: none;
    padding: 4px;
}
button#bad {
    opacity: .3;
}
button#good {

}
#gameId {
    font-size: small;
}
#gameError {
    color: $buttonColor;
    font-size: small;
    display: inline-block;
    margin: 2px;
}
#lobby {
    display: inline-block;
    background-color: $baseColor;
    min-width: 20%;
    margin-top: 20vh;
    box-shadow: 1px 2px 2px 2px black;
}
.inGame {
    display: inline-block;
    width: 80%;
    background-color: $baseColor;
}
.inGame #scrollContainer {
    overflow-y: auto;
    height: 20vh;
}
.inGame .playerName {
    text-align: left;
    padding: 2px;
    padding-left: 5%;
}
.inGame .playerName:first-child:after {
    content: " [Game Host]";
    color: $buttonColor;
    opacity: .5;
}
</style>