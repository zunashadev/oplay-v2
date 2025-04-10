<script setup>
import { ref, onMounted } from 'vue';
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

onMounted(() => {
  productStore.fetchProducts(); // Ambil daftar produk
});

const addProductPackage = async () => {
  if (!name.value || !price.value || !selectedProductId.value) return alert('Isi semua field!');

  await productPackageStore.addProductPackage(
    selectedProductId.value,
    name.value,
    price.value,
    discountType.value, // Kirim jenis diskon
    discountValue.value, // Kirim nilai diskon
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
  <DialogModalComponent ref="dialogModalRef" title="Tambah Produk">
    <div class="">
      <form @submit.prevent="addProductPackage" class="flex flex-col gap-2">
        <!-- Dropdown Pilih Produk -->
        <SelectComponent
          v-model="selectedProductId"
          :options="productStore.products"
          labelKey="name"
          valueKey="id"
          placeholder="Pilih produk"
          required
        >
        </SelectComponent>

        <!-- Name -->
        <InputComponent v-model="name" placeholder="Masukkan nama paket" type="text" required />

        <!-- Price -->
        <InputComponent v-model="price" placeholder="Masukkan harga" type="number" required />

        <!-- Diskon Type -->
        <SelectComponent
          v-model="discountType"
          :options="discountTypes"
          placeholder="Pilih jenis diskon"
        >
        </SelectComponent>

        <!-- Diskon Value -->
        <InputComponent
          v-model="discountValue"
          placeholder="Masukkan nilai diskon"
          type="number"
          :disabled="!discountType"
        />

        <!-- Is Best Seller -->
        <CheckBoxComponent v-model="isBestSeller" label="🔥 Terlaris" />

        <!-- Button -->
        <ButtonComponent type="submit" variant="solid" textColor="black">
          Tambah Produk
        </ButtonComponent>
      </form>
    </div>
  </DialogModalComponent>
</template>
