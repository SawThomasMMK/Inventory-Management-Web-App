<template>
  <Modal
    :isOpen="isOpen"
    :title="title || 'Confirm Delete'"
    @update:isOpen="$emit('update:isOpen', $event)"
  >
    <p class="text-gray-700">
      Are you sure you want to delete
      <span class="font-semibold text-red-600"> "{{ productName }}" </span>
      ?
    </p>
    <template #footer>
      <div class="flex w-full gap-2">
        <Button variant="danger" class="w-[50%]" @click="$emit('confirm')"> Delete </Button>

        <Button variant="secondary" class="w-[50%]" @click="$emit('update:isOpen', false)">
          Cancel
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'

defineProps({
  isOpen: Boolean,
  productName: String,
  title: {
    type: String,
    default: 'Confirm Delete',
  },
})

defineEmits(['confirm', 'update:isOpen'])
</script>
