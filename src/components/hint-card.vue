<template>
    <div class="card" :style="{'height':height, 'width':width}" :id="title">
        <!-- FORENS CARD: -->
        <div v-if="$store.state.username === forens && state === 'Round1pre'" class="flipContainer" id="forensView">
            <!-- Front of card: -->
            <div :class="cardType" id="front" :style="{'height':'100%', 'width':width}">
                <div class="title" :style="{'font-size':textHeight}">
                    {{title}}
                </div>
                <ul class="options" :style="{'font-size':optionTextHeight}">
                    <li @click="selected(title, index)" 
                        v-for="(option, index) in options" 
                        class="option" 
                        :id="title + '' + index" 
                        :key="index"> {{option}} </li>
                </ul>
            </div>
            <!-- Back of card: -->
            <div :class="cardType" id="back" :style="{'height':'100%', 'width':width}" @click="flipCard($event.target)">
                <div :style="{'height':'100%', 'width':width, 'display':'block'}">
                </div>
            </div>
        </div>
        <!-- PLAYER CARD: -->
        <div v-else class="flipContainer">
            <!-- Front of card: -->
            <div :class="cardType" id="front" :style="{'height':'100%', 'width':width}">
                <div class="title" :style="{'font-size':textHeight}">
                    {{title}}
                </div>
                <ul class="options" :style="{'font-size':optionTextHeight}">
                    <li v-for="(option, index) in options" 
                        class="option" 
                        :id="title + '' + index" 
                        :key="index"> {{option}} </li>
                </ul>
            </div>
            <!-- Back of card: -->
            <div :class="cardType" id="back" :style="{'height':'100%', 'width':width}">
                <div :style="{'height':'100%', 'width':width, 'display':'block'}">
                
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import '../public/style.scss'
import axios from 'axios';

export default ({
    props: {
        title: {type: String, required: true},
        options: {type: Array[6]}, // hint cards
        cardType: {default: "hint"}, // death, location, hint
        width: {default: "210px"},
        height: {default: "450px"},
        textHeight: {default: "2vh"},
        forens: {default: ""},
        //flipped: {default: false}, // [REMOVE LATER] if currentlySelected != null, it is flipped 
        currentlySelected: {default: -1},
        state: {}
    },

    data: () => ({
        //currentlySelected: "",
        finallySelected: "",
        optionTextHeight: {default: "1vh"},
        flipped: {default: false}
    }),

    methods: {
        // Updates selected option [client side]
        selected(title, index) {
            try {
                // Gets active card:
                let id = title + "" + index;
                let selectedOption = document.getElementById(id);
                let optionCount = selectedOption.parentElement.childElementCount;
                this.currentlySelected = selectedOption;
                
                // Adjusts CSS: 
                for (let i = 0; i < optionCount; i++) {
                    let option = document.getElementById(title + "" + i);
                    if (selectedOption == option) {
                        option.style.opacity = 1;
                    } else {
                        option.style.opacity = .5;
                    }
                }

                // Sends cardType, title, option index
                axios.get(
                    "http://192.168.1.3:8076/events/selectHintCard/" + this.$store.state.gameId + "/" + this.$store.state.username + "/" + this.cardType + "/" + this.title + "/" + index,
                    {                                                                               
                        headers: {
                            crossDomain: true,
                            //"Content-Type": "application/json",
                            //"Authorization": this.jwt
                        },
                    }
                ).then(response => {});
            } catch (error) {
                console.error("COMPONENT: hint-card.vue selected() error occured:" + error);
            }
            
        },

        // Flips card & loads options
        flipCard(cardId) {
            // Gets the card that sent the event's .flipContainer\
            try {
                let card;
                try {
                    if (cardId.className !== 'flipContainer') { // click handler:
                        card = cardId.parentElement.parentElement;
                    } 
                } catch (error) { // user rejoined:
                    card = document.getElementById(cardId).childNodes[0];
                }

                // Flips the card
                card.style.transform = "rotateY(180deg)";

                // Removes back
                if (card.childNodes[1]) {
                    setTimeout(() => { card.childNodes[1].remove(); }, 800);
                }
            } catch (error) {
                console.log("COMPONENT: hint-card.vue: flipCard() error occured.")
            }
            
        }
    },

    watch: {
        // Adjusts text height in accordance to client's window
        textHeight: {
            handler: function(newValue) {
                let textHeightInt = this.textHeight.slice(0, -2);
                this.optionTextHeight = Math.floor(textHeightInt*.8) + "px";
            },
            deep: true
        },

        // Updates selected option
        currentlySelected: {
            handler: function(newValue) {
                try {
                    // Gets active card:
                    let id = this.title + "" + this.currentlySelected;
                    let selectedOption = document.getElementById(id);
                    let optionCount = selectedOption.parentElement.childElementCount;
                    
                    // Adjusts CSS: 
                    for (let i = 0; i < optionCount; i++) {
                        let option = document.getElementById(this.title + "" + i);
                        if (selectedOption == option) {
                            option.style.opacity = 1;
                        } else {
                            option.style.opacity = .5;
                        }
                    }

                    // Flips Card [remain last]
                    this.flipped = (this.currentlySelected !== -1) ? true : false;
                    if (this.flipped === true) {
                        this.flipCard(this.title);
                    }
                } catch (error) {
                    console.log("COMPONENTS: watcher: currentlySelected: error occured. Error: " + error);
                }
            },
            deep: true
        }
    },

    mounted() {
        // Flips card if option is selected:
        this.flipped = (this.currentlySelected !== -1) ? true : false;
        if (this.flipped === true) {
            this.flipCard(this.title);
        }

        // Shows selected option
        try {
            // Gets active card:
            let id = this.title + "" + this.currentlySelected;
            let selectedOption = document.getElementById(id);
            let optionCount = selectedOption.parentElement.childElementCount;
            
            // Adjusts CSS: 
            for (let i = 0; i < optionCount; i++) {
                let option = document.getElementById(this.title + "" + i);
                if (selectedOption == option) {
                    option.style.opacity = 1;
                } else {
                    option.style.opacity = .5;
                }
            }
        } catch (error) {
            console.log("COMPONENTS: mounted: currentlySelected: error occured. Error: " + error);
        }
    }
})
</script>

<style lang="scss" scoped>
    $borderRadius: 15px;
    $hintColor: rgb(55, 35, 20);
    $locationColor: rgb(5, 60, 5);
    $deathColor: rgb(55, 5, 60);
    $cardBase: black;
    /* START OF: All Cards */
    .card {
        display: inline-block;
        margin: 2px;
        color: seashell;
        font-family: imposs, Courier New, monospace;
    }
    .flipContainer {
        outline: 5px solid $cardBase;
        outline-offset: -5px;
        border-radius: $borderRadius;
    }
    .title {
        padding: 5px;
        height: 15%;
        border-radius: $borderRadius;
        display: inline-flex;
        opacity: .85;
    }
    .options {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: center;
    }
    .option {
        padding: 6%;
        opacity: .8;
    }
    .option:last-child {
        border-bottom-left-radius: $borderRadius;
        border-bottom-right-radius: $borderRadius;
    }
    #forensView #front .option:hover {
        opacity: 1;
    }
    /* END OF: All Cards */
    /* START OF: Flip Physics */
    .flipContainer {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s;
        transform-style: preserve-3d;
    }
    /*.card:hover .flipContainer {
        transform: rotateY(180deg);
    }*/
    .card #front, .card #back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
    }
    .card #front {
        transform: rotateY(180deg);
    }
    .card #back {
        background-color: $cardBase;
        border-radius: $borderRadius;
        color: $cardBase;
    }
    #back .title, #back .option {
        opacity: 0;
    }
    #back.location {
        box-shadow: inset 0px 0px 80px 10px $locationColor;
    }
    #back.death {
        box-shadow: inset 0px 0px 80px 10px $deathColor;
    }
    #back.hint {
        box-shadow: inset 0px 0px 80px 10px $hintColor;
    }
    /* END OF: Flip Physics */
    /* START OF: Card Back */
    .cardBack {
        background-color: $cardBase;
        border-radius: $borderRadius;
        color: $cardBase;
    }
    .cardBack .title, .cardBack .option {
        opacity: 0;
    }
    .cardBack #location {
        box-shadow: inset 0px 0px 80px 10px $locationColor;
    }
    .cardBack #death {
        box-shadow: inset 0px 0px 80px 10px $deathColor;
    }
    .cardBack #hint {
        box-shadow: inset 0px 0px 80px 10px $hintColor;
    }
    /* END OF: Card back */
    /* START OF: Card Coloring */
    .hint, .location, .death {
        background-color: $cardBase;
        border-radius: $borderRadius;
    }
    .hint .title {
        text-shadow: 1px 1px 2px $hintColor;
        background-image: radial-gradient(ellipse, $hintColor 20%, $cardBase 75%);
    }
    .hint .option {
        background-image: radial-gradient(ellipse at top, $hintColor 30%, $cardBase 75%);
    }
    .location .title {
        text-shadow: 1px 1px 2px $locationColor;
        background-image: radial-gradient(ellipse, $locationColor 20%, $cardBase 75%);
    }
    .location .option {
        background-image: radial-gradient(ellipse at top, $locationColor 30%, $cardBase 75%);
    }
    .death .title {
        text-shadow: 1px 1px 2px $deathColor;
        background-image: radial-gradient(ellipse, $deathColor 20%, $cardBase 75%);
    }
    .death .option {
        background-image: radial-gradient(ellipse at top, $deathColor 30%, $cardBase 75%);
    }
    /* END OF: Card Coloring */
</style>
