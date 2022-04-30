<!-- 
    navigation(JSON)

    JSON = [
        {
            title: "Home",
            link: "/Home"
        },
        {
            title: "About"
        }
    ]
-->

<template>
    <div id="navigation">
        <nav>
            <!--<router-link :to="" :v-for=""> {{}} </router-link> -->
        </nav>
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'navigation',
        props: {
            navJSON: Array
        },

        methods: {
            convertJSON(navJSON) {
                console.log("-----------------------BEAN")
            }
        }
    }

</script>

<style scoped>
    
</style>