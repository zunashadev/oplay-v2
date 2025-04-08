import { defineStore } from 'pinia';
import { ref } from 'vue';

let idCounter = 0;

export const useToastStore = defineStore('toastStore', () => {
  const toasts = ref([]);

  const showToast = ({ message, error = null, duration = 3000 }) => {
    const id = ++idCounter;

    toasts.value.push({
      id,
      message,
      error,
      duration,
    });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
});
