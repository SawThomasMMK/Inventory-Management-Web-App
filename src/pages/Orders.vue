<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Orders</h2>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="pt-6">
        <div class="flex items-center justify-between mb-4 mx-6 gap-4">
          <div class="flex items-center gap-4 flex-1">
            <Input
              v-model="searchQuery"
              placeholder="Search orders..."
              type="text"
              class="flex-1 max-w-80"
            />
            <select
              v-model="statusFilter"
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Create Button -->
          <Button
            @click="handleCreateOrder"
            variant="primary"
            class="w-auto flex items-center whitespace-nowrap"
          >
            <PlusIcon class="w-5 h-5 mr-2" />Create Order</Button
          >
        </div>

        <Table :headers="tableHeaders" :data="orders" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Table from '@/components/Table.vue'
import { PlusIcon } from '@heroicons/vue/24/solid'

const searchQuery = ref('')
const statusFilter = ref('')
const loading = ref(false)
const orders = ref([])

const tableHeaders = [
  { key: 'orderNumber', label: 'Order #' },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Date' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const handleCreateOrder = () => {
  // TODO: Implement create order functionality
  console.log('Create order clicked')
}
</script>

<style scoped></style>
