<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';

import DialogModalComponent from '@/components/modals/DialogModal.vue';
import InputComponent from '@/components/form/Input.vue';
import SelectComponent from '@/components/form/Select.vue';
import CheckBoxComponent from '@/components/form/CheckBox.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

// START : MODAL
const dialogModalRef = ref(null);

function openModal(productId) {
  selectedProductId.value = productId;

  dialogModalRef.value.openModal();
}

function closeModal() {
  name.value = '';
  price.value = '';
  selectedProductId.value = '';
  discountType.value = '';
  discountValue.value = 0;
  isBestSeller.value = false;

  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : ADD PRODUCT PACKAGE
const productStore = useProductStore();
const productPackageStore = useProductPackageStore();

const name = ref('');
const price = ref('');
const selectedProductId = ref('');
const discountType = ref(''); // 'percentage' atau 'fixed_amount'
const discountValue = ref(0); // Nilai diskon
const isBestSeller = ref(false);

const discountTypes = [
  { label: 'Tidak ada', value: '' },
  { label: 'Persentase (%)', value: 'percentage' },
  { label: 'Potongan Harga (Rp)', value: 'fixed_amount' },
];

watch(discountType, (newVal) => {
  if (!newVal) {
    discountValue.value = 0;
  }
});

onMounted(() => {
  productStore.fetchProducts();
});

onUnmounted(() => {
  productStore.resetProductsState();
});

const addProductPackage = async () => {
  if (!name.value || !price.value || !selectedProductId.value) return alert('Isi semua field!');

  await productPackageStore.addProductPackage(
    selectedProductId.value,
    name.value,
    price.value,
    discountType.value ? discountType.value : null,
    discountType.value ? Number(discountValue.value) : 0,
    isBestSeller.value,
  );

  // Reset form jika berhasil
  if (!productPackageStore.error) {
    name.value = '';
    price.value = '';
    discountType.value = '';
    discountValue.value = 0;
    isBestSeller.value = false;
  }

  // Tutup modal
  closeModal();
};
// END : ADD PRODUCT PACKAGE
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Tambah Paket Produk">
    <div class="">
      <form @submit.prevent="addProductPackage" class="flex flex-col gap-2">
        <!-- Dropdown Pilih Produk -->
        <SelectComponent
          v-model="selectedProductId"
          label="Produk"
          :options="productStore.products"
          labelKey="name"
          valueKey="id"
          placeholder="Pilih produk"
          required
        >
        </SelectComponent>

        <!-- Name -->
        <InputComponent
          v-model="name"
          label="Nama Paket"
          placeholder="Masukkan nama paket"
          type="text"
          required
        />

        <!-- Price -->
        <InputComponent
          v-model="price"
          label="Harga"
          placeholder="Masukkan harga"
          type="number"
          required
        />

        <!-- Diskon Type -->
        <SelectComponent
          v-model="discountType"
          label="Tipe Diskon"
          :options="discountTypes"
          placeholder="Pilih jenis diskon"
        >
        </SelectComponent>

        <!-- Diskon Value -->
        <InputComponent
          v-model="discountValue"
          label="Nilai Diskon"
          placeholder="Masukkan nilai diskon"
          type="number"
          :disabled="!discountType"
          :required="!!discountType"
        />

        <!-- Is Best Seller -->
        <CheckBoxComponent v-model="isBestSeller" label="🔥 Terlaris" />

        <!-- Button -->
        <ButtonComponent
          type="submit"
          variant="solid"
          textColor="black"
          :disabled="productPackageStore.isCreating"
        >
          Tambah Paket Produk
        </ButtonComponent>
      </form>
    </div>
  </DialogModalComponent>
</template>
