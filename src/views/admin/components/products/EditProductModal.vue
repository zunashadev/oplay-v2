<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 📌 Stores
import { useProductStore } from '@/stores/productStore';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import { useDeliveryTypeStore } from '@/stores/deliveryTypeStore';

// 📌 Components
import DialogModalComponent from '@/components/modals/DialogModal.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import TextAreaComponent from '@/components/form/TextArea.vue';
import FileInputComponent from '@/components/form/FileInput.vue';
import SelectComponent from '@/components/form/Select.vue';
import QuillEditorComponent from '@/components/form/QuillEditor.vue';

// 📌 Inisialisasi Stores
const productCategoryStore = useProductCategoryStore();
const deliveryTypeStore = useDeliveryTypeStore();

// 📌 Fetch Categories
onMounted(() => {
  productCategoryStore.fetchCategories();
  deliveryTypeStore.fetchDeliveryTypes();
});

onUnmounted(() => {
  productCategoryStore.resetCategoriesState();
  deliveryTypeStore.resetDeliveryTypesState();
});

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
      categoryId.value = data.category_id;
      deliveryTypeId.value = data.delivery_type_id;
      description.value = data.description;
      productImageFile.value = null;
      productBannerImageFile.value = null;
    }
  }

  dialogModalRef.value.openModal();
}

function closeModal() {
  selectedProductId.value = '';
  product.value = '';
  name.value = '';
  categoryId.value = '';
  deliveryTypeId.value = '';
  description.value = '';
  productImageFile.value = null;
  productBannerImageFile.value = null;

  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : EDIT PRODUCT
const productStore = useProductStore();

const selectedProductId = ref('');
const product = ref('');

const name = ref('');
const categoryId = ref('');
const deliveryTypeId = ref('');
const description = ref('');
const productImageFile = ref(null);
const productBannerImageFile = ref(null);

const updateProduct = async () => {
  if (!selectedProductId.value) return alert('ID produk tidak ditemukan');

  const updatedData = {
    name: name.value,
    category_id: categoryId.value,
    delivery_type_id: deliveryTypeId.value,
    description: description.value,
  };

  await productStore.updateProduct(
    selectedProductId.value,
    updatedData,
    productImageFile.value,
    productBannerImageFile.value,
  );

  if (!productStore.error) {
    closeModal(); // Tutup modal jika tidak ada error
  }
};
// END : EDIT PRODUCT
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Edit Produk" maxWidth="5xl">
    <form @submit.prevent="updateProduct" class="flex flex-col gap-5">
      <div class="flex flex-col gap-5">
        <!-- Nama -->
        <InputComponent v-model="name" label="Nama" placeholder="Masukkan nama produk" required />

        <!-- Kategori -->
        <SelectComponent
          class="w-full"
          v-model="categoryId"
          :options="productCategoryStore.categories"
          label="Kategori"
          labelKey="name"
          valueKey="id"
          placeholder="Pilih kategori"
          required
        >
        </SelectComponent>

        <!-- Tipe Pengiriman -->
        <SelectComponent
          class="w-full"
          v-model="deliveryTypeId"
          :options="deliveryTypeStore.deliveryTypes"
          label="Tipe Pengiriman"
          labelKey="label"
          valueKey="id"
          placeholder="Pilih tipe pengiriman"
          required
        >
        </SelectComponent>

        <!-- Deskripsi -->
        <!-- <TextAreaComponent
          v-model="description"
          label="Deskripsi"
          placeholder="Masukkan deskripsi"
          required
        /> -->

        <QuillEditorComponent
          v-model="description"
          label="Deskripsi"
          placeholder="Masukkan deskripsi produk secara detail"
          required
        />

        <!-- Logo Produk -->
        <FileInputComponent v-model="productImageFile" label="Logo Produk" />

        <!-- Logo Produk -->
        <FileInputComponent v-model="productBannerImageFile" label="Banner Produk" />
      </div>

      <!-- Submit Button -->
      <ButtonComponent
        type="submit"
        variant="solid"
        textColor="black"
        :disabled="productStore.isUpdating"
      >
        Edit Produk
      </ButtonComponent>
    </form>
  </DialogModalComponent>
</template>
