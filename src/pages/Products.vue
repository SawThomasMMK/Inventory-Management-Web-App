<template>
  <div>
    <!-- Page Header -->
    <div class="pb-6">
      <h2 class="text-2xl font-bold">Products</h2>
      <p class="text-gray-500 text-sm py-1">Manage your inventory and product catalog</p>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="pt-6">
        <!-- Search -->
        <div class="flex items-center justify-between mb-4 mx-6 gap-4">
          <Input
            v-model="searchQuery"
            placeholder="Search products..."
            type="text"
            class="w-full max-w-80"
          />

          <!-- Add Button -->
          <Button
            @click="handleAddProduct"
            variant="primary"
            class="w-auto flex items-center whitespace-nowrap"
          >
            <PlusIcon class="w-5 h-5 mr-2" />Add Product</Button
          >
        </div>

        <!-- Table -->
        <Table :headers="tableHeaders" :data="products" :loading="loading">
          <!-- Image -->
          <template #cell-image="{ value }">
            <img :src="value" alt="Product image" class="w-16 h-16 object-cover rounded" />
          </template>

          <!-- Price -->
          <template #cell-price="{ value }"> ${{ Number(value).toFixed(2) }} </template>

          <!-- Actions -->
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-3">
              <!-- Edit -->
              <button
                class="text-blue-600 hover:text-blue-800"
                @click="editProduct(row)"
                title="Edit"
              >
                <PencilSquareIcon class="w-5 h-5 cursor-pointer transition hover:scale-110" />
              </button>

              <!-- Delete -->
              <button
                class="text-red-600 hover:text-red-800"
                @click="deleteProduct(row)"
                title="Delete"
              >
                <TrashIcon class="w-5 h-5 cursor-pointer transition hover:scale-110" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>

    <!-- Create / Edit Product Modal -->
    <Modal v-model:isOpen="showModal" title="Add New Product">
      <div class="space-y-4">
        <Input label="Product Name" v-model="form.name" placeholder="Enter product name" />

        <Input
          label="Description"
          type="textarea"
          v-model="form.description"
          placeholder="Enter product description"
        />

        <div class="grid grid-cols-2 gap-4">
          <Input label="Quantity" v-model="form.quantity" type="number" />

          <Input label="Price ($)" v-model="form.price" type="number" />
        </div>

        <Input
          label="Image URL"
          v-model="form.image_url"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <template #footer>
        <div class="w-full flex gap-2">
          <Button variant="primary" class="w-[80%]" @click="saveProduct"> Save Product </Button>

          <Button variant="secondary" class="w-[20%]" @click="showModal = false"> Cancel </Button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <ConfirmDelete
      v-model:isOpen="showDeleteModal"
      :productName="productToDelete?.name"
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
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { PlusIcon } from '@heroicons/vue/24/solid'

// Reactive state

const searchQuery = ref('')
const loading = ref(false)

const products = ref([])

const showModal = ref(false)
const editingProduct = ref(null)

const showDeleteModal = ref(false)
const productToDelete = ref(null)

// Form model

const form = ref({
  name: '',
  description: '',
  image_url: '',
  quantity: 0,
  price: 0,
})

// API base URL

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  '',
)

// Load Products

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
  }
}

// Create / Update Product

const saveProduct = async () => {
  try {
    const token = localStorage.getItem('token')

    const method = editingProduct.value ? 'PUT' : 'POST'

    const url = editingProduct.value
      ? `${API_BASE_URL}/products/${editingProduct.value.id}`
      : `${API_BASE_URL}/products`

    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form.value,
        quantity: Number(form.value.quantity),
        price: Number(form.value.price),
      }),
    })

    if (!response.ok) throw new Error('Save failed')

    showModal.value = false

    await loadProducts()
  } catch (err) {
    console.error(err)
  }
}

// Edit Product

const editProduct = (product) => {
  editingProduct.value = product

  form.value = {
    name: product.name,
    description: product.description,
    image_url: product.image_url,
    quantity: product.quantity,
    price: product.price,
  }

  showModal.value = true
}

// Delete product

const deleteProduct = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

// Confirm delete

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('token')

    await fetch(`${API_BASE_URL}/products/${productToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    showDeleteModal.value = false

    await loadProducts()
  } catch (err) {
    console.error(err)
  }
}

// Table headers

const tableHeaders = [
  { key: 'image', label: 'Image' },
  { key: 'name', label: 'Product Name' },
  { key: 'description', label: 'Description' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: 'Actions' },
]

// Add product

const handleAddProduct = () => {
  editingProduct.value = null

  form.value = {
    name: '',
    description: '',
    image_url: '',
    quantity: 0,
    price: 0,
  }

  showModal.value = true
}

// Lifecycle

onMounted(() => {
  loadProducts()
})
</script>

<style scoped></style>
