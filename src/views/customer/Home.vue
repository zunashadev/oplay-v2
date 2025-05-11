<script setup>
import { ref, onMounted } from 'vue';

import UserProfilePartial from './partials/UserProfile.vue';
import OverviewPartial from './partials/Overview.vue';
import MenuPartial from './partials/Menu.vue';
import NotificationPartial from './partials/Notification.vue';
import ActiveProductListPartial from './partials/ActiveProductList.vue';
import TransactionHistoryPartial from './partials/TransactionHistory.vue';
import UserRewardsPartial from './partials/UserRewards.vue';
</script>

<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- START : Notification ... -->
    <div class="w-full">
      <NotificationPartial />
    </div>
    <!-- END : Notification -->

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

    <hr class="rounded-full border-gray-900" />

    <!-- START : Menu -->
    <!-- <div class="reset-page-padding-x">
      <MenuPartial />
    </div> -->
    <!-- END : Menu -->

    <!-- <hr class="rounded-full border-gray-900" /> -->

    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-3 sm:flex-row">
        <!-- START : ... -->
        <div class="w-full sm:w-1/2">
          <ActiveProductListPartial />
        </div>
        <!-- END : ... -->

        <!-- START : ... -->
        <div class="w-full sm:w-1/2">
          <UserRewardsPartial />
        </div>
        <!-- END : ... -->
      </div>

      <!-- START : Riwayat Transaksi -->
      <div class="w-full">
        <TransactionHistoryPartial />
      </div>
      <!-- END : Riwayat Transaksi -->
    </div>
  </div>
</template>
