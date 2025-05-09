<script setup>
import { ref, computed } from 'vue';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';

// 📌 Icons
import CheckIcon from '../icons/Check.vue';
import AnglesUpDownIcon from '../icons/AnglesUpDown.vue';

const props = defineProps({
  modelValue: [String, Number, Object],
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

// Selected object based on current modelValue
const selected = computed({
  get() {
    return props.options.find((opt) => opt[props.valueKey] === props.modelValue) || null;
  },
  set(val) {
    if (props.modelValue === val[props.valueKey]) {
      emit('update:modelValue', null);
    } else {
      emit('update:modelValue', val[props.valueKey]);
    }
  },
});
</script>

<template>
  <div class="relative w-full">
    <label v-if="label" class="mb-1 block text-sm text-gray-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <Listbox v-model="selected" :disabled="disabled">
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-md border border-gray-700 bg-black py-2 pr-10 pl-3 text-left text-sm shadow-sm transition-all duration-300 ease-in outline-none hover:cursor-pointer hover:border-yellow-500/50 focus:border-yellow-500 focus:ring-0 focus:outline-none"
          :class="[
            error ? 'border-red-500' : '',
            success ? 'border-green-500' : '',
            disabled ? 'pointer-events-none opacity-50' : '',
          ]"
        >
          <span class="block truncate">
            {{ selected ? selected[labelKey] : placeholder }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <AnglesUpDownIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            <ListboxOption
              v-for="(option, index) in options"
              :key="index"
              :value="option"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  'relative cursor-default py-2 pr-10 pl-4 select-none',
                  active ? 'bg-gray-700 text-yellow-500' : 'text-white',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium text-yellow-500' : 'font-normal',
                    'block truncate',
                  ]"
                >
                  {{ option[labelKey] }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-yellow-500"
                >
                  <CheckIcon class="h-4 w-4" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
