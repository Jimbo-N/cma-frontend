import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import Edit from '@/components/auth/Edit.vue'

import Projects from '@/components/Projects.vue'
import StandardSelected from '@/components/StandardSelected'
import Parameter from '@/components/Parameter.vue'
import Requirements from '@/components/Requirements.vue'
import EquipmentLib from '@/components/Lib/EquipmentLib.vue'
import StandardLib from '@/components/Lib/StandardLib.vue'
import PersonLib from '@/components/Lib/PersonLib.vue'
import Employee from '@/components/Employee'

//要求页面
import Members from '@/components/RequirementsDetails/Members/Members'

import Equipment from '@/components/RequirementsDetails/Equipment/Equipment'

import ComVeriDetails from '@/components/RequirementsDetails/ComVeriDetails'
import FacilityDetails from '@/components/RequirementsDetails/FacilityDetails'
import SampleDetails from '@/components/RequirementsDetails/SampleDetails'
import SimExpDetails from '@/components/RequirementsDetails/SimExpDetails'
import SOPDetails from '@/components/RequirementsDetails/SOPDetails'



Vue.use(VueRouter);

const routes = [
  { path: '/', redirect:"/login" },
  { path: '/login', component: Login, name: 'login' },  
  { path: '/register', component: Register, name: 'register' },  
  { path: '/edit', component: Edit, name:'edit'},

  { path: '/projects', component: Projects, name: 'projects' },  
  { path: '/standard', component:StandardSelected, name: 'standard' },  
  { path: '/parameter', component: Parameter, name: 'parameter' },  
  { path: '/requirements', component: Requirements, name: 'requirements' },  
  { path: '/equipmentlib', component: EquipmentLib, name: 'equipmentlib' },  
  { path: '/standardlib', component: StandardLib, name: 'standardlib' },  
  { path: '/personlib', component: PersonLib, name: 'personlib' },
  { path: '/employee', component: Employee,name:'Employee'},

  { path: '/members', component: Members, name: 'members' },  
  { path: '/equipment', component: Equipment, name: 'equipment' },  
  { path: '/comveridetails', component:ComVeriDetails, name: 'comveridetails' },  
  { path: '/facilitydetails', component:FacilityDetails, name: 'facilitydetails' },  
  { path: '/sampledetails', component:SampleDetails, name: 'sampledetails' },  
  { path: '/simexpdetails', component:SimExpDetails, name: 'simexpdetails' },  
  { path: '/sopdetails', component: SOPDetails, name: 'sopdetails' }

  
  

  
];

let routerPush = VueRouter.prototype.push;
let routerReplace = VueRouter.prototype.replace;
// push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


export default router;
