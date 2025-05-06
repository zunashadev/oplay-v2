<script setup>
import { ref, onMounted } from 'vue';

import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { getPublicImageUrl } from '@/utils/storageHelper';

// 📌 Stores
import { useOrderStore } from '@/stores/orderStore';

// 📌 Components
import TableComponent from '@/components/tables/Table.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import SelectComponent from '@/components/form/Select.vue';

import ProductDeliveryModalComponent from '../../components/orders/ProductDeliveryModal.vue';

// 📌 Icons
import EyeSolidIcon from '@/components/icons/EyeSolid.vue';
import TrashSolidIcon from '@/components/icons/TrashSolid.vue';
import EditIcon from '@/components/icons/Edit.vue';
import TrashIcon from '@/components/icons/Trash.vue';
import ShippingFastIcon from '@/components/icons/ShippingFast.vue';

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrders();
});

const columns = [
  { label: 'Customer', key: 'custom-customer' },
  { label: 'Produk', key: 'custom-product' },
  // { label: 'Paket', key: 'product_package_name' },
  // { label: 'Harga', key: 'custom-price' },
  { label: 'Durasi', key: 'product_package_duration_name' },
  { label: 'Harga Total', key: 'custom-total-price' },
  { label: 'Bukti Pembayaran', key: 'custom-payment-proof', align: 'center' },
  // { label: 'Pengiriman Produk', key: 'custom-product-delivery', align: 'center' },
  { label: 'Status Pengiriman Produk', key: 'product_deliveries.status', align: 'center' },
  { label: 'Status', key: 'custom-status', align: 'center' },
  { label: 'Action', key: 'action', align: 'right' },
];

const status = [
  { id: 'pending', name: 'Pending' },
  { id: 'dibayar', name: 'Dibayar' },
  { id: 'selesai', name: 'Selesai' },
  { id: 'gagal', name: 'Gagal' },
];

// 📌 Product Delivery
const productDeliveryModalRef = ref(null);

function openProductDeliveryModal(productDeliveryId) {
  productDeliveryModalRef.value.openModal(productDeliveryId);
}
</script>

<template>
  <!-- Product Delivery -->
  <ProductDeliveryModalComponent ref="productDeliveryModalRef" />

  <div class="rounded-xl bg-gray-900 px-5 py-5">
    <TableComponent :columns="columns" :data="orderStore.orders">
      <!-- Customer -->
      <template #cell-custom-customer="{ row }">
        <div class="flex items-center gap-3">
          <div class="flex-none">
            <img
              :src="getPublicImageUrl(row.profiles.avatar_image_path, 'avatar')"
              alt="Produk"
              class="size-10 rounded-full object-cover"
            />
          </div>
          <div class="flex flex-col">
            <p class="text-sm font-medium">
              {{ row.profiles.name }}
            </p>
            <p class="text-xs text-gray-500">{{ row.profiles.username }}</p>
          </div>
        </div>
      </template>

      <!-- Produk -->
      <template #cell-custom-product="{ row }">
        <div class="flex flex-col gap-5">
          <!-- Product -->
          <div class="flex items-center gap-3">
            <img
              :src="getPublicImageUrl(row.product_image_path, 'product')"
              alt="Produk"
              class="max-h-8"
            />
            <p class="text-base font-medium">
              {{ row.product_name }}
            </p>
          </div>

          <!-- Product Package -->
          <div class="flex flex-col gap-2">
            <!-- Product Package Name -->
            <div class="flex flex-col text-xs">
              <p class="text-xs text-gray-500">Paket :</p>
              <p>{{ row.product_package_name }}</p>
            </div>
            <!-- Product Package Price -->
            <div class="flex flex-col">
              <p class="text-xs text-gray-500">Harga :</p>
              <!-- Discount -->
              <template
                v-if="
                  row.product_package_discount_type &&
                  row.product_package_discount_type !== '' &&
                  row.product_package_discount_value > 0
                "
              >
                <div class="flex items-center gap-1">
                  <p class="text-xs font-normal text-white">
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
                  <p class="text-xs font-normal text-gray-200">
                    {{ formatRupiah(row.product_package_price) }}
                  </p>
                </div>
              </template>
            </div>
          </div>
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

      <!-- Pengiriman Produk -->
      <!-- <template #cell-custom-product-delivery="{ row }">
        <div class="flex flex-col gap-3 rounded-xl bg-gray-900 px-5 py-5">
          <div class="flex w-max text-sm">
            <div class="flex flex-col gap-1">
              <div>
                <div class="w-fit text-start text-xs font-medium text-gray-500">
                  Tipe Pengiriman
                </div>
                <div class="w-fit">{{ row.product_deliveries.delivery_type_id }}</div>
              </div>

              <div>
                <div class="w-fit text-start text-xs font-medium text-gray-500">Status</div>
                <div class="w-fit">{{ row.product_deliveries.status }}</div>
              </div>
            </div>
          </div>

          <hr class="border-gray-700" />

          <div class="flex w-max text-sm">
            <div class="flex flex-col gap-1">
              <div>
                <div class="w-fit text-start text-xs font-medium text-gray-500">
                  Tanggal Pengiriman
                </div>
                <div class="w-fit">
                  <span v-if="row.product_deliveries.delivery_at">
                    {{ row.product_deliveries.delivery_at }}
                  </span>
                  <span v-else>-</span>
                </div>
              </div>

              <div>
                <div class="w-fit text-start text-xs font-medium text-gray-500">
                  Informasi Tambahan
                </div>
                <div class="w-fit">{{ row.product_deliveries.metadata }}</div>
              </div>
            </div>
          </div>

          <hr class="border-gray-700" />

          <ButtonComponent size="xs" textColor="black">Kirim Produk</ButtonComponent>
        </div>
      </template> -->

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
        <div class="flex justify-end divide-x divide-gray-500">
          <div class="pr-5">
            <!-- Deliver -->
            <ButtonComponent
              @click="openProductDeliveryModal(row.product_deliveries.id)"
              variant="link"
              size="xs"
              color="blue"
            >
              <ShippingFastIcon class="size-4" />
            </ButtonComponent>
          </div>

          <div class="flex gap-2 pl-5">
            <!-- Edit -->
            <ButtonComponent variant="link" size="xs">
              <EditIcon class="size-4" />
            </ButtonComponent>
            <!-- Delete -->
            <ButtonComponent
              @click="orderStore.deleteOrder(row.id)"
              variant="link"
              size="xs"
              color="red"
            >
              <TrashIcon class="size-4" />
            </ButtonComponent>
          </div>
        </div>
      </template>
    </TableComponent>
  </div>
</template>
