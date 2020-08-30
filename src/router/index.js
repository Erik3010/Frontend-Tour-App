import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/Home.vue';
import AdminPlace from '@/components/admin/AdminPlace.vue'
import AdminSchedule from '@/components/admin/AdminSchedule.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/admin',
    component: AdminPlace
  },
  {
    path: '/admin/schedule',
    component: AdminSchedule
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
