<script setup>
defineProps({
  modelValue: [String, Number],
  placeholder: {
    type: String,
    default: 'Input',
  },
  type: {
    type: String,
    default: 'text',
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
  iconPlacement: {
    type: String,
    default: '',
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
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      :required="required"
      :data-error="error"
      :data-success="success"
      :data-icon-placement="iconPlacement"
      class="peer border-blue-charcoal-800 focus:border-lightning-yellow-400 hover:border-lightning-yellow-400/50 w-full rounded-md border bg-black px-2.5 py-2 text-sm text-white shadow-sm transition-all ease-in outline-none placeholder:text-gray-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-not-allowed data-[error=true]:border-red-500 data-[icon-placement=end]:pe-9 data-[icon-placement=start]:ps-9 data-[success=true]:border-green-500"
    />
  </div>
</template>
