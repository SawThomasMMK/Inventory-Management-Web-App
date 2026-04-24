<template>
  <div>
    <!-- Page Header -->
    <div class="pb-6">
      <h2 class="text-2xl font-bold">Order History</h2>
      <p class="text-gray-500 text-sm py-1">Complete history of orders and service assignments</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow border border-gray-200 p-4">
        <p class="text-sm text-gray-500">Total Orders</p>
        <h2 class="text-2xl font-bold mt-2">{{ history.length }}</h2>
      </div>

      <div class="bg-white rounded-lg shadow border border-gray-200 p-4">
        <p class="text-sm text-gray-500">With Setup Service</p>
        <h2 class="text-2xl font-bold mt-2">
          {{ history.filter((h) => h.personnel !== 'N/A').length }}
        </h2>
      </div>

      <div class="bg-white rounded-lg shadow border border-gray-200 p-4">
        <p class="text-sm text-gray-500">Completed Orders</p>
        <h2 class="text-2xl font-bold mt-2">
          {{ history.filter((h) => h.status === 'completed').length }}
        </h2>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="pt-6">
        <!-- Search + Filter -->
        <div class="flex items-center justify-between mb-4 mx-6 gap-4">
          <Input
            v-model="search"
            placeholder="Search by customer, order ID, or personnel..."
            type="text"
            class="w-full max-w-80"
          />

          <select v-model="statusFilter" class="border border-gray-300 p-2 rounded-md w-48 text-sm">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">In Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Table -->
        <Table :headers="tableHeaders" :data="filteredHistory" :loading="loading">
          <!-- Status -->
          <template #cell-status="{ value }">
            <span
              class="px-2 py-1 text-xs rounded-full font-medium"
              :class="{
                'bg-green-100 text-green-700': value === 'completed',
                'bg-yellow-100 text-yellow-700': value === 'processing',
                'bg-red-100 text-red-700': value === 'cancelled',
              }"
            >
              {{ value }}
            </span>
          </template>

          <!-- Amount -->
          <template #cell-amount="{ value }"> ${{ Number(value).toFixed(2) }} </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Input from '../components/Input.vue'
import Table from '../components/Table.vue'

// API
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

const history = ref([])
const loading = ref(false)
const search = ref('')
const statusFilter = ref('all')

// Table Headers
const tableHeaders = [
  { key: 'order_number', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'address', label: 'Address' },
  { key: 'product', label: 'Products' },
  { key: 'personnel', label: 'Setup Personnel' },
  { key: 'service_date', label: 'Order Date' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
]

// Load History
const loadHistory = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/history`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()

    history.value = data.data.map((item) => ({
      id: item.order_id,
      order_number: item.order_number,
      customer: item.customer_name,
      address: item.address,
      product: item.product,
      personnel: item.handled_by_employee
        ? `${item.handled_by_employee.first_name} ${item.handled_by_employee.last_name}`
        : 'N/A',
      service_date: item.service_date,
      status: item.status,
      amount: item.amount,
    }))
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Filter
const filteredHistory = computed(() => {
  return history.value.filter((item) => {
    const matchSearch =
      item.customer.toLowerCase().includes(search.value.toLowerCase()) ||
      item.order_number.toLowerCase().includes(search.value.toLowerCase()) ||
      item.personnel.toLowerCase().includes(search.value.toLowerCase())

    const matchStatus = statusFilter.value === 'all' || item.status === statusFilter.value

    return matchSearch && matchStatus
  })
})

onMounted(loadHistory)
</script>
