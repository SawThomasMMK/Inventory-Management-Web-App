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
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-3">
              <!-- EDIT -->
              <button @click="handleEditOrder(row)" class="text-blue-600">
                <PencilSquareIcon class="w-5 h-5" />
              </button>

              <!-- DELETE -->
              <button @click="openDeleteModal(row)" class="text-red-600">
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-model:isOpen="showModal" :title="isEditMode ? 'Edit Order' : 'Add Order'">
      <div class="space-y-6">
        <!-- Basic Information Section -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Basic Information</h3>
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
        </div>

        <!-- Customer Section -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Customer</h3>
          <div>
            <label class="text-sm font-medium text-gray-700">Customer Name</label>
            <select
              v-model="form.customer_id"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null" disabled>Select Customer</option>
              <option v-for="c in customers" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
            <p v-if="errors.customer_id" class="text-red-500 text-sm mt-1">
              {{ errors.customer_id }}
            </p>
          </div>
        </div>

        <!-- Products Section -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Products</h3>
          <div class="space-y-2">
            <div v-for="(item, index) in form.items" :key="index" class="flex gap-2 items-end">
              <!-- Product -->
              <div class="flex-1">
                <select
                  v-model="item.product_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option disabled value="">Select Product</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
                <p v-if="errors[`item_${index}_product`]" class="text-red-500 text-xs mt-1">
                  {{ errors[`item_${index}_product`] }}
                </p>
              </div>

              <!-- Quantity -->
              <div class="w-20">
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  placeholder="Qty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p v-if="errors[`item_${index}_quantity`]" class="text-red-500 text-xs mt-1">
                  {{ errors[`item_${index}_quantity`] }}
                </p>
              </div>

              <!-- Remove Button -->
              <button
                @click="removeItem(index)"
                class="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                title="Remove"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Add Product Button -->
          <button
            @click="addItem"
            class="mt-3 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition flex items-center"
          >
            <PlusIcon class="w-4 h-4 mr-1" /> Add Product
          </button>
        </div>

        <!-- Order Status Section -->
        <div class="grid grid-cols-2 gap-4 border-t pt-4">
          <!-- Total Amount -->
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Total Amount</label>
            <div
              class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-900 flex items-center"
            >
              ${{ totalAmount.toFixed(2) }}
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Status</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <!-- Service Section -->
        <div class="border-t pt-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.service_required" class="w-4 h-4 rounded" />
            <span class="text-sm font-semibold text-gray-700">Service Team Required</span>
          </label>

          <!-- Service Fields (Conditional) -->
          <div v-if="form.service_required" class="mt-4 space-y-4 pl-7 border-l-2 border-blue-200">
            <div>
              <label class="text-sm font-medium text-gray-700">Service Status</label>
              <select
                v-model="form.service_status"
                class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="on_field">On Field</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Service Team</label>
              <select
                v-model="form.service_team_id"
                class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="null" disabled>Select Team</option>
                <option v-for="team in serviceTeams" :key="team.id" :value="team.id">
                  {{ team.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Handled By</label>
              <select
                v-model="form.handled_by_employee_id"
                class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="null" disabled>Select Employee</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.first_name }} {{ emp.last_name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-2">Notes</label>
          <textarea
            v-model="form.notes"
            placeholder="Add any additional notes about this order..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>
      </div>

      <template #footer>
        <div class="w-full flex gap-2">
          <Button variant="primary" class="w-[80%]" @click="saveOrder"> Save Order </Button>
          <Button variant="secondary" class="w-[20%]" @click="showModal = false"> Cancel </Button>
        </div>
      </template>
    </Modal>
    <ConfirmDelete
      v-model:isOpen="showDeleteModal"
      :productName="deleteName"
      title="Delete Order"
      @confirm="deleteOrder"
    />
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
import ConfirmDelete from '@/components/ConfirmDelete.vue'

// State
const searchQuery = ref('')
const loading = ref(false)

const orders = ref([])
const customers = ref([])

const showModal = ref(false)
const errors = ref({})
const products = ref([])

const serviceTeams = ref([])
const employees = ref([])

const showDeleteModal = ref(false)
const deleteId = ref(null)
const deleteName = ref('')
const isEditMode = ref(false)
const editingId = ref(null)

// Computed Price
const totalAmount = computed(() => {
  return form.value.items.reduce((total, item) => {
    const price = Number(item.unit_price) || 0
    const qty = Number(item.quantity) || 0
    return total + price * qty
  }, 0)
})

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
  service_team_id: null,
  handled_by_employee_id: null,

  items: [
    {
      product_id: '',
      quantity: 1,
      unit_price: null,
    },
  ],
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
      ${order.total_amount}
      ${order.products.join(' ')}
      ${order.service_status}
      ${order.service_team}
      ${order.handled_by}
      ${order.id}
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
      handled_by: order.handled_by
        ? `${order.handled_by.first_name} ${order.handled_by.last_name}`
        : 'N/A',
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

// Load Products
const loadProducts = async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    products.value = data.data
  } catch (err) {
    console.error(err)
  }
}

const addItem = () => {
  form.value.items.push({
    product_id: '',
    quantity: 1,
    unit_price: null,
  })
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

// Load Service Teams
const loadServiceTeams = async () => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_BASE_URL}/service-teams`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  serviceTeams.value = data.data
}

// Load Employees
const loadEmployees = async () => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_BASE_URL}/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  employees.value = data.data
}

// Format Date
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'

  const date = new Date(dateStr)

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
  })
}

// Add Order
const handleAddOrder = () => {
  // Reset form
  isEditMode.value = false
  editingId.value = null

  form.value = {
    order_number: '',
    customer_id: '',
    status: 'processing',
    order_date: '',
    order_by: '',
    notes: '',

    service_required: false,
    service_status: null,

    service_team_id: null,
    handled_by_employee_id: null,
    items: [
      {
        product_id: '',
        quantity: 1,
        unit_price: null,
      },
    ],
  }

  showModal.value = true
  errors.value = {}
}

// Validation
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

  if (!form.value.items.length) {
    newErrors.items = 'At least one product is required'
  }
  if (form.value.service_required) {
    if (!form.value.service_team_id) {
      newErrors.service_team_id = 'Select a service team'
    }

    if (!form.value.handled_by_employee_id) {
      newErrors.handled_by_employee_id = 'Select an employee'
    }
  }

  form.value.items.forEach((item, index) => {
    if (!item.product_id) {
      newErrors[`item_${index}_product`] = 'Select a product'
    }

    if (!item.quantity || item.quantity < 1) {
      newErrors[`item_${index}_quantity`] = 'Invalid quantity'
    }
  })
  errors.value = newErrors

  return Object.keys(newErrors).length === 0
}

// Save Order
const saveOrder = async () => {
  try {
    const token = localStorage.getItem('token')

    const payload = {
      ...form.value,
      service_status: form.value.service_required ? form.value.service_status : 'not_required',
      items: form.value.items,
    }

    let url = `${API_BASE_URL}/orders`
    let method = 'POST'

    if (isEditMode.value) {
      url = `${API_BASE_URL}/orders/${editingId.value}`
      method = 'PUT'
    }

    const res = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error(await res.text())
      return
    }

    showModal.value = false
    isEditMode.value = false
    editingId.value = null

    await loadOrders()
  } catch (err) {
    console.error(err)
  }
}

// Delete Order
const deleteOrder = async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_BASE_URL}/orders/${deleteId.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      console.error(await res.text())
      return
    }

    showDeleteModal.value = false
    await loadOrders()
  } catch (err) {
    console.error(err)
  }
}

// Open Delete Modal
const openDeleteModal = (row) => {
  showDeleteModal.value = true
  deleteId.value = row.id

  deleteName.value = `Order ID: ${row.id}`
}

// Load Order for Edit
const loadOrderById = async (id) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    return data.data
  } catch (err) {
    console.error(err)
  }
}

// Edit Order
const handleEditOrder = async (row) => {
  try {
    isEditMode.value = true
    editingId.value = row.id

    const order = await loadOrderById(row.id)

    // IMPORTANT: map items correctly
    const mappedItems = order.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
    }))

    form.value = {
      order_number: order.order_number,
      customer_id: order.customer?.id || null,
      status: order.status,
      order_date: order.order_date?.split('T')[0],
      order_by: order.order_by,
      notes: order.notes || '',

      service_required: order.service_required,
      service_status: order.service_status,

      service_team_id: order.service_team?.id || null,
      handled_by_employee_id: order.handled_by?.id || null,

      items: mappedItems.length
        ? mappedItems
        : [
            {
              product_id: '',
              quantity: 1,
              unit_price: null,
            },
          ],
    }

    showModal.value = true
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
  { key: 'handled_by', label: 'Employee' },
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

watch(
  () => form.value.customer_id,
  (customerId) => {
    const selected = customers.value.find((c) => String(c.id) === String(customerId))

    console.log('FOUND CUSTOMER:', selected) // debug

    form.value.order_by = selected?.name || ''
  },
)

watch(
  () => form.value.items.map((item) => item.product_id),
  (newProductIds) => {
    form.value.items.forEach((item, index) => {
      const product = products.value.find((p) => String(p.id) === String(item.product_id))

      if (product) {
        item.unit_price = Number(product.price)
      }
    })
  },
  { deep: true },
)

// Init
onMounted(() => {
  loadOrders()
  loadCustomers()
  loadProducts()
  loadServiceTeams()
  loadEmployees()
})
</script>
