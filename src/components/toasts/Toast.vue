<script setup>
import { defineProps, defineEmits, onMounted } from 'vue';

// 📌 Icons
import CrossIcon from '@/components/icons/Cross.vue'; // atau ganti dengan ikon close lain
import TriangleWarningIcon from '../icons/TriangleWarning.vue';
import BadgeCheckIcon from '../icons/BadgeCheck.vue';

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
    <div class="w-full rounded-lg bg-gray-800 p-3 text-white shadow-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div class="rounded-md bg-gray-700 p-2">
            <TriangleWarningIcon v-if="error" class="size-5 text-red-500" />
            <BadgeCheckIcon v-else class="size-5 text-green-500" />
          </div>
          <!-- Main Content -->
          <div class="flex flex-col gap-1 pe-2">
            <p class="text-xs">{{ message }}</p>
            <p v-if="error" class="text-xs text-gray-500">{{ error }}</p>
          </div>
        </div>
        <!-- Close -->
        <button
          @click="closeAlert"
          class="rounded-md p-1 transition hover:cursor-pointer hover:bg-gray-700"
        >
          <CrossIcon class="size-5" />
        </button>
      </div>
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
