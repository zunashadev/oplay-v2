<script setup>
import {
  ref,
  watch,
  onMounted,
  watchEffect,
  inject,
  defineExpose,
  onBeforeUnmount,
  computed,
} from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import emitter from '@/utils/eventBus';

// 📌 Props
const props = defineProps({
  maxWidth: {
    type: String,
    default: 'xl',
    validator: (value) =>
      ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].includes(value),
  },
});

const isOpen = ref(false);
const emit = defineEmits(['close']);

function openModal() {
  isOpen.value = true;
  emitter.emit('modal:open'); // 🔊 Kirim sinyal
}

function closeModal() {
  isOpen.value = false;
  emitter.emit('modal:close'); // 🔊 Kirim sinyal
  emit('close');
}

defineExpose({ openModal, closeModal });

// Dynamic class binding untuk max-width dan width
const widthClass = computed(() => {
  // const map = {
  //   sm: 'max-w-sm w-sm',
  //   md: 'max-w-md w-md',
  //   lg: 'max-w-lg w-lg',
  //   xl: 'max-w-xl w-xl',
  //   '2xl': 'max-w-2xl w-2xl',
  //   '3xl': 'max-w-3xl w-3xl',
  //   '4xl': 'max-w-4xl w-4xl',
  //   '5xl': 'max-w-5xl w-5xl',
  //   '6xl': 'max-w-6xl w-6xl',
  //   '7xl': 'max-w-7xl w-7xl',
  // };
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };
  return `${map[props.maxWidth]}`;
});
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-left">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full transform overflow-hidden rounded-xl shadow-xl transition-all"
              :class="widthClass"
              tabindex="0"
            >
              <slot>INI BASE BRO!</slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
