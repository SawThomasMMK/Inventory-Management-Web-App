<!-- Incorrect -->
<Modal v-model:isOpen="isOpen" />

<!-- Correct -->

<Modal
:isOpen="isOpen"
@update:isOpen="$emit('update:isOpen', $event)"
/>
