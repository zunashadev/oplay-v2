<script setup>
import { ref } from 'vue';
import { useProductStore } from '@/stores/productStore';

import DialogModalComponent from '@/components/modals/DialogModal.vue';
import AlertComponent from '../alerts/Alert.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import TextAreaComponent from '@/components/form/TextArea.vue';
import FileInputComponent from '@/components/form/FileInput.vue';

// START : MODAL
const dialogModalRef = ref(null);

async function openModal(productId) {
  selectedProductId.value = productId;

  if (selectedProductId.value) {
    const data = await productStore.fetchProductById(selectedProductId.value);
    if (data) {
      product.value = data;

      // Isi form dengan data yang sudah diambil
      name.value = data.name;
      category.value = data.category;
      description.value = data.description;
      file.value = null;
    }
  }

  dialogModalRef.value.openModal();
}

function closeModal() {
  selectedProductId.value = '';
  product.value = '';
  name.value = '';
  category.value = '';
  description.value = '';
  file.value = null;

  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : EDIT PRODUCT
const productStore = useProductStore();

const selectedProductId = ref('');
const product = ref('');

const name = ref('');
const category = ref('');
const description = ref('');
const file = ref(null);

const updateProduct = async () => {
  if (!selectedProductId.value) return alert('ID produk tidak ditemukan');

  const updatedData = {
    name: name.value,
    category: category.value,
    description: description.value,
  };

  await productStore.updateProduct(selectedProductId.value, updatedData, file.value);

  if (!productStore.error) {
    closeModal(); // Tutup modal jika tidak ada error
  }
};
// END : EDIT PRODUCT
</script>

<template>
  <!-- START : MESSAGE AND ERROR -->
  <template v-if="productStore.message || productStore.error">
    <AlertComponent
      :message="productStore.message"
      :error="productStore.error"
      @close-alert="productStore.resetMessageState()"
    />
  </template>
  <!-- END : MESSAGE AND ERROR -->

  <DialogModalComponent ref="dialogModalRef" title="Edit Produk">
    <form @submit.prevent="updateProduct" class="flex flex-col gap-5">
      <div class="flex flex-col gap-2">
        <!-- Name -->
        <InputComponent v-model="name" placeholder="Masukkan nama produk" required />
        <!-- Category -->
        <InputComponent v-model="category" placeholder="Masukkan kategori produk" required />
        <!-- Description -->
        <TextAreaComponent v-model="description" placeholder="Masukkan deskripsi" required />
        <!-- File -->
        <FileInputComponent v-model="file" class="mt-3" />
      </div>

      <!-- Submit Button -->
      <ButtonComponent type="submit" variant="solid" textColor="black">
        Edit Produk
      </ButtonComponent>
    </form>
  </DialogModalComponent>
</template>
