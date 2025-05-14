<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps({
  modelValue: {
    type: [String, null],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Write something...',
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
  options: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

const quillEditor = ref(null);
let quill = null;

// Metode untuk mengatur konten editor
const setContent = (content) => {
  if (quill) {
    if (content && quill.root.innerHTML !== content) {
      quill.root.innerHTML = content;
    } else if (!content) {
      quill.root.innerHTML = '';
    }
  }
};

onMounted(() => {
  // Konfigurasi default untuk Quill editor
  const defaultOptions = {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ size: ['small', false, 'large', 'huge'] }],

        // [{ indent: '-1' }, { indent: '+1' }],
        // [{ color: [] }, { background: [] }],
        // [{ font: [] }],
        // ['link', 'image', 'video'],

        // ['blockquote'], // ! jika pakai perlu override class nya
        // [{ header: [1, 2, false] }], // ! jika pakai perlu override class nya
        // [{ list: 'ordered' }, { list: 'bullet' }], // ! Masih Error, jika sudah berhasil tambahkan override class nya
      ],
      keyboard: {
        bindings: false,
      },
    },
    placeholder: props.placeholder,
    readOnly: props.disabled,
  };

  // Menggabungkan opsi default dengan opsi kustom
  const options = {
    ...defaultOptions,
    ...props.options,
  };

  // Inisialisasi Quill editor
  quill = new Quill(quillEditor.value, options);

  // Mengisi editor dengan nilai awal
  if (props.modelValue) {
    setContent(props.modelValue);
  }

  // Event handler untuk perubahan teks
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML);
  });
});

// Memperbarui konten saat prop modelValue berubah
watch(
  () => props.modelValue,
  (newValue) => {
    if (quill && newValue !== quill.root.innerHTML) {
      setContent(newValue);
    }
  },
);

// Memperbarui status disabled saat props berubah
watch(
  () => props.disabled,
  (newValue) => {
    if (quill) {
      quill.enable(!newValue);
    }
  },
);

onBeforeUnmount(() => {
  // Membersihkan Quill instance saat komponen dihapus
  if (quill) {
    quill = null;
  }
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- Label -->
    <label v-if="label" class="mb-1 block text-sm text-gray-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative w-full">
      <div
        ref="quillEditor"
        class="quill-editor peer rounded-md border border-gray-700 bg-black text-white shadow-sm transition-all ease-in outline-none hover:border-yellow-500/50 focus:border-yellow-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        :class="{
          'border-red-500': error,
          'border-green-500': success,
        }"
      ></div>
    </div>
  </div>
</template>

<style>
/* Sesuaikan styling Quill dengan tema dark */
.quill-editor {
  height: 300px;
}

/* Override beberapa style Quill untuk menyesuaikan dengan tema dark */
:deep(.ql-toolbar.ql-snow) {
  border: 1px solid #374151;
  border-bottom: none;
  background-color: #1f2937;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

:deep(.ql-container.ql-snow) {
  border: 1px solid #374151;
  border-top: none;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  background-color: #111827;
  color: white;
}

:deep(.ql-editor.ql-blank::before) {
  color: #6b7280;
}

:deep(.ql-picker) {
  color: #d1d5db;
}

:deep(.ql-stroke) {
  stroke: #d1d5db;
}

:deep(.ql-fill) {
  fill: #d1d5db;
}

:deep(.ql-picker-options) {
  background-color: #1f2937;
  border-color: #374151;
}

:deep(.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options) {
  border-color: #374151;
}

:deep(.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label) {
  border-color: #374151;
}

:deep(.ql-snow .ql-tooltip) {
  background-color: #1f2937;
  border-color: #374151;
  color: white;
}

:deep(.ql-snow .ql-tooltip input[type='text']) {
  background-color: #111827;
  border-color: #374151;
  color: white;
}

:deep(.ql-snow a) {
  color: #3b82f6;
}
</style>
