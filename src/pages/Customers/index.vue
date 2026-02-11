<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Customers</h2>
      <Button @click="handleAddCustomer" variant="primary">
        Add Customer
      </Button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <div class="mb-4">
          <Input
            v-model="searchQuery"
            placeholder="Search customers..."
            type="text"
            class="w-full"
          />
        </div>

        <Table
          :headers="tableHeaders"
          :data="customers"
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
const loading = ref(false)
const customers = ref([])

const tableHeaders = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'orders', label: 'Total Orders' },
  { key: 'actions', label: 'Actions' },
]

const handleAddCustomer = () => {
  // TODO: Implement add customer functionality
  console.log('Add customer clicked')
}
</script>

<style scoped></style>
