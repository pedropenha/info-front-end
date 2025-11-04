import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/UserLogin.vue'
import Cadastro from '../views/UserCadastro.vue'
import Perfil from '../views/UserPerfil.vue'
import CatalogoCursosView from '../views/CatalogoCursosView.vue'
import CursoDetalhesView from '../views/CursoDetalhesView.vue';
import AdminCadastrarUsuario from '../views/AdminCadastrarUsuario.vue'
import AdminCadastrarCurso from '../views/AdminCadastrarCurso.vue'
import AdminListarUsuarios from '../views/AdminListarUsuarios.vue'
import AdminListarCursos from '../views/AdminListarCursos.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: Perfil
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
  },
  // Rotas Admin
  {
    path: '/admin/usuarios/novo',
    name: 'adminCadastrarUsuario',
    component: AdminCadastrarUsuario,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/usuarios',
    name: 'adminListarUsuarios',
    component: AdminListarUsuarios,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/cursos/novo',
    name: 'adminCadastrarCurso',
    component: AdminCadastrarCurso,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/cursos',
    name: 'adminListarCursos',
    component: AdminListarCursos,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Guard de navegação para rotas admin
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    const user = localStorage.getItem('user');
    if (!user) {
      next('/');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (userData.nivel !== 'admin') {
        next('/cursos');
        return;
      }
    } catch (error) {
      next('/');
      return;
    }
  }
  next();
})

export default router
