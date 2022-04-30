<!-- NOT IN USE. Card v1.00-->
<template>
    <div class="card" :style="{'height':height, 'width':width}" :title="title">
        <div :class="cardType" :style="{'height':height, 'width':width}" :title="title">
            <div class="title"> {{title}} </div>
            <div class="image"> 
                <img src="../assets/card/panties.png" alt="Card Image" />
            </div>
        </div>
    </div>
</template>

<script>

export default ({
    props: {
        cardType: {type: String, required: true}, 
        title: {type: String, required: true},
        image: {type: String},
        width: {default: "160px"},
        height: {default: "240px"}
    },

    data: () => ({
        
    }),

    methods: {
        // Enforces 2:3 ratio
        resizeCard() {
            let cardHeight = document.getElementsByClassName("card")[0].clientHeight;
            let cardWidth  = document.getElementsByClassName("card")[0].clientWidth;
            console.log(cardHeight + ":" + cardWidth);
        }
    },

    mounted() {
        this.resizeCard();
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
    }
    .card .title {
        padding: 5px;
        height: 20%;
        display: inline-flex;
        font-size: large;
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
        object-fit: cover;
        display: inherit; /* inline-flex if it disorts*/
    }
    .weapon, .clue {
        border-radius: $borderRadius;
        box-shadow: inset 0px 0px 120px 10px black;
    }
    .weapon {
        background-color: rgb(140, 55, 15);
    }
    .clue {
        background-color: rgb(100, 135, 170);
    }
</style>
