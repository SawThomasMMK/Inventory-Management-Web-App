<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Products</h2>

      <Button @click="handleAddProduct" variant="primary"> Add Product </Button>
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

        <Table :headers="tableHeaders" :data="products" :loading="loading">
          <template #cell-image="{ value }">
            <img :src="value" :alt="'Product image'" class="w-20 h-20 object-cover rounded" />
          </template>

          <template #cell-price="{ value }"> ${{ Number(value).toFixed(2) }} </template>
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

const searchQuery = ref('')
const loading = ref(false)
const products = ref([])

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

const loadProducts = async () => {
  loading.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    products.value = data.data.map((product) => ({
      ...product,
      image: product.image_url,
    }))
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
    console.log('Loading finished:', loading.value)
  }
}

onMounted(() => {
  loadProducts()
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

<style scoped></style>
