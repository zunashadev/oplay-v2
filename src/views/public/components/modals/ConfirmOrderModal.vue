<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { getPublicImageUrl } from '@/utils/storageHelper';

import { useOrderStore } from '@/stores/orderStore';

import DialogModalComponent from '@/components/modals/DialogModal.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

const router = useRouter();
const orderStore = useOrderStore();

// Start : ...
const product = ref(null);
const pkg = ref(null);
const duration = ref(null);
const totalPrice = ref(0);
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

// Start : ...
const addOrder = async () => {
  const newOrder = await orderStore.addOrder(
    product.value,
    pkg.value,
    duration.value,
    totalPrice.value,
    'pending',
  );

  closeModal();

  router.push({ name: 'CustomerPayment', query: { orderId: newOrder?.id } });
};
// End : ...
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Konfirmasi Pesanan">
    <div class="flex flex-col gap-5">
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
          <p class="text-sm text-gray-400">{{ duration.name }}</p>
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
              <p class="text-sm font-normal text-red-500">
                <span v-if="pkg.discount_type === 'fixed_amount'">
                  -{{ formatRupiah(pkg.discount_value) }}
                </span>
                <span v-if="pkg.discount_type === 'percentage'"> -{{ pkg.discount_value }}% </span>
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
          <p class="text-lightning-yellow-400 text-xl font-normal">
            {{ formatRupiah(totalPrice) }}
          </p>
        </div>
      </div>
      <!-- END : Detail Pesanan -->

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
