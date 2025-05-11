<script setup>
import { ref, toRefs } from 'vue';
import { getPublicImageUrl } from '@/utils/storageHelper';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Props
const props = defineProps({
  delivery: Object,
  onConfirm: Function,
});

// 📌 Extract property
const { delivery } = toRefs(props);

// 📌 Format Key
const formatKey = (key) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>

<template>
  <div class="flex flex-col gap-3 rounded-lg bg-gray-800 px-4 py-3 sm:px-5 sm:py-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img
          :src="getPublicImageUrl(delivery.orders.product_image_path, 'product')"
          alt="Produk"
          class="max-h-6"
        />
        <p class="text-sm">- {{ delivery.orders.product_name }}</p>
      </div>

      <div
        class="rounded-full px-2.5 py-1 text-xs capitalize"
        :class="{
          'bg-yellow-500/10 text-yellow-500': delivery.status === 'pending',
          'bg-blue-500/10 text-blue-500': delivery.status === 'delivered',
          'bg-green-500/10 text-green-500': delivery.status === 'confirmed',
          'bg-red-500/10 text-red-500': delivery.status === 'failed',
          'bg-gray-500/10 text-gray-500': !['pending', 'delivered', 'confirmed', 'failed'].includes(
            delivery.status,
          ),
        }"
      >
        {{ delivery.status }}
      </div>
    </div>

    <hr class="rounded-full border-gray-700" />

    <div class="flex flex-col gap-2">
      <p class="font-medium">{{ delivery.delivery_types.label }}</p>
      <div class="flex flex-col gap-1">
        <div
          v-for="[key, value] in Object.entries(delivery?.metadata || {})"
          :key="key"
          class="flex items-center gap-1"
        >
          <p class="text-sm text-gray-500 capitalize">{{ formatKey(key) }} :</p>
          <p v-if="value" class="text-sm">{{ value }}</p>
          <p v-else class="text-sm text-red-500">Belum tersedia</p>
        </div>
      </div>
    </div>

    <hr class="rounded-full border-gray-700" />

    <template v-if="delivery.status === 'delivered'">
      <div class="flex flex-col items-center justify-end gap-1 sm:flex-row sm:gap-3">
        <ButtonComponent
          @click="onConfirm(delivery.id)"
          size="xs"
          color="green"
          textColor="black"
          class="w-full sm:w-1/2"
        >
          Konfirmasi Produk
        </ButtonComponent>
        <ButtonComponent size="xs" color="red" textColor="black" class="w-full sm:w-1/2">
          Ajukan Pengembalian
        </ButtonComponent>
      </div>
    </template>
  </div>
</template>
