<script setup>
import { ref, onMounted } from 'vue';

// 📌 Stores
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';

// 📌 Components
import DialogModalComponent from '@/components/modals/DialogModal.vue';
import InputComponent from '@/components/form/Input.vue';
import SelectComponent from '@/components/form/Select.vue';
import CheckBoxComponent from '@/components/form/CheckBox.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

// START : MODAL
const dialogModalRef = ref(null);

async function openModal(packageId) {
  selectedPackageId.value = packageId;

  if (selectedPackageId.value) {
    const data = await productPackageStore.getProductPackageById(selectedPackageId.value);
    if (data) {
      pkg.value = data;

      // Isi form dengan data yang sudah diambil
      name.value = data.name;
      price.value = data.price;
      selectedProductId.value = data.product_id;
      discountType.value = data.discount_type || '';
      discountValue.value = data.discount_value || 0;
      isBestSeller.value = data.is_best_seller || false;
    }
  }

  dialogModalRef.value.openModal();
}

function closeModal() {
  selectedPackageId.value = '';
  pkg.value = '';
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

// START : EDIT PRODUCT PACKAGE
const productStore = useProductStore();
const productPackageStore = useProductPackageStore();

const selectedPackageId = ref('');
const pkg = ref('');

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

onMounted(async () => {
  productStore.fetchProducts(); // Ambil daftar produk
});

const updateProductPackage = async () => {
  if (!selectedPackageId.value) return alert('ID paket tidak ditemukan');

  const updatedFields = {
    product_id: selectedProductId.value,
    name: name.value,
    price: Number(price.value),
    discount_type: discountType.value || null,
    discount_value: Number(discountValue.value),
    is_best_seller: isBestSeller.value,
  };

  await productPackageStore.updateProductPackage(selectedPackageId.value, updatedFields);

  if (!productPackageStore.error) {
    closeModal(); // Tutup modal jika tidak ada error
  }
};
// END : EDIT PRODUCT PACKAGE
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Edit Paket Produk">
    <form @submit.prevent="updateProductPackage" class="flex flex-col gap-2">
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
        Edit Produk
      </ButtonComponent>
    </form>
  </DialogModalComponent>
</template>
