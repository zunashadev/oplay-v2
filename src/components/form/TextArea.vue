<script setup>
defineProps({
  modelValue: String,
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Enter your message...',
  },
  rows: {
    type: Number,
    default: 8,
  },
  error: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative w-full">
    <!-- Label -->
    <label v-if="label" class="mb-1 block text-sm text-gray-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Text Area -->
    <textarea
      :rows="rows"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      :required="required"
      :data-error="error"
      :data-success="success"
      class="peer border-blue-charcoal-800 hover:border-lightning-yellow-400/50 focus:border-lightning-yellow-400 block w-full resize-none rounded-md border bg-black px-2.5 py-2 text-sm leading-none text-white shadow-sm transition-all duration-300 ease-in outline-none placeholder:text-gray-500 focus:ring-0 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[error=true]:border-red-500 data-[success=true]:border-green-500"
    ></textarea>
  </div>
</template>
