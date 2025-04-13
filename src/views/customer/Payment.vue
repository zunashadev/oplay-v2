<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// Stores
import { useOrderStore } from '@/stores/orderStore';

// Components
import ButtonComponent from '@/components/buttons/Button.vue';
import FileInputComponent from '@/components/form/FileInput.vue';

import PaymentSuccessModalComponent from './components/modals/PaymentSuccessModal.vue';

const route = useRoute();
const router = useRouter();

const orderStore = useOrderStore();

// Payment Success Modal
const paymentSuccessModalRef = ref(null);

function openPaymentSuccessModal() {
  paymentSuccessModalRef.value.openModal();
}

function closePaymentSuccessModal() {
  paymentSuccessModalRef.value.closeModal();
}

onMounted(async () => {
  const orderId = route.query.orderId;
  if (orderId) {
    await orderStore.fetchOrderById(orderId);

    const order = orderStore.currentOrder;

    if (order?.payment_proof_image_url !== null && order?.payment_proof_image_url.length > 0) {
      openPaymentSuccessModal();
    }
  }
});

// Unggah Bukti Pembayaran
const file = ref(null);

const handleSubmitPaymentProof = async () => {
  const orderId = route.query.orderId;

  if (!orderId || !file.value) {
    alert('Order ID atau file bukti pembayaran belum tersedia!');
    return;
  }

  const result = await orderStore.submitPaymentProof(orderId, file.value);

  if (result) {
    alert('Bukti pembayaran berhasil diunggah!');
    file.value = null;
  }
};
</script>

<template>
  <PaymentSuccessModalComponent ref="paymentSuccessModalRef" />

  <div class="flex flex-col gap-8 px-6 pb-12 sm:px-12 md:px-24">
    <template v-if="orderStore.loading">
      <div>LOADING...</div>
    </template>
    <template v-else>
      <template v-if="orderStore.currentOrder">
        <div class="flex flex-col gap-16">
          <!--  -->
          <div
            class="border-lightning-yellow-400 flex flex-col items-center gap-2 rounded-xl border bg-gray-900 px-5 py-5"
          >
            <p>Nominal yang harus dibayar:</p>
            <p class="text-lightning-yellow-400 text-4xl font-semibold">
              {{ formatRupiah(orderStore.currentOrder.total_price) }}
            </p>
          </div>
          <!--  -->
          <div class="flex flex-col gap-5">
            <!--  -->
            <div class="flex items-center gap-3">
              <div class="bg-lightning-yellow-400 h-6 w-1 rounded-md"></div>
              <p class="text-xl font-medium">Pilih Metode Pembayaran</p>
            </div>
            <!--  -->
            <div class="flex flex-col gap-3">
              <!-- E-Wallet -->
              <div class="flex flex-col gap-3">
                <p class="text-base font-medium text-gray-500">E-Wallet</p>
                <div
                  class="flex justify-between rounded-xl border border-gray-800 bg-gray-900 px-5 py-3"
                >
                  <div class="flex items-center gap-3">
                    <div>LOGO</div>
                    <p>Link Aja</p>
                  </div>
                  <p>081906157620</p>
                </div>
                <div
                  class="flex justify-between rounded-xl border border-gray-800 bg-gray-900 px-5 py-3"
                >
                  <div class="flex items-center gap-3">
                    <div>LOGO</div>
                    <p>Dana</p>
                  </div>
                  <p>081906157620</p>
                </div>
              </div>
              <!-- Bank -->
              <div class="flex flex-col gap-3">
                <p class="text-base font-medium text-gray-500">Bank</p>
                <div
                  class="flex justify-between rounded-xl border border-gray-800 bg-gray-900 px-5 py-3"
                >
                  <div class="flex items-center gap-3">
                    <div>LOGO</div>
                    <p>Mandiri (a/n FAISHAL AMMAR DWI WIJAYA)</p>
                  </div>
                  <p>1431432413jhkjhkh</p>
                </div>
                <div
                  class="flex justify-between rounded-xl border border-gray-800 bg-gray-900 px-5 py-3"
                >
                  <div class="flex items-center gap-3">
                    <div>LOGO</div>
                    <p>Mandiri (a/n FAISHAL AMMAR DWI WIJAYA)</p>
                  </div>
                  <p>1431432413jhkjhkh</p>
                </div>
              </div>
              <!-- QRIS -->
              <div class="flex flex-col gap-3">
                <p class="text-base font-medium text-gray-500">QRIS</p>
                <div
                  class="flex justify-between rounded-xl border border-gray-800 bg-gray-900 px-5 py-3"
                >
                  <div class="flex items-center gap-3">
                    <!-- <div>LOGO</div> -->
                    <p>Ini belum tau</p>
                  </div>
                  <!-- <p>1431432413jhkjhkh</p> -->
                </div>
              </div>
            </div>
          </div>
          <!--  -->
          <div class="flex flex-col gap-5">
            <!--  -->
            <div class="flex items-center gap-3">
              <div class="bg-lightning-yellow-400 h-6 w-1 rounded-md"></div>
              <p class="text-xl font-medium">Unggah Bukti Pembayaran</p>
            </div>
            <div
              class="rounded-xl border-2 border-dashed border-gray-800 bg-gray-900 px-5 py-5 text-center"
            >
              <div class="flex items-center justify-center">
                <FileInputComponent v-model="file" />
              </div>
            </div>

            <ButtonComponent
              @click="handleSubmitPaymentProof"
              type="button"
              variant="solid"
              textColor="black"
            >
              Unggah
            </ButtonComponent>

            <p
              class="hover:text-lightning-yellow-400 text-center text-sm font-normal text-gray-500 transition-all hover:cursor-pointer"
            >
              Bayar nanti dan kembali ke halaman produk
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <p>Maaf data pesanan tidak ditemukan, mungkin terjadi error</p>
      </template>
    </template>
  </div>
</template>
