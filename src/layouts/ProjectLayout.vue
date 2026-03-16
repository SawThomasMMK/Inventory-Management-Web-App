<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r">
      <div class="p-6 font-bold text-xl">Inventory</div>

      <nav class="px-4 space-y-2">
        <RouterLink to="/dashboard" class="block px-4 py-2 rounded hover:bg-gray-100">
          Dashboard
        </RouterLink>

        <RouterLink to="/products" class="block px-4 py-2 rounded hover:bg-gray-100">
          Products
        </RouterLink>

        <RouterLink to="/orders" class="block px-4 py-2 rounded hover:bg-gray-100">
          Orders
        </RouterLink>

        <RouterLink to="/customers" class="block px-4 py-2 rounded hover:bg-gray-100">
          Customers
        </RouterLink>

        <RouterLink to="/service-teams" class="block px-4 py-2 rounded hover:bg-gray-100">
          Service Teams
        </RouterLink>

        <RouterLink to="/employees" class="block px-4 py-2 rounded hover:bg-gray-100">
          Employees
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="h-16 bg-white border-b flex items-center justify-between px-6">
        <h1 class="text-lg font-semibold">Inventory Management</h1>

        <button class="text-sm text-red-600 hover:underline" @click="logout">Logout</button>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

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
