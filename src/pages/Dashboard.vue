<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Dashboard</h2>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm text-gray-500 mb-2">Total Sales</h3>
        <p class="text-3xl font-bold">${{ stats.total_sales }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm text-gray-500 mb-2">Total Orders</h3>
        <p class="text-3xl font-bold">{{ stats.total_orders }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm text-gray-500 mb-2">Total Customers</h3>
        <p class="text-3xl font-bold">{{ stats.total_customers }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm text-gray-500 mb-2">Total Products</h3>
        <p class="text-3xl font-bold">{{ stats.total_products }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Sales Over Time -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Sales Over Time</h3>
        <Line :data="salesChartData" :options="chartOptions" />
      </div>

      <!-- Top Products -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Top Products</h3>
        <Bar :data="productsChartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>

      <div v-if="stats.recent_activity.length === 0" class="text-gray-500">No recent activity.</div>

      <div
        v-for="activity in stats.recent_activity"
        :key="activity.order_number"
        class="border-b py-3"
      >
        <p class="font-medium">{{ activity.customer_name }}</p>
        <p class="text-sm text-gray-500">
          {{ activity.order_number }} • {{ activity.service_date }}
        </p>
        <p class="text-sm text-gray-600">{{ activity.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
)

const stats = ref({
  total_sales: 0,
  total_orders: 0,
  total_customers: 0,
  total_products: 0,
  sales_over_time: [],
  top_products: [],
  recent_activity: [],
})

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

const loadDashboard = async () => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  const data = await res.json()

  stats.value = data
}

/* Sales Chart */

const salesChartData = computed(() => ({
  labels: stats.value.sales_over_time.map((s) =>
    new Date(s.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
  ),
  datasets: [
    {
      label: 'Sales',
      data: stats.value.sales_over_time.map((s) => s.total_sales),
      borderColor: '#6366F1',
      backgroundColor: '#6366F1',
      tension: 0.4,
    },
  ],
}))

/* Top Products Chart */

const productsChartData = computed(() => ({
  labels: stats.value.top_products.map((p) => p.name),
  datasets: [
    {
      label: 'Revenue',
      data: stats.value.top_products.map((p) => p.total_revenue),
      backgroundColor: '#8B5CF6',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
canvas {
  height: 300px !important;
}
</style>
