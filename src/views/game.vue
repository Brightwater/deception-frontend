<template>
    <div v-if="gameState" class="gameBoard" :id="gameState.gameId">
        <div id="gameBar">
            <div id="gameSpecs">
                <div id="currentGame"> Game ID: {{gameState.gameId}} </div>
                <div id="currentUser"> Username: {{$store.state.username}} </div>
                <div id="currentForens"> Forensic Scientist: {{gameState.forensicScientistPlayer}} </div>
                <div id="currentRole"> Your role: {{playerRole}} </div>
            </div>
            <div v-if="gameState.forensicScientistPlayer === $store.state.username" class="murderSpecs">
                <div id="murderer"> Murderer: {{murderer.playerName}} </div>
                <div id="murderClue"> Murder Clue: {{murderer.clueCard}} </div>
                <div id="murderWeapon"> Murder Weapon: {{murderer.weaponCard}} </div>
                <button @click="$event.target.parentElement.style.display = 'none'"> [hide] </button>
            </div>
            <div id="buttons">
                <button v-if="submitButtonExists" @click="submitButton()" id="submit"> Submit Cards </button>
                <button v-if="endRoundExists" @click="endRound()" id="submit"> End Round </button>
            </div>
        </div>
        <!--<header style="height: 10vh">
            <button v-if="submitButtonExists" @click="submitButton()" id="submit"> submit </button>
        </header>-->

        <gameboard5 v-cloak
            :gameState="gameState"
            @select-own-card="selectOwnMurderCards"
        />
    </div>
</template>

<script>
import axios from "axios"
import gameboard5 from "@/components/gameboard5.vue"
import { mapMutations } from 'vuex';

export default ({
    components: {
        gameboard5
    },

    props: {
        username: {},
        gameId: {}
    },

    data: () => ({
        gameState: {},
        submitButtonExists: false,
        counter: {},
        playerRole: "",
        revealedToForens: false,
        murderer: {},
        endRoundExists: false
    }),

    methods: {
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
                ).then(response => {this.gameState = response.data;});
        },
        selectOwnMurderCards(event) {
            console.log(event)
        },
        ...mapMutations(["setUsername", "setWeapon", "setClue", 'setPriorClue', 'setPriorWeapon', 'setGameId']),
        submitButton() {
            // submit murder cards
            if (this.gameState.state === "Pregame" && this.$store.state.username !== this.gameState.forensicScientistPlayer) {
                axios.get(
                    "http://192.168.1.3:8076/events/selectCards/" + this.gameId + "/" + this.$store.state.username + "/" + this.$store.state.selectedOwnCards.clue + "/" + this.$store.state.selectedOwnCards.weapon,
                    {                                                                               
                        headers: {
                            crossDomain: true,
                            //"Content-Type": "application/json",
                            //"Authorization": this.jwt
                        },
                    }
                ).then(response => {});
                
                this.setWeapon({ card: "" });
                this.setClue({ card: "" });
            }
            // submit the hint cards once they are all selected (forens)
            else if (this.gameState.state === "Round1pre" && this.$store.state.username === this.gameState.forensicScientistPlayer) {
                axios.get(
                    "http://192.168.1.3:8076/events/submitHintCard/" + this.gameId + "/" + this.$store.state.username,
                    {                                                                               
                        headers: {
                            crossDomain: true,
                            //"Content-Type": "application/json",
                            //"Authorization": this.jwt
                        },
                    }
                ).then(response => {this.submitButtonExists = false;});
            }

            
        }
    },

    mounted: function () {
        if (localStorage.username) {
            this.setUsername({ username: localStorage.username})
        }

        if (this.gameId) {
            this.setGameId({ gameId: this.gameId});
        }

        this.getGameState();
        this.$nextTick(async function () {
            this.getGameState();
            this.counter = window.setInterval(() => {
                this.getGameState();
            },1000);
        })
    },

    watch: {
        selectedOwnMurderCard: {
            handler: function(newValue) {
                if (this.$store.state.selectedOwnCards.clue !== "" && this.$store.state.selectedOwnCards.weapon !== "") {
                    // make submit avail
                    this.submitButtonExists = true;
                }            
            },
            deep: true,
        },
        gameState: {
            handler: function(newValue) {
                if (this.$store.state.username === this.gameState.forensicScientistPlayer &&
                    this.gameState.selectedLocation !== -1 && this.gameState.selectedDeathMethod != -1
                    && this.gameState.state === "Round1pre") {
                    console.log("GOT HERE")
                    let count = 0;
                    for (let card of this.gameState.hintCardsInPlay) {
                        if (card.currentlySelectedOption !== -1) {
                            count = count + 1;
                        }
                    }
                    console.log(count)
                    if (count === 4) {
                        this.submitButtonExists = true;
                    }
                }
                
                // reveal players role to them
                if ((this.gameState.state !== "" || this.gameState.state !== "Pregame") && this.playerRole === "") {
                    axios.get(
                        "http://192.168.1.3:8076/revealRole/" + this.gameId + "/" + this.$store.state.username,
                        {                                                                               
                            headers: {
                                crossDomain: true,
                                //"Content-Type": "application/json",
                                //"Authorization": this.jwt
                            },
                        }
                    ).then(response => {this.playerRole = response.data});
                }
                // reveal the murderer to the forens
                if (this.gameState.state !== "PreGame" && this.$store.state.username === this.gameState.forensicScientistPlayer 
                    && !this.revealedToForens) {

                    axios.get(
                        "http://192.168.1.3:8076/revealMurderer/" + this.gameId + "/" + this.$store.state.username,
                        {                                                                               
                            headers: {
                                crossDomain: true,
                                //"Content-Type": "application/json",
                                //"Authorization": this.jwt
                            },
                        }
                    ).then(response => {this.murderer = response.data; this.revealedToForens = true;});
                } 
                // reveal end round button to the forens
                if (this.gameState.state === "Round1" && this.$store.state.username === this.gameState.forensicScientistPlayer) {
                    this.endRoundExists = true;
                } else {
                    this.endRoundExists = false;
                }
            },
            deep: true,
        },

        gameId: {
            handler: function(newValue) {
                localStorage.setItem('gameId', this.gameId);
                this.setGameId({ gameId: this.gameId});
            },
            deep: true
        }
    },
    computed: {
        selectedOwnMurderCard() {
            return this.$store.state.selectedOwnCards;
        }
    },

    beforeDestroy() {
        clearInterval(this.counter)
    },
})
</script>

<style lang="scss" scoped>
    $baseColor: rgba(0, 0, 0, .6);
    $murderer: rgba(200, 30, 30, .8);

    [v-cloak] {
        display: none;
    }
    #submit {
        float: right;
        margin: 5px;
    }
    #gameBar {
        height: 10vh;
        width: 100%;
        background-color: $baseColor;
        box-shadow: 1px 1px 5px 4px $baseColor;
        margin-bottom: 5px;
        text-align: left;
        display: flex;
    }
    .gameSpecs, .murderSpecs, .buttons {
        margin: auto;
    }
    .gameSpecs {
        width: 33%;
    }
    .murderSpecs {
        color: $murderer;
        width: 33%;
    }
    .buttons {
        width: 33%;
        float: right;
    }
</style>