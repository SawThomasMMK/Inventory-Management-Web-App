<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading">
          <td :colspan="headers.length" class="px-6 py-8 text-center text-gray-500">
            Loading...
          </td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="headers.length" class="px-6 py-8 text-center text-gray-500">
            No data available
          </td>
        </tr>
        <tr
          v-else
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="hover:bg-gray-50"
        >
          <td
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot
              :name="`cell-${header.key}`"
              :row="row"
              :value="row[header.key]"
            >
              {{ row[header.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true,
    default: () => [],
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped></style>
