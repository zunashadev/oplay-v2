<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// Stores
import { useOrderStore } from '@/stores/orderStore';

// Components
import TableComponent from '@/components/tables/Table.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import SelectComponent from '@/components/form/Select.vue';

// Icons
import EyeIcon from '@/components/icons/Eye.vue';
import TrashSolidIcon from '@/components/icons/TrashSolid.vue';

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrders();
});

const columns = [
  { label: 'Customer', key: 'custom-customer' }, // Custom
  { label: 'Produk', key: 'custom-product' }, // Custom
  { label: 'Paket', key: 'product_package_name' },
  { label: 'Harga', key: 'custom-price' }, // Custom
  { label: 'Durasi', key: 'product_package_duration_name' },
  { label: 'Harga Total', key: 'custom-total-price' }, // Custom
  { label: 'Bukti Pembayaran', key: 'custom-payment-proof', align: 'center' }, // Custom
  { label: 'Status', key: 'custom-status', align: 'center' }, // Custom
  { label: 'Action', key: 'action', align: 'right' }, // Custom
];

const status = [
  { id: 'pending', name: 'Pending' },
  { id: 'dibayar', name: 'Dibayar' },
  { id: 'selesai', name: 'Selesai' },
  { id: 'gagal', name: 'Gagal' },
];
</script>

<template>
  <div class="rounded-xl bg-gray-900 px-5 py-5">
    <TableComponent :columns="columns" :data="orderStore.orders">
      <!-- Customer -->
      <template #cell-custom-customer="{ row }">
        <div class="flex items-center gap-3">
          <div class="flex-none">
            <img
              v-if="row.profiles.avatar_url"
              :src="row.profiles.avatar_url"
              alt="Produk"
              class="size-10 rounded-full object-cover"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium">
              {{ row.profiles.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ row.profiles.email }}
            </p>
          </div>
        </div>
      </template>
      <!-- Produk -->
      <template #cell-custom-product="{ row }">
        <div class="flex items-center gap-3">
          <img
            v-if="row.product_image_url"
            :src="row.product_image_url"
            alt="Produk"
            class="max-h-8"
          />
          <p class="text-sm font-medium">
            {{ row.product_name }}
          </p>
        </div>
      </template>
      <!-- Harga -->
      <template #cell-custom-price="{ row }">
        <div>
          <!-- Discount -->
          <template
            v-if="
              row.product_package_discount_type &&
              row.product_package_discount_type !== '' &&
              row.product_package_discount_value > 0
            "
          >
            <div class="flex items-center gap-1">
              <p class="text-sm font-normal text-white">
                {{
                  formatRupiah(
                    calculateFinalPrice(
                      row.product_package_price,
                      row.product_package_discount_type,
                      row.product_package_discount_value,
                    ),
                  )
                }}
              </p>
              <span
                v-if="row.product_package_discount_type === 'fixed_amount'"
                class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                >-{{ formatRupiah(row.product_package_discount_value) }}</span
              >
              <span
                v-if="row.product_package_discount_type === 'percentage'"
                class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                >-{{ row.product_package_discount_value }}%</span
              >
            </div>
          </template>
          <!-- No Discount -->
          <template v-else>
            <div>
              <p class="text-sm font-normal text-gray-200">
                {{ formatRupiah(row.product_package_price) }}
              </p>
            </div>
          </template>
        </div>
      </template>
      <!-- Harga Total -->
      <template #cell-custom-total-price="{ row }">
        <div>
          <p class="text-lightning-yellow-400 text-sm font-medium">
            {{ formatRupiah(row.total_price) }}
          </p>
        </div>
      </template>
      <!-- Bukti Pembayaran -->
      <template #cell-custom-payment-proof="{ row }">
        <div v-if="row.payment_proof_image_url" class="text-center">
          <a
            :href="row.payment_proof_image_url"
            target="_blank"
            rel="noopener"
            class="text-lightning-yellow-400 hover:text-lightning-yellow-300 text-sm underline transition"
          >
            Lihat Bukti Pembayaran
          </a>
        </div>
        <div v-else class="text-center text-sm text-gray-500 italic">Belum tersedia</div>
      </template>
      <!-- Status -->
      <template #cell-custom-status="{ row }">
        <template v-if="row.status">
          <div class="flex w-max items-center gap-2">
            <template v-if="row.status">
              <p
                class="rounded-full px-3 py-1 text-center text-xs font-medium capitalize"
                :class="[
                  {
                    'text-lightning-yellow-400 bg-lightning-yellow-400/10':
                      row.status === 'pending',
                    'bg-blue-500/10 text-blue-500': row.status === 'dibayar',
                    'bg-green-500/10 text-green-500': row.status === 'selesai',
                    'bg-red-500/10 text-red-500': row.status === 'gagal',
                  },
                ]"
              >
                {{ row.status }}
              </p>
            </template>

            <SelectComponent
              class="w-full"
              v-model="row.status"
              @update:modelValue="(newStatus) => orderStore.updateOrderStatus(row.id, newStatus)"
              :options="status"
              labelKey="name"
              valueKey="id"
              placeholder="Pilih status"
              required
            >
            </SelectComponent>
          </div>
        </template>
      </template>
      <!-- Action -->
      <template #cell-action="{ row }">
        <!-- <button
          type="button"
          class="inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
          @click="onDelete(row)"
        >
          Delete
        </button> -->
        <div class="flex gap-2">
          <ButtonComponent size="xs" textColor="black" color="lightning-yellow">
            <EyeIcon class="size-4" />
          </ButtonComponent>
          <ButtonComponent
            @click="orderStore.deleteOrder(row.id)"
            size="xs"
            textColor="black"
            color="red"
          >
            <TrashSolidIcon class="size-4" />
          </ButtonComponent>
        </div>
      </template>
    </TableComponent>
  </div>
</template>
