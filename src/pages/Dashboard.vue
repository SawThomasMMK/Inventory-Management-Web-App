<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">
      Dashboard
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Total Products</h3>
        <p class="text-3xl font-bold text-gray-900">0</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Total Orders</h3>
        <p class="text-3xl font-bold text-gray-900">0</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Total Customers</h3>
        <p class="text-3xl font-bold text-gray-900">0</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Low Stock Items</h3>
        <p class="text-3xl font-bold text-red-600">0</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
      <p class="text-gray-600">
        No recent activity to display.
      </p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
