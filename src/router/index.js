import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/Blogs.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue')
    },
    {
      path: '/registrarte',
      name: 'registrarte',
      component: () => import('../components/Registrarse.vue')
    },
    ,
    {
      path: '/blogs',
      name: 'blogs',
      component: () => import('../components/Blogs.vue')
    },
    {
      path: '/:pathMatch(.*)*', // Ruta "catch-all" para URLs no definidas
      component: () => import('../components/Login.vue'), // Componente para "No encontrado"
    },
  ]
})

export default router
