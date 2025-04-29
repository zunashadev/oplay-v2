<script setup>
import { useRoute } from 'vue-router';

import BellIcon from '@/components/icons/Bell.vue';

const route = useRoute();
</script>

<template>
  <div class="flex h-16 w-full items-center px-6">
    <div class="flex w-full items-center justify-between">
      <div>
        <p class="text-xl font-medium capitalize">
          {{ route.meta.title }}
        </p>
      </div>
      <div>
        <div class="rounded-full bg-gray-900 p-2">
          <BellIcon class="size-5 text-gray-500" />
        </div>
      </div>
    </div>
  </div>
</template>
