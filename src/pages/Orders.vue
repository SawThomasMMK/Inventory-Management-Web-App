<template>
  <div>
    <!-- Page Header -->
    <div class="pb-6">
      <h2 class="text-2xl font-bold">Orders</h2>
      <p class="text-gray-500 text-sm py-1">Manage customer orders</p>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="pt-6">
        <!-- Search + Add -->
        <div class="flex items-center justify-between mb-4 mx-6 gap-4">
          <Input
            v-model="searchQuery"
            placeholder="Search orders..."
            type="text"
            class="w-full max-w-80"
          />

          <Button
            @click="handleAddOrder"
            variant="primary"
            class="w-auto flex items-center whitespace-nowrap"
          >
            <PlusIcon class="w-5 h-5 mr-2" />Add Order
          </Button>
        </div>

        <!-- Table -->
        <Table :headers="tableHeaders" :data="filteredOrders" :loading="loading">
          <!-- Status -->
          <template #cell-status="{ value }">
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-700': value === 'processing',
                'bg-green-100 text-green-700': value === 'completed',
                'bg-red-100 text-red-700': value === 'cancelled',
              }"
            >
              {{ value }}
            </span>
          </template>

          <!-- Total -->
          <template #cell-total_amount="{ value }"> ${{ Number(value).toFixed(2) }} </template>

          <!-- Products -->
          <template #cell-products="{ value }">
            <div class="flex flex-col text-sm">
              <span v-for="(item, index) in value" :key="index">
                {{ item }}
              </span>
            </div>
          </template>

          <!-- Service Team Status -->
          <template #cell-service_status="{ value }">
            <span
              v-if="value"
              class="px-2 py-1 text-xs rounded-full"
              :class="{
                'bg-gray-100 text-gray-700': value === 'not_required',
                'bg-yellow-100 text-yellow-700': value === 'pending',
                'bg-blue-100 text-blue-700': value === 'assigned',
                'bg-purple-100 text-purple-700': value === 'on_field',
                'bg-green-100 text-green-700': value === 'completed',
              }"
            >
              {{ value.replace('_', ' ') }}
            </span>

            <span v-else class="text-gray-400 text-sm">N/A</span>
          </template>

          <!-- Service Team -->
          <template #cell-service_team="{ value }">
            {{ value || 'N/A' }}
          </template>

          <!-- Actions -->
          <template #cell-actions>
            <div class="flex items-center gap-3">
              <button class="text-blue-600 hover:text-blue-800">
                <PencilSquareIcon class="w-5 h-5 cursor-pointer" />
              </button>

              <button class="text-red-600 hover:text-red-800">
                <TrashIcon class="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-model:isOpen="showModal" title="Add Order">
      <div class="space-y-4">
        <!-- Row 1 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Input label="Order ID" v-model="form.order_number" />
            <p v-if="errors.order_number" class="text-red-500 text-sm mt-1">
              {{ errors.order_number }}
            </p>
          </div>
          <div>
            <Input type="date" label="Order Date" v-model="form.order_date" />
            <p v-if="errors.order_date" class="text-red-500 text-sm mt-1">
              {{ errors.order_date }}
            </p>
          </div>
        </div>

        <!-- Customer -->
        <div>
          <label class="text-sm font-medium">Customer Name</label>
          <select v-model="form.customer_id" class="border p-2 rounded w-full mt-1">
            <option :value="null" disabled>Select Customer</option>
            <option v-for="c in customers" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>

          <p v-if="errors.customer_id" class="text-red-500 text-sm mt-1">
            {{ errors.customer_id }}
          </p>
        </div>

        <!-- Products -->
        <Input label="Products" placeholder="Product 1, Product 2" disabled />

        <!-- Row 2 -->
        <div class="grid grid-cols-2 gap-4">
          <Input label="Total ($)" :modelValue="0" disabled />

          <select v-model="form.status" class="border p-2 rounded w-full mt-6">
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Divider -->
        <hr />

        <!-- Service Required -->
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="form.service_required" />
          <span>Service team required</span>
        </div>

        <!-- Service Status -->
        <div v-if="form.service_required">
          <label class="text-sm font-medium">Service Status</label>
          <select v-model="form.service_status" class="border p-2 rounded w-full mt-1">
            <option value="not_required">Not Required</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="on_field">On Field</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 w-full">
          <Button class="w-[80%]" variant="primary" @click="saveOrder"> Save Order </Button>
          <Button class="w-[20%]" variant="secondary" @click="showModal = false"> Cancel </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'

import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { PlusIcon } from '@heroicons/vue/24/solid'
import { watch } from 'vue'

// State
const searchQuery = ref('')
const loading = ref(false)

const orders = ref([])
const customers = ref([])

const showModal = ref(false)
const errors = ref({})

// Form
const form = ref({
  order_number: '',
  customer_id: null,
  status: 'processing',
  order_date: '',
  order_by: '',
  notes: '',
  service_required: false,
  service_status: null,
})

// API
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

// Filter
const filteredOrders = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return orders.value

  return orders.value.filter((order) => {
    const combined = `
      ${order.customer_name}
      ${order.status}
      ${order.order_date}
    `.toLowerCase()

    return combined.includes(q)
  })
})

// Load Orders
const loadOrders = async () => {
  loading.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('API ERROR:', text)
      return
    }

    const data = await response.json()

    orders.value = data.data.map((order) => ({
      id: order.id,
      customer_name: order.customer?.name || 'N/A',
      order_date: formatDate(order.order_date),
      total_amount: order.total_amount,
      status: order.status,
      service_status: order.service_status,
      products: order.items?.map((item) => item.product?.name) || [],
      service_team: order.service_team?.name || 'N/A',
    }))
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Load Customers
const loadCustomers = async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_BASE_URL}/customers`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    customers.value = data.data
  } catch (err) {
    console.error(err)
  }
}

// Format Date
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'

  const date = new Date(dateStr)

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Add Order
const handleAddOrder = () => {
  form.value = {
    order_number: '',
    customer_id: '',
    status: 'processing',
    order_date: '',
    order_by: '',
    notes: '',

    service_required: false,
    service_status: null,
  }

  showModal.value = true
  errors.value = {}
}

// Order Form Validation
const validateForm = () => {
  const newErrors = {}

  if (!form.value.order_number) {
    newErrors.order_number = 'Order ID is required'
  }

  if (!form.value.customer_id) {
    newErrors.customer_id = 'Customer is required'
  }

  if (!form.value.order_date) {
    newErrors.order_date = 'Order date is required'
  }

  errors.value = newErrors

  return Object.keys(newErrors).length === 0
}

// Save Order
const saveOrder = async () => {
  if (!validateForm()) return
  try {
    const token = localStorage.getItem('token')

    // Business rule
    const payload = {
      ...form.value,
      service_status: form.value.service_required ? form.value.service_status : 'not_required',
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('SAVE ERROR:', text)
      return
    }

    showModal.value = false
    await loadOrders()
  } catch (err) {
    console.error(err)
  }
}

// Headers
const tableHeaders = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer_name', label: 'Customer Name' },
  { key: 'order_date', label: 'Order Date' },
  { key: 'products', label: 'Products' },
  { key: 'total_amount', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'service_status', label: 'Service Status' },
  { key: 'service_team', label: 'Service Team' },
  { key: 'actions', label: 'Actions' },
]

watch(
  () => form.value.service_required,
  (val) => {
    if (!val) {
      form.value.service_status = 'not_required'
    } else {
      form.value.service_status = 'pending'
    }
  },
)

// Init
onMounted(() => {
  loadOrders()
  loadCustomers()
})
</script>
