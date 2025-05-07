<script setup>
defineProps({
  modelValue: [String, Number],
  label: {
    type: String,
    default: '',
  },
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
  // INI HANYA AKAN BERJALAN JIKA MENGGUNAKAN <FORM > DENGAN TOMBOL 'SUBMIT'
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- 📌 Label -->
    <label v-if="label" class="block text-sm text-gray-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- 📌 Field -->
    <div class="relative w-full">
      <!-- Slot untuk icon di kiri -->
      <div
        v-if="iconPlacement === 'start'"
        class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
      >
        <slot name="icon-start" />
      </div>

      <!-- Input Utama -->
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
        class="peer border-blue-charcoal-800 w-full rounded-md border bg-black px-2.5 py-2 text-sm text-white shadow-sm transition-all ease-in outline-none placeholder:text-gray-500 hover:border-yellow-500/50 focus:border-yellow-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-not-allowed data-[error=true]:border-red-500 data-[icon-placement=end]:pe-9 data-[icon-placement=start]:ps-9 data-[success=true]:border-green-500"
      />

      <!-- Slot untuk icon di kanan -->
      <div
        v-if="iconPlacement === 'end'"
        class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:cursor-pointer"
      >
        <slot name="icon-end" />
      </div>
    </div>
  </div>
</template>
