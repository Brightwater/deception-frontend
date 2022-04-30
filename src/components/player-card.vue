<template>
<!-- Change log..
1. changed pass in prop to just be card instead of all 3 (card.name, card.desc, card.url)
2. added gamestate prop this will be needed later so we can still have this card be clickable for sus votes
3. added prop for currently logged in user (added 2 props took away 2 should be fine)
4. added a second div (yes it copy pasted feel free to do your own thing if it still works)
the 1st div is used to select your murder cards and is only selectable during "Pregame"
the 2nd div will be selectable for the rest of the game by all players and will be used to
show the susvotes
 -->
    <div class="card" :id="card.name" :title="card.name" :style="{'height':height, 'width':width}">
        <!-- !!!!!! please give this some sort of outline when cardSelected is true -->
        <div :class="this.cardType" v-if="$store.state.username == this.card.belongsTo && state === 'Pregame'" v-on:click="selectOwnMurderCard()" :style="{'height':'100%', 'width':width}">
            <div class="title" :style="{'font-size':textHeight}">
                {{card.name}}
            </div>
            <div class="image">
                <img :src="realImage" alt="Card Image" /> 
            </div>
        </div>
        <!-- later check game state for this and allow adding susvotes -->
        <div :class="this.cardType" v-else :style="{'height':'100%', 'width':width}">
            <div class="title" :style="{'font-size':textHeight}">
                {{card.name}}
            </div>
            <div class="image">
                <img :src="realImage" alt="Card Image" /> 
            </div>
        </div>
    </div>
</template>

<script>
//import '../public/style.scss'
import { mapMutations } from 'vuex';

export default ({
    props: {
        cardType: {type: String, required: true}, // weapon, clue
        card: {required: true},
        width: {default: "160px"},
        height: {default: "240px"},
        textHeight: {default: "20%"},
        state: {type: String, default: ""}
    },

    data: () => ({
        //pp
        cardSelected: false
    }),

    methods: {
        selectOwnMurderCard() {
            //console.log(this.card.name);
            let active = document.getElementById(this.card.name);

            
            if (this.cardType === 'weapon') {
                if (this.$store.state.selectedOwnCards.weapon !== "") {
                    let priorCard = document.getElementById(this.$store.state.selectedOwnCards.weapon);
                    priorCard.style.outlineColor = "black";
                }
                active.style.outlineColor = "rgb(200, 50, 50)";
                return this.setWeapon({ card: this.card.name })
            }
            else if (this.cardType === 'clue') {
                if (this.$store.state.selectedOwnCards.clue !== "") {
                    let priorCard = document.getElementById(this.$store.state.selectedOwnCards.clue);
                    priorCard.style.outlineColor = "black";
                }
                active.style.outlineColor = "rgb(200, 50, 50)";
                return this.setClue({ card: this.card.name })
            }
        },
        ...mapMutations(["setWeapon", "setClue", 'setPriorClue', 'setPriorWeapon'])
    },
    computed: {
        realImage() {
            try {
                return require('../assets/card/' + this.card.imageUrl + '.png');
            } catch (error) {
                return require('../assets/card/' + 'panties' + '.png');
            }
            
        }
    }
})
</script>

<style lang="scss" scoped>
    $borderRadius: 15px;
/* START OF: All Cards */
    .card {
        display: inline-block;
        outline: 5px solid black;
        outline-offset: -5px;
        margin: 2px;
        border-radius: $borderRadius;
        color: seashell;
        font-family: imposs, Courier New, monospace;
        box-shadow: 2px 2px 15px 0px black;
    }
    .card .title {
        padding: 5px;
        height: 20%;
        display: inline-flex;
        text-shadow: 2px 2px 2px black;
        opacity: .85;
    }
    .card .image {
        display: block;
        height: 70%;
    }
    .card .image img {
        width: 100%;
        height: 100%;
        object-fit: scale-down; 
        display: inherit; /* inline-flex if it disorts*/
        border-bottom-left-radius: $borderRadius;
        border-bottom-right-radius: $borderRadius;
    }
    /* ENF OF: All Cards */
    .weapon, .clue {
        border-radius: $borderRadius;
        box-shadow: inset 0px 0px 80px 10px black;
    }
    .weapon {
        background-color: rgb(140, 55, 15);
    }
    .clue {
        background-color: rgb(100, 135, 170);
    }
    @media only screen and (max-width: 1200px) {
        .card {
            margin: .5px;
        }
        .weapon, .clue {
            box-shadow: inset 0px 0px 15px 5px black;
        }
        .weapon, .clue, .card {
            outline: 2px solid black;
            outline-offset: -2px;
            border-radius: 5px;
        }
        .card .title {
            padding: 0px;
        }
    }

</style>
