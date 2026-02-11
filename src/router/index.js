import { createRouter, createWebHistory } from 'vue-router'
import ProjectLayout from '@/layouts/ProjectLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Products from '@/pages/Products/index.vue'
import Orders from '@/pages/Orders/index.vue'
import Customers from '@/pages/Customers/index.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ProjectLayout,
      children: [
        {
          path: '',
          redirect: '/dashboard',
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
      ],
    },
  ],
})
