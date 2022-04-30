<template>
    <div id="formContainer">
        <form @submit.prevent="createGame()">
                <label for="username"> Choose your username </label>
                    <input v-model="formData.username" name="username" id="username" type="text" required />
                <label for="cardNumber"> How many clue/weapon cards per player? </label>
                    <input v-model="formData.cardNumber" name="cardNumber" id="cardNumber" type="number" min="4" max="9" placeholder="4 - 9" required />

            <input type="submit" id="submit" value="Create Game" class="submit" />
        </form>
        <hr />
        <form @submit.prevent="joinGame()">
            <label for="username"> Choose your username </label>
                <input v-model="formData.username" name="username" id="username" type="text" required />
            <label for="gameId"> Game ID </label>
                <input v-model="gameId" name="gameId" id="gameId" type="text" required />
            
            <input type="submit" id="submit" value="Join Game" class="submit" />
        </form>
    </div>
</template>

<script>
import axios from "axios"
import { mapMutations } from 'vuex';

export default {
    data: () => ({
        // createGame() :
        formData: {
            username: "",
            cardNumber: null
        },
        gameState: null,
        // joinGame() :
        gameId: "",
        gameId2: ""
    }),
    mounted() {
        if (localStorage.username) {
            this.formData.username = localStorage.getItem('username');
            this.setUsername({ username: this.formData.username})
        }
    },
    methods: {
        createGame() {
            if (this.formData.cardNumber >= 4 && this.formData.cardNumber <= 9 && this.formData.username.length > 0) {
                axios.post(
                    "http://192.168.1.3:8076/events/setupGame",
                    this.formData,
                    {
                        headers: {
                            crossDomain: true,
                            "Content-Type": "application/json",
                            //"Authorization": this.jwt
                        },
                    }
                ).then(response => {this.gameId2 = response.data.gameId});
            }
        },
        ...mapMutations(["setUsername"]),
        // Unavailable atm
        async joinGame() {
            if (this.formData.username.length > 0 || this.gameId.length > 0) {
                // const res = await this.$http.get(
                //     "http://192.168.1.3:8076/events/joinGame/" + this.gameId + "/" + this.formData.username, {
                //         headers: {
                //         //"Authorization": this.jwt,
                //         },
                //     }
                // );
                axios.get(
                     "http://192.168.1.3:8076/events/joinGame/" + this.gameId + "/" + this.formData.username,
                    {
                        headers: {
                            crossDomain: true,
                            //"Content-Type": "application/json",
                            //"Authorization": this.jwt
                        },
                    }
                ).then(response => {});
                this.$router.push({name: 'lobby', params: {gameId: this.gameId, username: this.formData.username}});
            }
        }
    },

    watch: {
        gameId2() {
            this.$router.push({name: 'lobby', params: {gameId: this.gameId2, username: this.formData.username}});
        },
        formData: {
            handler: function(newValue) {
                localStorage.setItem('username', this.formData.username);
                this.setUsername({ username: this.formData.username})
            },
            deep: true
            
        }
        
    }
}
</script>

<style lang="scss" scoped>
    $baseColor: rgba(0,0,0,.6);
    $inputBaseColor: rgba(75, 75, 50, .5);
    $textColor: rgba(255, 238, 190, 0.9);
    $buttonColor: rgba(255, 255, 190, .75);
    $hrColor: rgba(49, 49, 49, 0.6);

    hr {
        border: 1.5px solid $hrColor;
        background-color: $hrColor;
        margin-top: 1em;
        margin-bottom: 2em;
    }
    #formContainer {
        width: 30vw;
        height: 33vh;
        margin-top: 20vh;
        border-radius: 4px;
        display: inline-block;
        padding: 1em;
        background-color: $baseColor;
        box-shadow: 1px 2px 2px 2px black;
    }
    form {
        width: 60%;
        display: inline-block;
    }
    form label {
        text-align: left;
    }
    form input {
        background-color: $inputBaseColor;
        border: none;
        color: $textColor;
        width: 100%;
        margin-bottom: 12px;
        box-sizing: content-box;
        padding: 4px;
    }
    form input:focus {
        outline: 1px dotted $textColor !important;
    }
    form input#submit {
        border-radius: 2px;
        border: none;
        width: 100%;
        padding: 4px;
        background-color: $buttonColor;
        color: black;
        box-shadow: none;
        justify-content: center;
    }
    label, input {
        display: flex;
        margin: auto;
    }
    label::after, input::after, button::after {
        content: "\a";
        white-space: pre;
    }
    @media only screen and (max-width: 1200px) {
        hr {
            margin: 0;
        }
        #formContainer {
            font-size: 3vh;
            padding: 4px;
            margin: 0;
            margin-top: 5vh;
            display: inline-block;
            height: max-content;
            width: max-content;
        }
        form input {
            padding: 0;
        }
        form input#submit {
            padding: 0;
        }
    }
</style>