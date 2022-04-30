<template>
    <div class="card" :style="{'height':height, 'width':width}">
        <div :class="cardType" :style="{'height':height, 'width':width}">
            <div class="title" :style="{'font-size':textHeight}">
                {{title}}
            </div>
            <ul class="options">
                <li @click="selected(option)" 
                    v-bind:style="{ color: getCssColor + '!important'}"
                    v-for="(option, index) in options" 
                    class="option" 
                    :key="index"> {{option}} </li>
            </ul>
        </div>
    </div>
</template>

<script>
//import '../public/style.scss'

export default ({
    props: {
        title: {type: String, required: true},
        options: {type: Array[6]}, // hint cards
        cardType: {default: "hint"}, // death, location, hint
        width: {default: "210px"},
        height: {default: "450px"},
        textHeight: {default: "2.5vh"}
    },

    data: () => ({
        currentlySelected: "",
    }),

    methods: {
        selected(option) {
            console.log(option)
            this.currentlySelected = option;
        },
        getCssColor(option) {
            if (option === this.currentlySelected) {
                console.log("TEST")
                return "red"
            }
            else {
                return "blue"
            }
        }
    },
})
</script>

<style lang="scss" scoped>
    $borderRadius: 15px;
    $hintColor: rgb(55, 35, 20);
    $locationColor: rgb(5, 60, 5);
    $deathColor: rgb(55, 5, 60);
    /* START OF: All Cards */
    .card {
        display: inline-block;
        outline: 5px solid black;
        outline-offset: -5px;
        margin: 2px;
        border-radius: $borderRadius;
        color: seashell;
        font-family: imposs, Courier New, monospace;
    }
    .card .title {
        padding: 5px;
        height: 15%;
        display: inline-flex;
        opacity: .85;
    }
    .card .options {
        list-style-type: none;
        padding: 0;
        padding-left: 5px;
        margin: 0;
        text-align: center;
        display: block;
    }
    .card .option {
        padding: 10%;
        opacity: .8;
    }
    .card .option:hover {
        opacity: 1;
    }
    .card .option:hover:before {
        content: ">"
    }
    .card .option:hover:after {
        content: "<"
    }
    .hint, .location, .death {
        background-color: black;
        border-radius: $borderRadius;
    }
    .hint .title {
        text-shadow: 1px 1px 2px $hintColor;
        background-image: radial-gradient(ellipse, $hintColor 20%, black 75%);
    }
    .hint .option {
        background-image: radial-gradient(ellipse at top, $hintColor 30%, black 75%);
    }
    .location .title {
        text-shadow: 1px 1px 2px $locationColor;
        background-image: radial-gradient(ellipse, $locationColor 20%, black 75%);
    }
    .location .option {
        background-image: radial-gradient(ellipse at top, $locationColor 30%, black 75%);
    }
    .death .title {
        text-shadow: 1px 1px 2px $deathColor;
        background-image: radial-gradient(ellipse, $deathColor 20%, black 75%);
    }
    .death .option {
        background-image: radial-gradient(ellipse at top, $deathColor 30%, black 75%);
    }

    #red {
        color: red !important;
    }
    /*
    .card {
        display: inline-grid;
        border: 1px solid black;
        border-radius: 5px;
        padding: .25em;
        width: 160px;
        height: 240px;
        margin: 2px;
    }
    .card .title {
        height: 2em;
        font-weight: bold;
        font-size: large;
    }
    .card .options {
        list-style-type: none;
        padding: 0;
        margin: 0;
        text-align: left;
    }
    .card .options .option {
        padding: 4%;
    }
    */
    /* END OF: All Cards */
</style>
