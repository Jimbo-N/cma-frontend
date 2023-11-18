import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import Projects from '@/components/Projects.vue'
import SubProjects from '@/components/SubProjects.vue'
import Requirements from '@/components/Requirements.vue'
import EquipmentLib from '@/components/Lib/EquipmentLib.vue'
import StandardLib from '@/components/Lib/StandardLib.vue'





Vue.use(VueRouter);

const routes = [
  { path: '/', redirect:"/login" },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/projects', component: Projects },
  { path: '/subprojects', component: SubProjects },
  { path: '/requirements', component: Requirements},
  { path: '/equipmentlib', component: EquipmentLib},
  { path: '/standardlib', component: StandardLib},
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


export default router;
