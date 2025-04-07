<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

import LogOutIcon from '@/components/icons/LogOut.vue';

const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrdersByUser();
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push({ name: 'AuthLogin' });
  } catch (error) {
    console.error('Logout gagal');
    console.error(error);
  }
};
</script>

<template>
  <div class="flex h-[2000px] flex-col gap-5 px-24 py-0">
    <div class="flex gap-5">
      <!-- START : ... -->
      <div
        class="w-3/4 overflow-hidden rounded-xl bg-gradient-to-b from-gray-200/50 via-gray-400/50 to-gray-600/50 p-[1px]"
      >
        <div
          class="flex items-start justify-between gap-6 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 px-8 py-8"
        >
          <div class="flex gap-10">
            <div class="flex-none">
              <img
                v-if="authStore.profile && authStore.profile?.avatar_url"
                alt="User Avatar"
                :src="authStore.profile?.avatar_url"
                class="size-24 rounded-full object-cover"
              />
              <img
                v-else
                alt="User Avatar"
                src="/images/avatar.jpg"
                class="size-24 rounded-full object-cover"
              />
            </div>
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-5">
                <div class="flex-none border-l-4 ps-4">
                  <p class="text-4xl font-semibold">{{ authStore.profile?.name || 'Guest' }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="flex w-full items-center justify-center space-x-3 rounded-md bg-red-700 px-6 py-1.5 text-sm text-white transition-all hover:cursor-pointer hover:bg-red-800"
                >
                  <span> Logout </span>
                  <LogOutIcon class="size-4 text-white" />
                </button>
              </div>
              <div class="flex flex-col gap-2">
                <!-- Username -->
                <div class="flex flex-col">
                  <p class="text-sm font-normal text-gray-500">Username</p>
                  <p class="text-base font-normal">{{ authStore.profile?.username || '-' }}</p>
                </div>
                <!-- Email -->
                <div class="flex flex-col">
                  <p class="text-sm font-normal text-gray-500">Email</p>
                  <p class="text-base font-normal">{{ authStore.user?.email || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
          <RouterLink
            :to="{ name: 'CustomerDashboardEditProfile' }"
            class="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold transition-all hover:cursor-pointer hover:bg-gray-600"
          >
            Edit Profile
          </RouterLink>
        </div>
      </div>
      <!-- END : ... -->
      <!-- START : ... -->
      <div
        class="from-lightning-yellow-400 to-lightning-yellow-500 flex w-1/4 flex-col gap-6 rounded-xl bg-gradient-to-b px-6 py-6 text-black"
      >
        <div class="flex h-full w-full flex-col justify-between">
          <div class="flex justify-between">
            <p>💰 Reward</p>
            <button
              class="bg-lightning-yellow-300 hover:bg-lightning-yellow-200 rounded-md px-3 py-2 text-sm font-semibold transition-all hover:cursor-pointer"
            >
              Gunakan
            </button>
          </div>
          <p class="text-3xl font-semibold">Rp.500.000</p>
        </div>
      </div>
      <!-- END : ... -->
    </div>

    <!-- START : ... -->
    <div class="flex flex-col gap-5 rounded-xl bg-gray-800 px-5 py-5">
      <div>
        <p class="flex gap-3 text-xl font-normal">
          <span>🧾</span>
          <span>Riwayat Transaksi</span>
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <template v-for="order in orderStore.orders" :key="order.id">
          <div class="flex flex-col gap-5 rounded-xl bg-gray-900 px-5 py-5">
            <!-- START : HEADER -->
            <div class="flex items-center justify-between">
              <!--  -->
              <div class="flex items-center gap-3">
                <img
                  v-if="order.product_image_url"
                  :src="order.product_image_url"
                  alt="Produk"
                  class="max-h-8"
                />
                <p class="text-base font-medium">
                  {{ order.product_name }}
                </p>
              </div>
              <!--  -->
              <div class="flex items-center gap-3">
                <p
                  class="rounded-full bg-gray-600 px-3 py-0.5 text-sm font-medium text-gray-400 capitalize"
                >
                  {{ order.status }}
                </p>
              </div>
            </div>
            <!-- END : HEADER -->

            <!-- START : BODY -->
            <div class="flex gap-16">
              <!--  -->
              <div>
                <p class="text-sm font-normal text-gray-400">Paket</p>
                <p class="text-sm font-medium text-white">{{ order.product_package_name }}</p>
              </div>
              <!--  -->
              <div>
                <p class="text-sm font-normal text-gray-400">Harga</p>

                <!-- Discount -->
                <template
                  v-if="
                    order.product_package_discount_type &&
                    order.product_package_discount_type !== '' &&
                    order.product_package_discount_value > 0
                  "
                >
                  <div class="flex items-center gap-1">
                    <p class="text-sm font-normal text-gray-400 line-through">
                      {{ formatRupiah(order.product_package_price) }}
                    </p>
                    <p class="text-lightning-yellow-400 text-sm font-normal">
                      {{
                        formatRupiah(
                          calculateFinalPrice(
                            order.product_package_price,
                            order.product_package_discount_type,
                            order.product_package_discount_value,
                          ),
                        )
                      }}
                    </p>
                    <span
                      v-if="order.product_package_discount_type === 'fixed_amount'"
                      class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                      >-{{ formatRupiah(order.product_package_discount_value) }}</span
                    >
                    <span
                      v-if="order.product_package_discount_type === 'percentage'"
                      class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                      >{{ order.product_package_discount_value }}%</span
                    >
                  </div>
                </template>
                <!-- No Discount -->
                <template v-else>
                  <div>
                    <p class="text-base font-normal text-gray-200">
                      {{ formatRupiah(order.product_package_price) }}
                    </p>
                  </div>
                </template>
              </div>
              <!--  -->
              <div>
                <p class="text-sm font-normal text-gray-400">Durasi</p>
                <p class="text-sm font-medium text-white">
                  {{ order.product_package_duration_name }}
                </p>
              </div>
              <!--  -->
              <div>
                <p class="text-sm font-normal text-gray-400">Total Harga</p>
                <p class="text-sm font-medium text-white">{{ formatRupiah(order.total_price) }}</p>
              </div>
            </div>
            <!-- END : BODY -->
          </div>
        </template>
      </div>
    </div>
    <!-- END : ... -->
  </div>
</template>
