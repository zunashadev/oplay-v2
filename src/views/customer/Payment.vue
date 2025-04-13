<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// Stores
import { useOrderStore } from '@/stores/orderStore';
import { usePaymentMethodStore } from '@/stores/paymentMethodStore';

// Components
import ButtonComponent from '@/components/buttons/Button.vue';
import FileInputComponent from '@/components/form/FileInput.vue';

import PaymentSuccessModalComponent from './components/modals/PaymentSuccessModal.vue';

// Icons
import TriangleWarningIcon from '@/components/icons/TriangleWarning.vue';

const route = useRoute();
const router = useRouter();

const orderStore = useOrderStore();
const paymentMethodStore = usePaymentMethodStore();

const eWalletPaymentMethods = computed(() =>
  paymentMethodStore.filterPaymentMethodsByType('e-wallet'),
);
const bankPaymentMethods = computed(() => paymentMethodStore.filterPaymentMethodsByType('bank'));
const qrisPaymentMethods = computed(() => paymentMethodStore.filterPaymentMethodsByType('qris'));

// Payment Success Modal
const paymentSuccessModalRef = ref(null);

function openPaymentSuccessModal() {
  paymentSuccessModalRef.value.openModal();
}

function closePaymentSuccessModal() {
  paymentSuccessModalRef.value.closeModal();
}

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

// On Mounted
onMounted(async () => {
  const orderId = route.query.orderId;
  if (orderId) {
    await orderStore.fetchOrderById(orderId);

    const order = orderStore.currentOrder;

    if (order?.payment_proof_image_url !== null && order?.payment_proof_image_url.length > 0) {
      openPaymentSuccessModal();
    }
  }

  paymentMethodStore.fetchPaymentMethods();
});
</script>

<template>
  <PaymentSuccessModalComponent ref="paymentSuccessModalRef" />

  <div class="flex flex-col gap-8 px-6 pb-12 sm:px-12 md:px-24">
    <template v-if="orderStore.loading">
      <div>LOADING...</div>
    </template>

    <template v-else>
      <template v-if="orderStore.currentOrder">
        <div class="flex flex-col gap-10 sm:gap-16">
          <!-- START : Nominal Yang Harus Dibayar -->
          <div
            class="border-lightning-yellow-400 flex flex-col items-center gap-2 rounded-xl border bg-gray-900 px-5 py-5"
          >
            <p>Nominal yang harus dibayar:</p>
            <p class="text-lightning-yellow-400 text-4xl font-semibold">
              {{ formatRupiah(orderStore.currentOrder.total_price) }}
            </p>
          </div>
          <!-- END : Nominal Yang Harus Dibayar -->

          <!-- START : Cara Pembayaran -->
          <div
            class="bg-lightning-yellow-400/25 border-lightning-yellow-400 rounded-lg border px-3 py-3"
          >
            <div class="flex gap-3">
              <div class="flex-none">
                <TriangleWarningIcon class="text-lightning-yellow-400 size-5" />
              </div>
              <p class="text-lightning-yellow-400 text-xs">
                Pilih salah satu metode pembayaran, lalu kirim bukti pembayaran melalui form yang
                disediakan di bawah .
              </p>
            </div>
          </div>
          <!-- END : Cara Pembayaran -->

          <!-- START : Daftar Metode Pembayaran -->
          <div class="flex flex-col gap-5">
            <!--  -->
            <div class="flex items-center gap-3">
              <div class="bg-lightning-yellow-400 h-6 w-1 rounded-md"></div>
              <p class="text-xl font-medium">Pilih Metode Pembayaran</p>
            </div>
            <!--  -->
            <div class="flex flex-col gap-3">
              <!-- E-Wallet -->
              <template v-if="eWalletPaymentMethods && eWalletPaymentMethods.length">
                <div class="flex flex-col gap-3">
                  <p class="text-base font-medium text-gray-500">E-Wallet</p>
                  <div
                    v-for="item in eWalletPaymentMethods"
                    :key="item.id"
                    class="flex flex-col justify-between gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 sm:flex-row sm:gap-0"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex-none">
                        <img
                          v-if="item.logo_image_url"
                          :src="item.logo_image_url"
                          alt="Logo"
                          class="max-h-6"
                        />
                      </div>
                      <p class="text-sm">{{ item.name }}</p>
                    </div>
                    <div>
                      <p class="flex gap-2 text-sm">
                        {{ item.account_number }}
                        <span class="text-sm text-gray-500">({{ item.account_name }})</span>
                      </p>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Bank -->
              <template v-if="bankPaymentMethods && bankPaymentMethods.length">
                <div class="flex flex-col gap-3">
                  <p class="text-base font-medium text-gray-500">Bank</p>
                  <div
                    v-for="item in bankPaymentMethods"
                    :key="item.id"
                    class="flex flex-col justify-between gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 sm:flex-row sm:gap-0"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex-none">
                        <img
                          v-if="item.logo_image_url"
                          :src="item.logo_image_url"
                          alt="Logo"
                          class="max-h-6"
                        />
                      </div>
                      <p class="text-sm">{{ item.name }}</p>
                    </div>
                    <div>
                      <p class="flex gap-2 text-sm">
                        {{ item.account_number }}
                        <span class="text-sm text-gray-500">({{ item.account_name }})</span>
                      </p>
                    </div>
                  </div>
                </div>
              </template>

              <!-- QRIS -->
              <template v-if="qrisPaymentMethods && qrisPaymentMethods.length">
                <div class="flex flex-col gap-3">
                  <p class="text-base font-medium text-gray-500">QRIS</p>
                  <div
                    v-for="item in qrisPaymentMethods"
                    :key="item.id"
                    class="flex flex-col justify-between gap-5 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 sm:flex-row"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex-none">
                        <img
                          v-if="item.logo_image_url"
                          :src="item.logo_image_url"
                          alt="Logo"
                          class="max-h-6"
                        />
                      </div>
                      <p class="text-sm">{{ item.name }}</p>
                    </div>
                    <div class="flex flex-col items-center gap-3">
                      <div class="flex-none">
                        <img
                          v-if="item.qr_code_image_url"
                          :src="item.qr_code_image_url"
                          alt="Logo"
                          class="max-h-24"
                        />
                      </div>
                      <p class="text-sm text-gray-500">({{ item.account_name }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <!-- END : Daftar Metode Pembayaran -->

          <!-- START : Unggah Bukti Pembayaran -->
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
          <!-- END : Unggah Bukti Pembayaran -->
        </div>
      </template>
      <template v-else>
        <p>Maaf data pesanan tidak ditemukan, mungkin terjadi error</p>
      </template>
    </template>
  </div>
</template>
