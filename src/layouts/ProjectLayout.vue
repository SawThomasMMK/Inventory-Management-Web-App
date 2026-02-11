<template>
    <div class="min-h-screen flex bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r">
        <div class="p-6 font-bold text-xl">
          Inventory
        </div>
  
        <nav class="px-4 space-y-2">
          <RouterLink
            to="/dashboard"
            class="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </RouterLink>
  
          <RouterLink
            to="/products"
            class="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Products
          </RouterLink>
  
          <RouterLink
            to="/orders"
            class="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Orders
          </RouterLink>
  
          <RouterLink
            to="/customers"
            class="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Customers
          </RouterLink>
        </nav>
      </aside>
  
      <!-- Main content -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 class="text-lg font-semibold">
            Inventory Management
          </h1>
  
          <button
            class="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>
  
        <!-- Page content -->
        <main class="flex-1 p-6">
          <RouterView />
        </main>
      </div>
    </div>
  </template>
  