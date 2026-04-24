<template>
  <div>
    <!-- Page Header -->
    <div class="flex justify-between items-center pb-6">
      <div>
        <h2 class="text-2xl font-bold">Employees</h2>
        <p class="text-gray-500 text-sm py-1">View employee information and details</p>
      </div>

      <div class="text-right">
        <p class="text-lg text-sm text-gray-500">Total Employees: {{ employees.length }}</p>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="pt-6">
        <!-- Search -->
        <div class="flex items-center justify-between mb-4 mx-6 gap-4">
          <Input
            v-model="searchQuery"
            placeholder="Search employees..."
            type="text"
            class="w-full max-w-80"
          />

          <!-- Add Button -->
          <Button
            @click="handleAddEmployee"
            variant="primary"
            class="w-auto flex items-center whitespace-nowrap"
          >
            <PlusIcon class="w-5 h-5 mr-2" />Add Employee</Button
          >
        </div>

        <!-- Table -->
        <Table :headers="tableHeaders" :data="filteredEmployees" :loading="loading">
          <!-- Actions -->
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-3">
              <!-- Edit -->
              <button
                class="text-blue-600 hover:text-blue-800"
                @click="editEmployee(row)"
                title="Edit"
              >
                <PencilSquareIcon class="w-5 h-5 cursor-pointer transition hover:scale-110" />
              </button>

              <!-- Delete -->
              <button
                class="text-red-600 hover:text-red-800"
                @click="deleteEmployee(row)"
                title="Delete"
              >
                <TrashIcon class="w-5 h-5 cursor-pointer transition hover:scale-110" />
              </button>
            </div>
          </template>
          <template #cell-status="{ value }">
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="
                value === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              "
            >
              {{ value }}
            </span>
          </template>
        </Table>
      </div>
    </div>

    <!-- Create / Edit Employee Modal -->
    <Modal v-model:isOpen="showModal" title="Add New Employee">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <Input label="First Name" v-model="form.first_name" placeholder="Enter first name" />

          <Input label="Last Name" v-model="form.last_name" placeholder="Enter last name" />
        </div>

        <Input label="Email" v-model="form.email" placeholder="Enter email" />

        <Input label="Phone" v-model="form.phone" placeholder="Enter phone number" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Service Teams </label>

          <select v-model="form.teams" multiple class="w-full border rounded-md p-2">
            <option v-for="team in serviceTeams" :key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>

          <p class="text-xs text-gray-500 mt-1">Hold CTRL / CMD to select multiple teams</p>
        </div>
        <Input label="Job Title" v-model="form.job_title" placeholder="Enter job title" />

        <Input label="Address" type="textarea" v-model="form.address" placeholder="Enter address" />

        <Input label="Hire Date" type="date" v-model="form.hired_at" />

        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="form.is_active" class="w-4 h-4" />
          <span class="text-sm">Active Employee</span>
        </div>
      </div>

      <template #footer>
        <div class="w-full flex gap-2">
          <Button variant="primary" class="w-[80%]" @click="saveEmployee"> Save Employee </Button>

          <Button variant="secondary" class="w-[20%]" @click="showModal = false"> Cancel </Button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <ConfirmDelete
      v-model:isOpen="showDeleteModal"
      title="Delete Employee"
      :productName="employeeToDelete?.first_name + ' ' + employeeToDelete?.last_name"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
// Imports

import { ref, onMounted, computed } from 'vue'

import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'

// Reactive state

const searchQuery = ref('')
const loading = ref(false)

const employees = ref([])
const serviceTeams = ref([])

const filteredEmployees = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return employees.value

  return employees.value.filter((employee) => {
    const combined =
      `${employee.name} ${employee.email} ${employee.phone} ${employee.department} ${employee.job_title} ${employee.status}`.toLowerCase()
    return combined.includes(q)
  })
})

const showModal = ref(false)
const editingEmployee = ref(null)

const showDeleteModal = ref(false)
const employeeToDelete = ref(null)

// Form model

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  job_title: '',
  address: '',
  hired_at: '',
  is_active: true,
  teams: [],
})

// API base URL

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

// Load Service Teams

const loadServiceTeams = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/service-teams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    serviceTeams.value = data.data
  } catch (err) {
    console.error(err)
  }
}

// Load Employees

const loadEmployees = async () => {
  loading.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/employees`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    employees.value = data.data.map((employee) => ({
      ...employee,
      name: `${employee.first_name} ${employee.last_name}`,
      department: employee.service_team_id
        ? serviceTeams.value.find((t) => t.id === employee.service_team_id)?.name || '—'
        : 'N/A',
      status: employee.is_active ? 'Active' : 'Inactive',
    }))
    console.log(data.data)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Create / Update Employee

const saveEmployee = async () => {
  try {
    const token = localStorage.getItem('token')

    const method = editingEmployee.value ? 'PUT' : 'POST'

    const url = editingEmployee.value
      ? `${API_BASE_URL}/employees/${editingEmployee.value.id}`
      : `${API_BASE_URL}/employees`

    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form.value,
        member_ids: form.value.teams,
      }),
    })

    if (!response.ok) throw new Error('Save failed')

    showModal.value = false

    await loadEmployees()
  } catch (err) {
    console.error(err)
  }
}

// Edit Employee

const editEmployee = (employee) => {
  editingEmployee.value = employee

  form.value = {
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone,
    job_title: employee.job_title,
    address: employee.address,
    hired_at: employee.hired_at,
    is_active: employee.is_active,
  }

  showModal.value = true
}

// Delete Employee

const deleteEmployee = (employee) => {
  employeeToDelete.value = employee
  showDeleteModal.value = true
}

// Confirm delete

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('token')

    await fetch(`${API_BASE_URL}/employees/${employeeToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    showDeleteModal.value = false

    await loadEmployees()
  } catch (err) {
    console.error(err)
  }
}

// Table headers

const tableHeaders = [
  { key: 'name', label: 'Name' },
  { key: 'job_title', label: 'Position' },
  { key: 'department', label: 'Department' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

// Add employee

const handleAddEmployee = () => {
  editingEmployee.value = null

  form.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    address: '',
    hired_at: '',
    is_active: true,
  }

  showModal.value = true
}

// Lifecycle

onMounted(() => {
  loadServiceTeams()
  loadEmployees()
})
</script>

<style scoped></style>
