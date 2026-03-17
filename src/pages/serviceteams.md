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
              {{ team.members?.length || 0 }} members •
              {{ Number(team.active_projects || 0) }} active projects
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
        <div
          v-for="member in [...team.members].sort((a, b) => {
            if (team.leader && a.id === team.leader.id) return -1
            if (team.leader && b.id === team.leader.id) return 1
            return 0
          })"
          :key="member.id"
          class="bg-gray-50 rounded-md p-3 flex items-center justify-between mb-2"
        >
          <!-- Left -->
          <div class="flex items-center gap-2">
            <StarIcon
              v-if="team.leader && member.id === team.leader.id"
              class="w-4 h-4 text-amber-500"
            />
            <div>
              <p class="font-medium">
                {{ member.full_name }}
              </p>

              <p class="text-sm text-gray-500">
                {{ member.job_title }}
              </p>
            </div>
          </div>

          <!-- Right -->
          <div class="flex gap-2 shrink-0">
            <button
              class="text-blue-600 hover:text-blue-800"
              @click.stop="editMember(team, member)"
            >
              <PencilSquareIcon class="w-4 h-4" />
            </button>

            <button
              class="text-red-600 hover:text-red-800"
              @click.stop="deleteMember(team, member)"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
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

      <Input
        label="Active Projects"
        type="number"
        v-model="teamForm.active_projects"
        placeholder="Number of active projects"
      />
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

          <select v-model="memberForm.employee_id" class="w-full border rounded-md p-2 mb-2">
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.full_name }}
            </option>
          </select>
          <Input
            label="Position"
            v-model="memberForm.job_title"
            placeholder="Technician, Assistant, Lead..."
          />
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="memberForm.is_leader"
              :disabled="
                currentTeam?.leader_employee_id &&
                currentTeam.leader_employee_id !== memberForm.employee_id
              "
              class="w-4 h-4"
            />

            <span class="text-sm text-gray-700"> Set as Team Leader </span>
          </div>
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

    <!-- Edit Member Modal --><Modal v-model:isOpen="showEditMemberModal" title="Edit Team Member">
      <div class="space-y-4">
        <Input
          label="Role"
          v-model="editMemberForm.job_title"
          placeholder="Technician, Assistant, Lead..."
        />

        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="editMemberForm.is_leader" class="w-4 h-4" />

          <span class="text-sm text-gray-700"> Set as Team Leader </span>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 w-full">
          <Button variant="primary" class="w-[80%]" @click="updateMember"> Save Changes </Button>

          <Button variant="secondary" class="w-[20%]" @click="showEditMemberModal = false">
            Cancel
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Delete Team Modal -->
    <ConfirmDelete
      v-model:isOpen="showDeleteModal"
      title="Delete Service Team"
      :productName="teamToDelete?.name"
      @confirm="confirmDelete"
    />

    <!-- Confirm Remove Member Modal -->

    <ConfirmDelete
      v-model:isOpen="showDeleteMemberModal"
      title="Remove Team Member"
      :productName="memberToDelete?.full_name"
      @confirm="confirmDeleteMember"
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
import { StarIcon } from '@heroicons/vue/24/solid'

// Reactive state

const teams = ref([])
const employees = ref([])

const showTeamModal = ref(false)
const showMemberModal = ref(false)
const showDeleteModal = ref(false)

const editingTeam = ref(null)
const currentTeam = ref(null)

const teamToDelete = ref(null)
const memberToDelete = ref(null)
const teamForMemberDelete = ref(null)
const showDeleteMemberModal = ref(false)

const showEditMemberModal = ref(false)

const editingMember = ref(null)

const editMemberForm = ref({
  job_title: '',
  is_leader: false,
})

// Forms

const teamForm = ref({
  name: '',
  active_projects: 0,
})

const memberForm = ref({
  employee_id: null,
  job_title: '',
  is_leader: false,
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
  console.log(data)
  teams.value = data.data
}

// Load Employees

const loadEmployees = async () => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_BASE_URL}/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  console.log(data)
  employees.value = data.data
}

// Create Team

const handleCreateTeam = () => {
  editingTeam.value = null
  teamForm.value = {
    name: '',
    active_projects: 0,
  }

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
    body: JSON.stringify({
      name: teamForm.value.name,
      active_projects: Number(teamForm.value.active_projects),
    }),
  })

  showTeamModal.value = false

  loadTeams()
}

// Edit Team

const editTeam = (team) => {
  editingTeam.value = team

  teamForm.value = {
    name: team.name,
    active_projects: team.active_projects || 0,
  }

  showTeamModal.value = true
}

// Delete Team

const deleteTeam = (team) => {
  teamToDelete.value = team
  showDeleteModal.value = true
}

// Confirm Delete Team

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

  memberForm.value = {
    employee_id: null,
    job_title: '',
    is_leader: false,
  }

  showMemberModal.value = true
}

const addMember = async () => {
  const token = localStorage.getItem('token')

  const team = currentTeam.value

  // Ensure we have a valid employee and position
  if (!memberForm.value.employee_id) {
    console.warn('No employee selected for member addition')
    return
  }

  const selectedEmployee = employees.value.find((e) => e.id === memberForm.value.employee_id)
  if (!selectedEmployee) {
    console.warn('Selected employee not found')
    return
  }

  try {
    // Update employee job_title on create team member
    const employeePayload = {
      first_name: selectedEmployee.first_name,
      last_name: selectedEmployee.last_name,
      email: selectedEmployee.email,
      phone: selectedEmployee.phone,
      job_title: memberForm.value.job_title || selectedEmployee.job_title,
      address: selectedEmployee.address,
      hired_at: selectedEmployee.hired_at ? selectedEmployee.hired_at.split('T')[0] : null,
      is_active: selectedEmployee.is_active,
    }

    const empRes = await fetch(`${API_BASE_URL}/employees/${selectedEmployee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeePayload),
    })

    if (!empRes.ok) {
      const err = await empRes.json()
      console.error('Employee update on add member failed:', err)
      return
    }
  } catch (error) {
    console.error('Add member employee update error:', error)
    return
  }

  const memberIds = [...(team.members?.map((m) => m.id) || []), memberForm.value.employee_id]

  const leaderId = memberForm.value.is_leader
    ? memberForm.value.employee_id
    : team.leader_employee_id

  await fetch(`${API_BASE_URL}/service-teams/${team.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: team.name,
      member_ids: memberIds,
      leader_employee_id: leaderId,
    }),
  })

  showMemberModal.value = false

  loadTeams()
}

// Edit Member

const editMember = (team, member) => {
  editingTeam.value = team
  editingMember.value = member

  editMemberForm.value = {
    job_title: member.job_title || '',
    is_leader: team.leader && team.leader.id === member.id,
  }

  showEditMemberModal.value = true
}

// Delete Member

const deleteMember = (team, member) => {
  teamForMemberDelete.value = team
  memberToDelete.value = member
  showDeleteMemberModal.value = true
}

// Update Member

const updateMember = async () => {
  const token = localStorage.getItem('token')

  const team = editingTeam.value
  const member = editingMember.value

  try {
    // 1️⃣ Update employee position
    const employeePayload = {
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      phone: member.phone,
      job_title: editMemberForm.value.job_title,
      address: member.address,
      hired_at: member.hired_at
        ? member.hired_at.split('T')[0] // ensure YYYY-MM-DD
        : null,
      is_active: member.is_active,
    }

    const empRes = await fetch(`${API_BASE_URL}/employees/${member.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeePayload),
    })

    if (!empRes.ok) {
      const err = await empRes.json()
      console.error('Employee update failed:', err)
      return
    }

    // 2️⃣ Update leader if needed
    const leaderId = editMemberForm.value.is_leader
      ? member.id
      : team.leader && team.leader.id === member.id
        ? null
        : team.leader?.id

    const teamPayload = {
      name: team.name,
      member_ids: team.members.map((m) => m.id),
      leader_employee_id: leaderId,
    }

    const teamRes = await fetch(`${API_BASE_URL}/service-teams/${team.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(teamPayload),
    })

    if (!teamRes.ok) {
      const err = await teamRes.json()
      console.error('Team update failed:', err)
      return
    }

    showEditMemberModal.value = false

    await loadTeams()
  } catch (error) {
    console.error('Update member error:', error)
  }
}

// Confirm Delete Member

const confirmDeleteMember = async () => {
  const token = localStorage.getItem('token')

  const team = teamForMemberDelete.value
  const member = memberToDelete.value

  const updatedMembers = team.members.filter((m) => m.id !== member.id).map((m) => m.id)

  const leaderId = team.leader_employee_id === member.id ? null : team.leader_employee_id

  await fetch(`${API_BASE_URL}/service-teams/${team.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: team.name,
      member_ids: updatedMembers,
      leader_employee_id: leaderId,
    }),
  })

  showDeleteMemberModal.value = false

  loadTeams()
}

// Lifecycle

onMounted(() => {
  loadTeams()
  loadEmployees()
})
</script>
