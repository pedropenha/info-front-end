import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/UserLogin.vue'
import CatalogoCursosView from '../views/CatalogoCursosView.vue'
import CursoDetalhesView from '../views/CursoDetalhesView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Login
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
        path: '/cursos', // Rota para o catálogo
        name: 'catalogoCursos',
        component: CatalogoCursosView
    },
    {
        path: '/cursos/:id',
        name: 'detalhesCurso',
        component: CursoDetalhesView,
        props: true 
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
