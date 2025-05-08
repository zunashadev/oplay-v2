<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { getPublicImageUrl } from '@/utils/storageHelper';

import { useOrderStore } from '@/stores/orderStore';

import DialogModalComponent from '@/components/modals/DialogModal.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';

const router = useRouter();
const orderStore = useOrderStore();

// Start : ...
const product = ref(null);
const pkg = ref(null);
const duration = ref(null);
const totalPrice = ref(0);

const productDeliveryMetadataForm = reactive({});

// Auto inisialisasi field setiap kali metadata berubah
watch(
  () => product.value?.delivery_types?.required_metadata_fields,
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

  const requiredFields = product.value?.delivery_types?.required_metadata_fields || [];

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
// End : ...

// Start : ...
const addOrder = async () => {
  if (product.value?.delivery_types?.direction === 'customer_to_admin' && !validateMetadata())
    return alert('Harap lengkapi semua data!');

  const newOrder = await orderStore.addOrder(
    product.value,
    pkg.value,
    duration.value,
    totalPrice.value,
    'pending',
    productDeliveryMetadataForm,
  );

  closeModal();

  router.push({ name: 'CustomerPayment', query: { orderId: newOrder?.id } });
};
// End : ...

// Start : Modal
const dialogModalRef = ref(null);

function openModal(data) {
  product.value = data.product;
  pkg.value = data.pkg;
  duration.value = data.duration;
  totalPrice.value = data.totalPrice;

  dialogModalRef.value.openModal();
}

function closeModal() {
  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// End : Modal
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Konfirmasi Pesanan" maxWidth="5xl">
    <div class="flex w-full flex-col gap-5">
      <div class="flex w-full flex-col gap-5 sm:flex-row">
        <!-- START : Order Detail -->
        <div class="flex w-full flex-col gap-5 sm:w-1/2">
          <!-- START : Produk -->
          <div class="flex items-center gap-5">
            <img
              :src="getPublicImageUrl(product.product_image_path, 'product')"
              alt="Produk"
              class="max-h-12"
            />
            <div class="flex flex-col gap-1">
              <p class="text-xl font-semibold">
                {{ product.name }}
              </p>
              <p class="text-sm text-gray-400">{{ pkg.name }}</p>
            </div>
          </div>
          <!-- END : Produk -->

          <hr class="rounded-full border-gray-800" />

          <!-- START : Detail Pesanan -->
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-1">
              <!-- Harga Normal -->
              <div class="flex items-center justify-between">
                <p class="text-sm font-normal text-gray-400">Harga Normal</p>
                <p class="text-sm font-normal text-white">{{ formatRupiah(pkg.price) }}</p>
              </div>
              <template v-if="pkg.discount_type && pkg.discount_value">
                <!-- Diskon -->
                <div class="flex items-center justify-between">
                  <p class="text-sm font-normal text-gray-400">Diskon</p>
                  <p class="text-sm font-normal text-white">
                    <span v-if="pkg.discount_type === 'fixed_amount'">
                      -{{ formatRupiah(pkg.discount_value) }}
                    </span>
                    <span v-if="pkg.discount_type === 'percentage'">
                      -{{ pkg.discount_value }}%
                    </span>
                  </p>
                </div>
                <!-- Harga Setelah Diskon -->
                <div class="flex items-center justify-between">
                  <p class="text-sm font-normal text-gray-400">Harga Setelah Diskon</p>
                  <p class="text-sm font-normal text-white">
                    {{
                      formatRupiah(
                        calculateFinalPrice(pkg.price, pkg.discount_type, pkg.discount_value),
                      )
                    }}
                  </p>
                </div>
              </template>
              <!-- Durasi -->
              <div class="flex items-center justify-between">
                <p class="text-sm font-normal text-gray-400">Durasi</p>
                <p class="text-sm font-normal text-white">{{ duration.name }}</p>
              </div>
            </div>

            <hr class="rounded-full border-gray-800" />

            <!-- Total Harga -->
            <div class="flex items-center justify-between">
              <p class="text-sm font-normal text-gray-400">Total Harga</p>
              <p class="text-xl font-normal text-yellow-500">
                {{ formatRupiah(totalPrice) }}
              </p>
            </div>
          </div>
          <!-- END : Detail Pesanan -->
        </div>
        <!-- END : Order Detail -->

        <hr class="rounded-full border-gray-800 sm:hidden" />

        <!-- START : Delivery Type Metadata -->
        <div class="w-full sm:w-1/2">
          <!-- Customer to Admin -->
          <template v-if="product.delivery_types.direction === 'customer_to_admin'">
            <div class="flex h-full flex-col gap-6 rounded-md bg-gray-800 px-5 py-5">
              <div class="flex flex-col gap-1">
                <p class="sm:text-md text-base font-medium">Lengkapi data berikut :</p>
                <p class="text-xs text-gray-500 sm:text-sm">
                  {{ product.delivery_types.label }} - {{ product.delivery_types.description }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <div v-for="field in product.delivery_types.required_metadata_fields" :key="field">
                  <InputComponent
                    v-model="productDeliveryMetadataForm[field]"
                    :label="field.charAt(0).toUpperCase() + field.slice(1)"
                    :placeholder="`Masukkan ${field}`"
                    :type="field.includes('password') ? 'password' : 'text'"
                    required
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Admin to Customer -->
          <template v-else>
            <div class="flex h-full items-center justify-center">
              <div class="rounded-md border border-red-500 bg-red-500/10 px-5 py-5">
                <p class="text-center text-xs text-red-500 sm:text-sm">
                  Akun akan dikirim setelah anda mengirim
                  <span class="font-semibold">bukti pembayaran</span>.
                </p>
              </div>
            </div>
          </template>
        </div>
        <!-- END : Delivery Type Metadata -->
      </div>

      <hr class="rounded-full border-gray-800" />

      <!-- Confirm Button -->
      <div class="flex">
        <ButtonComponent
          @click="addOrder"
          type="button"
          variant="solid"
          textColor="black"
          class="w-full"
        >
          Konfirmasi Pemesanan
        </ButtonComponent>
      </div>
    </div>
  </DialogModalComponent>
</template>
