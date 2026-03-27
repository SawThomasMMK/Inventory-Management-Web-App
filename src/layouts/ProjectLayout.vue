<template>
  <div class="flex-1 flex flex-col md:ml-64">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white border-r border-gray-300 transition-transform duration-300 ease-in-out',
        'fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ]"
    >
      <div class="py-6 px-4 font-bold text-xl">Inventory Manager</div>

      <nav class="px-2 space-y-2">
        <RouterLink
          to="/dashboard"
          class="flex items-center px-4 py-2 rounded transition"
          exact-active-class="bg-blue-100 text-blue-700"
          :class="{
            'hover:bg-gray-200': !$route.path.startsWith('/dashboard'),
          }"
        >
          <Squares2X2Icon class="h-5 w-5 mr-2 shrink-0" />
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/products"
          class="flex items-center px-4 py-2 rounded transition"
          exact-active-class="bg-blue-100 text-blue-700"
          :class="{
            'hover:bg-gray-200': !$route.path.startsWith('/products'),
          }"
        >
          <BriefcaseIcon class="h-5 w-5 mr-2 shrink-0" />
          <span>Products</span>
        </RouterLink>

        <RouterLink
          to="/orders"
          class="flex items-center px-4 py-2 rounded transition"
          exact-active-class="bg-blue-100 text-blue-700"
          :class="{
            'hover:bg-gray-200': !$route.path.startsWith('/orders'),
          }"
        >
          <ShoppingCartIcon class="h-5 w-5 mr-2 shrink-0" />
          <span>Orders</span>
        </RouterLink>

        <RouterLink
          to="/customers"
          class="flex items-center px-4 py-2 rounded transition"
          exact-active-class="bg-blue-100 text-blue-700"
          :class="{
            'hover:bg-gray-200': !$route.path.startsWith('/customers'),
          }"
        >
          <UserCircleIcon class="h-5 w-5 mr-2 shrink-0" />
          <span>Customers</span>
        </RouterLink>

        <RouterLink
          to="/employees"
          class="flex items-center px-4 py-2 rounded transition"
          exact-active-class="bg-blue-100 text-blue-700"
          :class="{
            'hover:bg-gray-200': !$route.path.startsWith('/employees'),
          }"
        >
          <UserIcon class="h-5 w-5 mr-2 shrink-0" />
          <span>Employees</span>
        </RouterLink>

        <RouterLink
          to="/service-teams"
          class="flex items-center px-4 py-2 rounded transition"
          exact-active-class="bg-blue-100 text-blue-700"
          :class="{
            'hover:bg-gray-200': !$route.path.startsWith('/service-teams'),
          }"
        >
          <UserGroupIcon class="h-5 w-5 mr-2 shrink-0" />
          <span>Service Teams</span>
        </RouterLink>

        <RouterLink
          to="/history"
          class="flex items-center px-4 py-2 rounded transition"
          exact-active-class="bg-blue-100 text-blue-700"
          :class="{
            'hover:bg-gray-200': !$route.path.startsWith('/history'),
          }"
        >
          <ClockIcon class="h-5 w-5 mr-2 shrink-0" />
          <span>History</span>
        </RouterLink>

        <div
          class="flex items-center px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
          @click="showLogoutModal = true"
        >
          <ArrowLeftStartOnRectangleIcon class="h-5 w-5 mr-2" />
          <span class="text-red-600">Logout</span>
        </div>
      </nav>
    </aside>
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white flex items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <!-- Hamburger -->
          <button class="md:hidden text-gray-700" @click="isSidebarOpen = !isSidebarOpen">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 class="md:hidden py-6 px-4 font-bold text-xl">Inventory Manager</h1>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 bg-gray-100 min-h-screen">
        <RouterView />
      </main>
      <ConfirmLogout v-model:isOpen="showLogoutModal" username="your account" @confirm="logout" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  ShoppingCartIcon,
  UserGroupIcon,
  UserCircleIcon,
  ClockIcon,
  BriefcaseIcon,
  Squares2X2Icon,
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import ConfirmLogout from '@/components/ConfirmLogout.vue'

const isSidebarOpen = ref(false)

const router = useRouter()
const showLogoutModal = ref(false)

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

const logout = async () => {
  const token = localStorage.getItem('token')

  // Best-effort API logout; ignore failures
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    } catch {
      // ignore network / API errors on logout
    }
  }

  localStorage.removeItem('token')
  router.push('/login')
}
</script>
