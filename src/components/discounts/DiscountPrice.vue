<script setup>
import { computed } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

const props = defineProps({
  price: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    default: null,
  },
  discountValue: {
    type: Number,
    default: 0,
  },
});

const hasDiscount = computed(() => {
  return props.discountType && props.discountValue > 0;
});

const finalPrice = computed(() =>
  hasDiscount.value
    ? calculateFinalPrice(props.price, props.discountType, props.discountValue)
    : props.price,
);
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- Has Discount -->
    <template v-if="hasDiscount">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <!-- Normal Price -->
        <p class="text-xs font-normal text-gray-500 line-through">
          {{ formatRupiah(price) }}
        </p>
        <!-- Final Price -->
        <p class="text-xs font-medium text-yellow-500 sm:text-base">
          {{ formatRupiah(finalPrice) }}
        </p>
      </div>
      <!-- Discount -->
      <span class="ml-1 flex-none rounded-sm bg-red-500 px-1 text-xs text-white sm:ml-2 sm:px-1.5">
        <span v-if="discountType === 'fixed_amount'"> -{{ formatRupiah(discountValue) }} </span>
        <span v-else-if="discountType === 'percentage'">-{{ discountValue }}%</span>
      </span>
    </template>

    <!-- No Discount -->
    <template v-else>
      <p class="text-xs font-medium text-yellow-500 sm:text-base">
        {{ formatRupiah(price) }}
      </p>
    </template>
  </div>
</template>
