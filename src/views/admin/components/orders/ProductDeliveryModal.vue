<script setup>
import { ref, onMounted, onUnmounted, watch, computed, reactive } from 'vue';

// 📌 Stores
import { useProductDeliveryStore } from '@/stores/productDeliveryStore';

// 📌 Components
import DialogModalComponent from '@/components/modals/DialogModal.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';

// 📌 Inisialisasi Stores
const productDeliveryStore = useProductDeliveryStore();

// START : MODAL
const dialogModalRef = ref(null);

async function openModal(productDeliveryId) {
  selectedProductDeliveryId.value = productDeliveryId;

  if (selectedProductDeliveryId.value) {
    const data = await productDeliveryStore.fetchProductDeliveryById(
      selectedProductDeliveryId.value,
    );

    if (data) {
      productDelivery.value = data;
      Object.assign(productDeliveryMetadataForm, data.metadata || {});
    }
  }

  dialogModalRef.value.openModal();
}

function closeModal() {
  selectedProductDeliveryId.value = null;
  productDelivery.value = {};
  Object.keys(productDeliveryMetadataForm).forEach(
    (key) => delete productDeliveryMetadataForm[key],
  );

  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : EDIT PRODUCT
const selectedProductDeliveryId = ref(null);
const productDelivery = ref({});

const productDeliveryMetadataForm = reactive({});

// Auto inisialisasi field setiap kali metadata berubah
watch(
  () => productDelivery.value?.delivery_types?.required_metadata_fields,
  (fields) => {
    if (!fields) return;
    fields.forEach((field) => {
      if (!(field in productDeliveryMetadataForm)) {
        productDeliveryMetadataForm[field] = '';
      }
    });
  },
  { immediate: true },
);

// Validasi Metadata
const metadataErrors = reactive({});

const validateMetadata = () => {
  let isValid = true;
  Object.keys(metadataErrors).forEach((key) => delete metadataErrors[key]);

  const requiredFields = productDelivery.value?.delivery_types?.required_metadata_fields || [];

  requiredFields.forEach((field) => {
    if (!productDeliveryMetadataForm[field]?.trim()) {
      metadataErrors[field] = `Field ${field} wajib diisi.`;
      isValid = false;
    } else {
      delete metadataErrors[field];
    }
  });

  return isValid;
};

const updateProductDelivery = async () => {
  if (
    productDelivery.value?.delivery_types?.direction === 'admin_to_customer' &&
    !validateMetadata()
  )
    return alert('Harap lengkapi semua data!');

  const updatedData = {
    status: 'delivered',
    metadata: productDeliveryMetadataForm,
  };

  try {
    await productDeliveryStore.updateProductDelivery(selectedProductDeliveryId.value, updatedData);
    closeModal();
  } catch (error) {
    // ...
  }
};
// END : EDIT PRODUCT
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Edit Produk">
    <div class="flex flex-col gap-8">
      <!-- START : Information -->
      <div class="flex flex-col gap-5">
        <div>
          <p class="text-sm text-gray-500">
            {{ productDelivery?.delivery_types?.direction }} -
            {{ productDelivery?.delivery_types?.key }}
          </p>
          <p class="text-xl">
            {{ productDelivery?.delivery_types?.label }}
          </p>
        </div>

        <div>
          <p class="text-sm">
            {{ productDelivery?.delivery_types?.description }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <p class="text-sm text-gray-500">Required Metadata Fields</p>
          <p class="text-sm text-gray-500">:</p>
          <p class="text-sm text-gray-500">
            {{ productDelivery?.delivery_types?.required_metadata_fields }}
          </p>
        </div>
      </div>
      <!-- END : Information -->

      <hr class="rounded-full border-gray-800" />

      <!-- START : Data -->
      <div>
        <!-- Admin to Customer -->
        <template v-if="productDelivery?.delivery_types?.direction === 'admin_to_customer'">
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <p class="text-lg font-medium">Lengkapi data berikut :</p>
            </div>
            <form @submit.prevent="updateProductDelivery" class="flex flex-col gap-5">
              <div class="flex flex-col gap-2">
                <div
                  v-for="field in productDelivery?.delivery_types?.required_metadata_fields"
                  :key="field"
                >
                  <InputComponent
                    v-model="productDeliveryMetadataForm[field]"
                    :label="field.charAt(0).toUpperCase() + field.slice(1)"
                    :placeholder="`Masukkan ${field}`"
                    :type="field.includes('password') ? 'password' : 'text'"
                    required
                  />
                </div>
              </div>

              <!-- Submit Button -->
              <ButtonComponent
                type="submit"
                variant="solid"
                textColor="black"
                :disabled="productDeliveryStore.loading"
              >
                Edit Pengiriman Produk
              </ButtonComponent>
            </form>
          </div>
        </template>

        <!-- Customer to Admin -->
        <template v-else>
          <div class="flex h-full flex-col gap-3 rounded-xl bg-gray-800 px-5 py-5">
            <div>
              <p class="text-lg font-semibold">Data Pengguna</p>
            </div>
            <div class="flex flex-col gap-1">
              <div
                v-for="[key, value] in Object.entries(productDelivery?.metadata || {})"
                :key="key"
              >
                <div class="flex gap-1">
                  <p class="capitalize">{{ key }}</p>
                  <p>:</p>
                  <p>{{ value }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- END : Data -->
    </div>
  </DialogModalComponent>
</template>
