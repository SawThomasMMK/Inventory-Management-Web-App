<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Products</h2>
      <Button @click="handleAddProduct" variant="primary">
        Add Product
      </Button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <div class="mb-4">
          <Input
            v-model="searchQuery"
            placeholder="Search products..."
            type="text"
            class="w-full"
          />
        </div>

        <Table
          :headers="tableHeaders"
          :data="products"
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
const products = ref([])

const tableHeaders = [
  { key: 'name', label: 'Product Name' },
  { key: 'sku', label: 'SKU' },
  { key: 'stock', label: 'Stock' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: 'Actions' },
]

const handleAddProduct = () => {
  // TODO: Implement add product functionality
  console.log('Add product clicked')
}
</script>

<style scoped></style>
