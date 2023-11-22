import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import Projects from '@/components/Projects.vue'
import StandardSelected from '@/components/StandardSelected'
import SubProjects from '@/components/SubProjects.vue'
import Requirements from '@/components/Requirements.vue'
import EquipmentLib from '@/components/Lib/EquipmentLib.vue'
import StandardLib from '@/components/Lib/StandardLib.vue'
import Employee from '@/components/Employee'

//要求页面
import MemberDetails from '@/components/RequirementsDetails/Members/MemberDetails'
import Members from '@/components/RequirementsDetails/Members/Members'

import EquipmentDetails from '@/components/RequirementsDetails/Equipment/EquipmentDetails'
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
  { path: '/projects', component: Projects, name: 'projects' },  
  { path: '/standard', component:StandardSelected, name: 'standard' },  
  { path: '/subprojects', component: SubProjects, name: 'subprojects' },  
  { path: '/requirements', component: Requirements, name: 'requirements' },  
  { path: '/equipmentlib', component: EquipmentLib, name: 'equipmentlib' },  
  { path: '/standardlib', component: StandardLib, name: 'standardlib' },  
  { path: '/employee', component: Employee,name:'Employee'},

  { path: '/members', component: Members, name: 'members' },  
  { path: '/memberdetails', component: MemberDetails, name: 'memberdetails' },  
  { path: '/equipment', component: Equipment, name: 'equipment' },  
  { path: '/equipmentdetails', component: EquipmentDetails, name: 'equipmentdetails' },  
  { path: '/comveridetails', component:ComVeriDetails, name: 'comveridetails' },  
  { path: '/facilitydetails', component:FacilityDetails, name: 'facilitydetails' },  
  { path: '/sampledetails', component:SampleDetails, name: 'sampledetails' },  
  { path: '/simexpdetails', component:SimExpDetails, name: 'simexpdetails' },  
  { path: '/sopdetails', component: SOPDetails, name: 'sopdetails' }
  
  

  
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


export default router;
