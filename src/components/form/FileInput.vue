<script setup>
defineProps({
  modelValue: File,
  accept: {
    type: String,
    default: '', // contoh: 'image/*' atau 'application/pdf'
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

function handleChange(event) {
  const file = event.target.files?.[0] || null;
  emit('update:modelValue', file);
}
</script>

<template>
  <div class="relative w-full">
    <label class="block w-full">
      <span class="sr-only">Choose file</span>
      <input
        type="file"
        :accept="accept"
        :disabled="disabled"
        :required="required"
        @change="handleChange"
        :data-error="error"
        :data-success="success"
        class="hover:file:bg-lightning-yellow-500 block w-full cursor-pointer text-sm text-white transition-all file:me-4 file:rounded-lg file:border-0 file:bg-gray-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:cursor-pointer hover:file:cursor-pointer hover:file:transition-all file:disabled:pointer-events-none file:disabled:opacity-50 data-[error=true]:file:bg-red-500 data-[success=true]:file:bg-green-600"
      />
    </label>
  </div>
</template>
