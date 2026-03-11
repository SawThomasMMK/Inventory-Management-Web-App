<template>
  <div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Products</h2>

      <Button
        @click="handleAddProduct"
        variant="primary"
      >
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
        >

          <template #cell-image="{ value }">
            <img
              :src="value"
              :alt="'Product image'"
              class="w-16 h-16 object-cover rounded"
            />
          </template>

          <template #cell-price="{ value }">
            ${{ value.toFixed(2) }}
          </template>

        </Table>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Table from '@/components/Table.vue'

import { mockProducts } from '@/constants/mockProducts.js'

const searchQuery = ref('')
const loading = ref(false)
const products = ref([])

onMounted(() => {
  products.value = mockProducts.map((product) => ({
    ...product,
    image: product.image_url,
  }))
})

const tableHeaders = [
  { key: 'image', label: 'Image' },
  { key: 'name', label: 'Product Name' },
  { key: 'description', label: 'Description' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: 'Actions' },
]

const handleAddProduct = () => {
  // TODO: Implement add product functionality
  console.log('Add product clicked')
}
</script>

<style scoped>
</style>