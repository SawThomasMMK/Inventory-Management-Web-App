<!-- Incorrect: modal inside table row -->

<template #cell-actions="{ row }">
<ConfirmDelete ... />
</template>

<!-- Correct: modal rendered once -->
<Table ... />

<ConfirmDelete
v-model:isOpen="showDeleteModal"
:productName="productToDelete?.name"
@confirm="confirmDelete"
/>
