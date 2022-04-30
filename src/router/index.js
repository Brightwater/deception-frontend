import Vue from 'vue'
import VueRouter from 'vue-router'
import test from '@/views/test'
import createGame from '@/views/create-game'
import lobby from '@/views/lobby'
import game from '@/views/game'
Vue.use(VueRouter)

const routes = [
  {
    path: '/test',
    name: 'test',
    component: test
  },
  {
    path: '/',
    name: 'createGame',
    component: createGame
  },
  {
    path: '/lobby/:gameId',
    name: 'lobby',
    component: lobby,
    props: true
  }
  ,
  {
    path: '/game/:gameId',
    name: 'game',
    component: game,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
