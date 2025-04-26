<script setup>
import { defineProps, defineEmits, onMounted } from 'vue';

// 📌 Icons
import CrossIcon from '@/components/icons/Cross.vue'; // atau ganti dengan ikon close lain
import TriangleWarningIcon from '../icons/TriangleWarning.vue';

const props = defineProps({
  message: String,
  error: String,
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(['close-alert']);

const closeAlert = () => {
  emit('close-alert');
};

onMounted(() => {
  setTimeout(closeAlert, props.duration);
});
</script>

<template>
  <transition name="toast" appear>
    <div
      class="flex w-full flex-col gap-1 rounded-lg p-3 text-black shadow-lg"
      :class="error ? 'bg-red-500' : 'bg-green-500'"
    >
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium">{{ message }}</p>
        <button
          @click="closeAlert"
          class="rounded-md p-1 transition hover:cursor-pointer hover:bg-white/20"
        >
          <CrossIcon class="size-5" />
        </button>
      </div>
      <p v-if="error" class="text-xs">{{ error }}</p>
    </div>
  </transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
