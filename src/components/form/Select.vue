<script setup>
defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  valueKey: {
    type: String,
    default: 'value',
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

    <!-- Select -->
    <select
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      :required="required"
      :data-error="error"
      :data-success="success"
      class="peer border-blue-charcoal-800 hover:border-lightning-yellow-400/50 focus:border-lightning-yellow-400 block w-full appearance-none rounded-md border bg-black py-2 ps-2.5 pe-12 text-sm text-white shadow-sm transition-all duration-300 ease-in outline-none placeholder:text-gray-500 hover:cursor-pointer focus:ring-0 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[error=true]:border-red-500 data-[success=true]:border-green-500"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="(option, index) in options" :key="index" :value="option[valueKey]">
        {{ option[labelKey] }}
      </option>
    </select>

    <!-- Custom Arrow -->
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M10 14a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 11.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0110 14z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>
