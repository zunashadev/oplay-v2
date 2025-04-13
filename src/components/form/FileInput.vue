<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: File,
  label: {
    type: String,
    default: '',
  },
  accept: {
    type: String,
    default: '',
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
const inputRef = ref(null);

const inputId = `file-input-${Math.random().toString(36).substr(2, 9)}`;

function handleChange(event) {
  const file = event.target.files?.[0] || null;
  emit('update:modelValue', file);
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal && inputRef.value) {
      inputRef.value.value = '';
    }
  },
);
</script>

<template>
  <div class="relative">
    <!-- Label -->
    <label v-if="label" :for="inputId" class="mb-1 block text-sm text-gray-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- File Input -->
    <label class="block w-full">
      <span class="sr-only">Choose file</span>
      <input
        ref="inputRef"
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
