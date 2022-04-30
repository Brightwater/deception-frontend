<template>
    <div v-if="gameState" class="gridTemplate">
        <div id="player1">
            <player-card v-for="(card, index) in gameState.players[0].weaponCards" :key="index + 'p1w'"
                cardType="weapon"
                :card="card"
                :height="height"
                :width="width"
                :textHeight="textHeight"
                :state="gameState.state"
            />
            <br />
            <player-card v-for="(card, index) in gameState.players[0].clueCards" :key="index + 'p1c'"
                cardType="clue"
                :card="card"
                :height="height"
                :width="width"
                :textHeight="textHeight"
                :state="gameState.state"
            />
        </div>
        <div id="player2">
            <player-card v-for="(card, index) in gameState.players[1].weaponCards" :key="index + 'p2w'"
                cardType="weapon"
                :card="card"
                :height="height"
                :width="width"
                :textHeight="textHeight"
                :state="gameState.state"
            />
            <br />
            <player-card v-for="(card, index) in gameState.players[1].clueCards" :key="index + 'p2c'"
                cardType="clue"
                :card="card"
                :height="height"
                :width="width"
                :textHeight="textHeight"
                :state="gameState.state"
            />
        </div>
        <div id="forens" v-if="gameState.state !== 'Pregame'">
            <hint-card
                title="Cause of Death"
                :options="gameState.killMethods"
                :width="hintWidth"
                :height="hintHeight"
                :textHeight="hintTextHeight"
                cardType="death" 
                :forens="gameState.forensicScientistPlayer"
                :currentlySelected="gameState.selectedDeathMethod"
                :state="gameState.state"
            />
            <hint-card
                title="Location of Crime"
                :options="gameState.locations" 
                :width="hintWidth"
                :height="hintHeight"
                :textHeight="hintTextHeight"
                cardType="location"  
                :forens="gameState.forensicScientistPlayer"
                :currentlySelected="gameState.selectedLocation"
                :state="gameState.state"
            />
            <hint-card v-for="(card, index) in gameState.hintCardsInPlay" :key="index"
                :title="card.name"
                :options="card.options" 
                :width="hintWidth"
                :height="hintHeight"
                :textHeight="hintTextHeight"
                cardType="hint"
                :forens="gameState.forensicScientistPlayer"
                :currentlySelected="card.currentlySelectedOption"
                :state="gameState.state"
            />
        </div>
        <div id="player3">
            <player-card v-for="(card, index) in gameState.players[2].weaponCards" :key="index + 'p3w'"
                cardType="weapon"
                :card="card"
                :height="height"
                :width="width"
                :textHeight="textHeight"
                :state="gameState.state"
            />
            <br />
            <player-card v-for="(card, index) in gameState.players[2].clueCards" :key="index + 'p3c'"
                cardType="clue"
                :card="card"
                :height="height"
                :width="width"
                :textHeight="textHeight"
                :state="gameState.state"
            />
        </div>
        <div v-if="gameState.playerCount == 5" id="player4">
            <player-card v-for="(card, index) in gameState.players[3].weaponCards" :key="index + 'p4w'"
                cardType="weapon"
                :card="card"
                :height="height"
                :width="width"
                :textHeight="textHeight"
                :state="gameState.state"
            />
            <br />
            <player-card v-for="(card, index) in gameState.players[3].clueCards" :key="index + 'p4c'"
                cardType="clue"
                :card="card"
                :height="height"
                :width="width"
                :textHeight="textHeight"
                :state="gameState.state"
            />
        </div>
    </div>
</template>

<script>
import hintCard from '@/components/hint-card.vue'
import playerCard from '@/components/player-card.vue'

export default ({
    components: {
        hintCard,
        playerCard
    },

    props: {
        gameState: {required: true},
    },

    data: () => ({
        // player cards:
        height: "48%",
        width: 160,
        textHeight: "20%",
        // hint cards:
        hintHeight: "98%",
        hintWidth: 300,
        hintTextHeight: "20%"
    }),

    mounted() {
        //this.setUpRatio();
    },

    watch: {
        gameState() {
            this.setUpRatio();
        }
    },

    methods: {
        // Sets up the player cards and hint cards
        setUpRatio() {
            try {
                // Player cards:
                let cardHeight = document.getElementsByClassName("card")[0].clientHeight;
                this.width = .95*cardHeight*(2/3) + "px";
                this.textHeight = Math.floor((1/10)*cardHeight) + "px";

                // Hint cards:
                if (this.gameState.state !== "Pregame") {
                    let hintCardHeight = document.getElementById("forens").childNodes[0].clientHeight;
                    let forensWidth = document.getElementById("forens").clientWidth;
                    this.hintWidth = .95*forensWidth*(1/6);
                    this.hintTextHeight = Math.floor((1.5/10)*cardHeight) + "px";
                    if (this.hintWidth > hintCardHeight*.6) {
                        this.hintWidth = hintCardHeight*.6 + "px";
                    } else {
                        this.hintWidth = this.hintWidth + "px";
                    }
                }
            } catch (error) {
                console.log("gameboard5.vue: setUpRatio() error occured.");
            }
        }
    },
})
</script>

<style lang="scss" scoped>
    .gridTemplate {
        display: grid;
        width: 100%;
        height: 89vh;
        gap: .5%;
        grid-auto-columns: 1/6vw;
        grid-auto-rows: 33%;
    }
    .gridTemplate div {
        /*border: 1px solid black;*/
    }
    .gridTemplate #player1 {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 1;
    }
    .gridTemplate #player2 {
        grid-column-start: 4;
        grid-column-end: 6;
        grid-row-start: 1;
        grid-row-end: 1;
    }
    .gridTemplate #forens {
        grid-column-start: 1;
        grid-column-end: 6;
        grid-row-start: 2;
        grid-row-end: 2;
    }
    .gridTemplate #player3 {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 3;
        grid-row-end: 3;
    }
    .gridTemplate #player4 {
        grid-column-start: 4;
        grid-column-end: 6;
        grid-row-start: 3;
        grid-row-end: 3;
    }
</style>