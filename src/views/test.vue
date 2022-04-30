<template>
<div>
    <card 
        cardType="weapon"
        title="Can of Beans"
        image="broken.png" />
    <card 
        cardType="clue"
        title="Panties"
        image="broken.png" />

    <player-card 
        cardType="clue"
        :card="card" />
    
    <hint-card
        title="Victim's Lunch"
        :options="options"
        width="210px"
        height="450px" />

    <hint-card
        title="Location"
        :options="locations"
        width="210px"
        height="450px"
        cardType="location" />

    <hint-card2
        title="Death"
        :options="deaths"
        width="210px"
        height="450px"
        cardType="death" />


</div>
</template>

<script>
import card from '@/components/card.vue'
import playerCard from '@/components/player-card.vue'
import hintCard from '@/components/hint-card.vue'
import hintCard2 from '@/components/hint-card2.vue'

export default {
    components: {
        card,
        playerCard,
        hintCard,
        hintCard2
    },

    data: () => ({
        options: [
            "Fruit Parfait",
            "Spaghett",
            "PopTarts",
            "Cheetos",
            "Taco Bell",
            "Nothing"
        ],
        locations: [
            "Taco Bell",
            "Motel",
            "Playground",
            "Eiffel Tower",
            "Basement",
            "Home"
        ],
        deaths: [
            "Suffocation",
            "Severe Injury",
            "Loss of Blood",
            "Illness/Disease",
            "Poisoning",
            "Accident/Arson"
        ],
        card: {
            id: 74,
            tags: null,
            description: null,
            imageUrl: null,
            killMethod: "Loss of Blood",
            name: "Scissors",
            susVotes: [],
            belongsTo: "admin"
        }
    })
}
</script>

