import { createRouter, createWebHistory } from 'vue-router'
import ProjectLayout from '@/layouts/ProjectLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Products from '@/pages/Products.vue'
import Orders from '@/pages/Orders.vue'
import Customers from '@/pages/Customers.vue'
import Employees from '@/pages/Employees.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import ServiceTeams from '@/pages/ServiceTeams.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/',
      component: ProjectLayout,
      children: [
        {
          path: '',
          redirect: '/login',
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'products',
          name: 'Products',
          component: Products,
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
        },
        {
          path: 'customers',
          name: 'Customers',
          component: Customers,
        },
        {
          path: 'employees',
          name: 'Employees',
          component: Employees,
        },
        {
          path: 'service-teams',
          name: 'ServiceTeams',
          component: ServiceTeams,
        },
      ],
    },
  ],
})
