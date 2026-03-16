<template>
  <div>
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold">Service Teams</h2>
        <p class="text-gray-500 text-sm">Manage service teams, members, and team leaders</p>
      </div>

      <Button variant="primary" @click="handleCreateTeam"> + Create Team </Button>
    </div>

    <!-- Teams Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="team in teams" :key="team.id" class="bg-white rounded-lg shadow p-6">
        <!-- Team Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold">
              {{ team.name }}
            </h3>

            <p class="text-sm text-gray-500">
              {{ team.members?.length || 0 }} members • {{ team.active_projects ?? 0 }} active
              projects
            </p>
          </div>

          <div class="flex gap-2">
            <button class="text-blue-600 hover:text-blue-800" @click="editTeam(team)">
              <PencilSquareIcon class="w-5 h-5" />
            </button>

            <button class="text-red-600 hover:text-red-800" @click="deleteTeam(team)">
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Team Members -->
        <div class="space-y-3">
          <div
            v-for="member in team.members"
            :key="member.id"
            class="bg-gray-50 rounded-md p-3 flex justify-between items-center"
          >
            <div>
              <p class="font-medium">
                {{ member.full_name }}
              </p>

              <p class="text-sm text-gray-500">
                {{ member.job_title }}
              </p>
            </div>

            <div class="flex gap-2">
              <button class="text-blue-600 hover:text-blue-800" @click="editMember(team, member)">
                <PencilSquareIcon class="w-4 h-4" />
              </button>

              <button class="text-red-600 hover:text-red-800" @click="removeMember(team, member)">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Add Member Button -->
        <button
          class="mt-4 w-full border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50 flex justify-center items-center gap-2"
          @click="openAddMember(team)"
        >
          + Add Member
        </button>
      </div>
    </div>

    <!-- Create / Edit Team Modal -->
    <Modal v-model:isOpen="showTeamModal" title="Service Team">
      <Input label="Team Name" v-model="teamForm.name" placeholder="Enter team name" />

      <template #footer>
        <div class="flex gap-2 w-full">
          <Button variant="primary" class="w-[80%]" @click="saveTeam"> Save Team </Button>

          <Button variant="secondary" class="w-[20%]" @click="showTeamModal = false">
            Cancel
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Add Member Modal -->
    <Modal v-model:isOpen="showMemberModal" title="Add Team Member">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1"> Select Employee </label>

          <select v-model="memberForm.employee_id" class="w-full border rounded-md p-2">
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.full_name }}
            </option>
          </select>
          <Input
            label="Role"
            v-model="memberForm.role"
            placeholder="Technician, Assistant, Lead..."
          />
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 w-full">
          <Button variant="primary" class="w-[80%]" @click="addMember"> Add Member </Button>

          <Button variant="secondary" class="w-[20%]" @click="showMemberModal = false">
            Cancel
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Delete Team Modal -->
    <ConfirmDelete
      v-model:isOpen="showDeleteModal"
      :productName="teamToDelete?.name"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
// Imports

import { ref, onMounted } from 'vue'

import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Modal from '@/components/Modal.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'

import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

// Reactive state

const teams = ref([])
const employees = ref([])

const showTeamModal = ref(false)
const showMemberModal = ref(false)
const showDeleteModal = ref(false)

const editingTeam = ref(null)
const currentTeam = ref(null)

const teamToDelete = ref(null)

// Forms

const teamForm = ref({
  name: '',
})

const memberForm = ref({
  employee_id: null,
  role: '',
})

// API base

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

// Load Teams

const loadTeams = async () => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_BASE_URL}/service-teams`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()

  teams.value = data.data
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

// Create Team

const handleCreateTeam = () => {
  editingTeam.value = null
  teamForm.value.name = ''

  showTeamModal.value = true
}

// Save Team

const saveTeam = async () => {
  const token = localStorage.getItem('token')

  const method = editingTeam.value ? 'PUT' : 'POST'

  const url = editingTeam.value
    ? `${API_BASE_URL}/service-teams/${editingTeam.value.id}`
    : `${API_BASE_URL}/service-teams`

  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(teamForm.value),
  })

  showTeamModal.value = false

  loadTeams()
}

// Edit Team

const editTeam = (team) => {
  editingTeam.value = team
  teamForm.value.name = team.name

  showTeamModal.value = true
}

// Delete Team

const deleteTeam = (team) => {
  teamToDelete.value = team
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  const token = localStorage.getItem('token')

  await fetch(`${API_BASE_URL}/service-teams/${teamToDelete.value.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  showDeleteModal.value = false

  loadTeams()
}

// Add Member

const openAddMember = (team) => {
  currentTeam.value = team
  memberForm.value.employee_id = null

  showMemberModal.value = true
}

const addMember = async () => {
  const token = localStorage.getItem('token')

  const team = currentTeam.value

  const memberIds = [...(team.members?.map((m) => m.id) || []), memberForm.value.employee_id]

  await fetch(`${API_BASE_URL}/service-teams/${team.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: team.name,
      member_ids: memberIds,
      role: memberForm.value.role,
    }),
  })

  showMemberModal.value = false

  loadTeams()
}

// Lifecycle

onMounted(() => {
  loadTeams()
  loadEmployees()
})
</script>
