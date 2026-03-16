<template>
  <div>
    <!-- Page Header -->
    <div class="pb-6">
      <h2 class="text-2xl font-bold">Customers</h2>
      <p class="text-gray-500 text-sm py-1">Manage customer information and service requests</p>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="pt-6">
        <!-- Search -->
        <div class="flex items-center justify-between mb-4 mx-6 gap-4">
          <Input
            v-model="searchQuery"
            placeholder="Search customers..."
            type="text"
            class="w-full max-w-80"
          />

          <!-- Add Button -->
          <Button
            @click="handleAddCustomer"
            variant="primary"
            class="w-auto flex items-center whitespace-nowrap"
          >
            <PlusIcon class="w-5 h-5 mr-2" />Add Customer</Button
          >
        </div>

        <!-- Table -->
        <Table :headers="tableHeaders" :data="customers" :loading="loading">
          <!-- Actions -->
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-3">
              <!-- Edit -->
              <button
                class="text-blue-600 hover:text-blue-800"
                @click="editCustomer(row)"
                title="Edit"
              >
                <PencilSquareIcon class="w-5 h-5 cursor-pointer transition hover:scale-110" />
              </button>

              <!-- Delete -->
              <button
                class="text-red-600 hover:text-red-800"
                @click="deleteCustomer(row)"
                title="Delete"
              >
                <TrashIcon class="w-5 h-5 cursor-pointer transition hover:scale-110" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>

    <!-- Create / Edit Customer Modal -->
    <Modal v-model:isOpen="showModal" title="Add New Customer">
      <div class="space-y-4">
        <Input label="Customer Name" v-model="form.name" placeholder="Enter customer name" />

        <Input label="Email" v-model="form.email" placeholder="Enter email" />

        <Input label="Phone" v-model="form.phone" placeholder="Enter phone number" />

        <Input label="Address" type="textarea" v-model="form.address" placeholder="Enter address" />
      </div>

      <template #footer>
        <div class="w-full flex gap-2">
          <Button variant="primary" class="w-[80%]" @click="saveCustomer"> Save Customer </Button>

          <Button variant="secondary" class="w-[20%]" @click="showModal = false"> Cancel </Button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <ConfirmDelete
      v-model:isOpen="showDeleteModal"
      :productName="customerToDelete?.name"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
// Imports

import { ref, onMounted } from 'vue'

import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'

// Reactive state

const searchQuery = ref('')
const loading = ref(false)

const customers = ref([])

const showModal = ref(false)
const editingCustomer = ref(null)

const showDeleteModal = ref(false)
const customerToDelete = ref(null)

// Form model

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
})

// API base URL

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

// Load Customers

const loadCustomers = async () => {
  loading.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    customers.value = data.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Create / Update Customer

const saveCustomer = async () => {
  try {
    const token = localStorage.getItem('token')

    const method = editingCustomer.value ? 'PUT' : 'POST'

    const url = editingCustomer.value
      ? `${API_BASE_URL}/customers/${editingCustomer.value.id}`
      : `${API_BASE_URL}/customers`

    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.value),
    })

    if (!response.ok) throw new Error('Save failed')

    showModal.value = false

    await loadCustomers()
  } catch (err) {
    console.error(err)
  }
}

// Edit Customer

const editCustomer = (customer) => {
  editingCustomer.value = customer

  form.value = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
  }

  showModal.value = true
}

// Delete Customer

const deleteCustomer = (customer) => {
  customerToDelete.value = customer
  showDeleteModal.value = true
}

// Confirm delete

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('token')

    await fetch(`${API_BASE_URL}/customers/${customerToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    showDeleteModal.value = false

    await loadCustomers()
  } catch (err) {
    console.error(err)
  }
}

// Table headers

const tableHeaders = [
  { key: 'name', label: 'Customer Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'actions', label: 'Actions' },
]

// Add customer

const handleAddCustomer = () => {
  editingCustomer.value = null

  form.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
  }

  showModal.value = true
}

// Lifecycle

onMounted(() => {
  loadCustomers()
})
</script>

<style scoped></style>
