### Vue Table Scoped Slot Fix

```html
<!-- ❌ Wrong -->
<template #cell-actions>
  <button @click="deleteOrder(row.id)">Delete</button>
</template>

<!-- ✅ Correct -->
<template #cell-actions="{ row }">
  <button @click="deleteOrder(row.id)">Delete</button>
</template>
```
