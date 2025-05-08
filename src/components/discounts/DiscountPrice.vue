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
    <template v-if="hasDiscount">
      <p class="text-xs font-normal text-gray-500 line-through">
        {{ formatRupiah(price) }}
      </p>
      <p class="text-base font-normal text-yellow-500">
        {{ formatRupiah(finalPrice) }}
      </p>
      <span
        v-if="discountType === 'fixed_amount'"
        class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs text-white"
      >
        -{{ formatRupiah(discountValue) }}
      </span>
      <span
        v-else-if="discountType === 'percentage'"
        class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs text-white"
      >
        -{{ discountValue }}%
      </span>
    </template>

    <template v-else>
      <p class="text-base font-normal text-yellow-500">
        {{ formatRupiah(price) }}
      </p>
    </template>
  </div>
</template>
