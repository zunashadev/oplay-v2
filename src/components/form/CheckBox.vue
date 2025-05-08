<script setup>
defineProps({
  modelValue: Boolean,
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: () => `checkbox-${Math.random().toString(36).substr(2, 9)}`,
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
  <div class="inline-flex items-center">
    <label class="relative flex cursor-pointer items-center" :for="id">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        @change="emit('update:modelValue', $event.target.checked)"
        :disabled="disabled"
        :required="required"
        class="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-700 shadow-sm transition-all checked:border-yellow-600 checked:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-black opacity-0 peer-checked:opacity-100"
      >
        <svg
          fill="none"
          width="18px"
          height="18px"
          stroke-width="2"
          color="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13L9 17L19 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </label>
    <label class="ml-2 cursor-pointer font-normal text-white antialiased" :for="id">
      {{ label }}
    </label>
  </div>
</template>
