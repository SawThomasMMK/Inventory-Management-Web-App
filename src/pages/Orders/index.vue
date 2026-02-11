<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Orders</h2>
      <Button @click="handleCreateOrder" variant="primary">
        Create Order
      </Button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <div class="mb-4 flex gap-4">
          <Input
            v-model="searchQuery"
            placeholder="Search orders..."
            type="text"
            class="flex-1"
          />
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <Table
          :headers="tableHeaders"
          :data="orders"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Table from '@/components/common/Table.vue'

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
