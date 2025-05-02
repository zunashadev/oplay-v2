<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { formatRupiah } from '@/utils/format';
import { getPublicImageUrl } from '@/utils/storageHelper';

// 📌 Stores
import { useOrderStore } from '@/stores/orderStore';
import { usePaymentMethodStore } from '@/stores/paymentMethodStore';

// 📌 Components
import WaveLoaderComponent from '@/components/loaders/WaveLoader.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import FileInputComponent from '@/components/form/FileInput.vue';

import PaymentSuccessModalComponent from './components/modals/PaymentSuccessModal.vue';

// 📌 Icons
import TriangleWarningIcon from '@/components/icons/TriangleWarning.vue';

// 📌 Inisialisasi Route
const route = useRoute();

// 📌 Inisialisasi Stores
const orderStore = useOrderStore();
const paymentMethodStore = usePaymentMethodStore();

// 📌 Ambil dan Filter Payment Methods by Type
const eWalletPaymentMethods = computed(() =>
  paymentMethodStore.filterPaymentMethodsByType('e-wallet'),
);
const bankPaymentMethods = computed(() => paymentMethodStore.filterPaymentMethodsByType('bank'));
const qrisPaymentMethods = computed(() => paymentMethodStore.filterPaymentMethodsByType('qris'));

// 📌 Payment Success Modal
const paymentSuccessModalRef = ref(null);

function openPaymentSuccessModal() {
  paymentSuccessModalRef.value.openModal();
}

// 📌 Unggah Bukti Pembayaran
const file = ref(null);

const handleSubmitPaymentProof = async () => {
  const orderId = orderStore.currentOrder.id;

  if (!orderId || !file.value) return alert('Order ID atau file bukti pembayaran belum tersedia!');

  const result = await orderStore.submitPaymentProof(orderId, file.value);

  if (result) {
    file.value = null;
    openPaymentSuccessModal();
  }
};

// 📌 On Mounted
onMounted(async () => {
  const orderId = route.query.orderId;

  if (orderId) {
    await orderStore.fetchOrderById(orderId);

    const order = orderStore.currentOrder;

    if (order?.payment_proof_image_path !== null && order?.payment_proof_image_path.length > 0) {
      openPaymentSuccessModal();
    }
  }

  paymentMethodStore.fetchPaymentMethods();
});
</script>

<template>
  <PaymentSuccessModalComponent ref="paymentSuccessModalRef" />

  <template v-if="orderStore.loading">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <WaveLoaderComponent />
    </div>
  </template>

  <template v-else>
    <div class="flex flex-col gap-8 pb-12">
      <template v-if="orderStore.currentOrder">
        <div class="flex flex-col gap-10 sm:gap-12">
          <!-- START : Nominal Yang Harus Dibayar -->
          <div class="flex flex-col gap-3">
            <div
              class="flex flex-col items-center gap-2 rounded-xl border border-yellow-500 bg-gray-900 px-5 py-5"
            >
              <p>Nominal yang harus dibayar:</p>
              <p class="text-4xl font-semibold text-yellow-500">
                {{ formatRupiah(orderStore.currentOrder.total_price) }}
              </p>
            </div>
            <div class="rounded-lg border border-yellow-500 bg-yellow-500/25 px-3 py-3">
              <div class="flex items-center gap-3">
                <div class="flex-none">
                  <TriangleWarningIcon class="size-5 text-yellow-500" />
                </div>
                <p class="text-xs text-yellow-500">
                  Pilih salah satu metode pembayaran, lalu kirim bukti pembayaran melalui form yang
                  disediakan di bawah .
                </p>
              </div>
            </div>
          </div>
          <!-- END : Nominal Yang Harus Dibayar -->

          <!-- START : Daftar Metode Pembayaran -->
          <div class="flex flex-col gap-5">
            <!--  -->
            <div class="flex items-center gap-3">
              <div class="h-6 w-1 rounded-md bg-yellow-500"></div>
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
                          :src="getPublicImageUrl(item.logo_image_path)"
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
                          :src="getPublicImageUrl(item.logo_image_path)"
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
                          :src="getPublicImageUrl(item.logo_image_path)"
                          alt="Logo"
                          class="max-h-6"
                        />
                      </div>
                      <p class="text-sm">{{ item.name }}</p>
                    </div>
                    <div class="flex flex-col items-center gap-3">
                      <div class="flex-none">
                        <img
                          :src="getPublicImageUrl(item.qr_code_image_path)"
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
              <div class="h-6 w-1 rounded-md bg-yellow-500"></div>
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
              :disabled="file === null"
            >
              Unggah
            </ButtonComponent>

            <p
              class="text-center text-sm font-normal text-gray-500 transition-all hover:cursor-pointer hover:text-yellow-500"
            >
              Bayar nanti dan kembali ke halaman produk
            </p>
          </div>
          <!-- END : Unggah Bukti Pembayaran -->
        </div>
      </template>

      <template v-else>
        <div class="flex h-full flex-col items-center justify-center gap-12 py-12">
          <img src="/images/illustrations/UndrawNoData.svg" class="max-w-32 sm:max-w-52" />
          <div class="px-12">
            <p class="text-center text-sm text-gray-500">
              Maaf data pesanan tidak ditemukan, mungkin terjadi error
            </p>
          </div>
        </div>
      </template>
    </div>
  </template>
</template>
