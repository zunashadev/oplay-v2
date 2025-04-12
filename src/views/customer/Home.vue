<script setup>
import { ref, onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';

import UserProfilePartial from './partials/UserProfile.vue';
import OverviewPartial from './partials/Overview.vue';
import NotificationPartial from './partials/Notification.vue';
import ActiveAccountListPartial from './partials/ActiveAccountList.vue';
import TransactionHistoryPartial from './partials/TransactionHistory.vue';

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrdersByUser();
});
</script>

<template>
  <div class="flex flex-col gap-5 px-6 pb-12 sm:px-12">
    <!-- START : ... -->
    <!-- <div class="w-full">
      <UserProfilePartial />
    </div> -->
    <!-- END : ... -->

    <!-- START : Overview -->
    <div class="w-full">
      <OverviewPartial />
    </div>
    <!-- END : Overview -->

    <!-- START : Notification ... -->
    <div class="w-full">
      <NotificationPartial />
    </div>
    <!-- END : Notification -->

    <!-- START : ... -->
    <div class="w-full">
      <ActiveAccountListPartial />
    </div>
    <!-- END : ... -->

    <!-- START : Riwayat Transaksi -->
    <div class="w-full">
      <TransactionHistoryPartial />
    </div>
    <!-- END : Riwayat Transaksi -->
  </div>
</template>
