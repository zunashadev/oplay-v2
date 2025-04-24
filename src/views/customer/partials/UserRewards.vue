<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// 📌 Stores
import { useRewardEventStore } from '@/stores/rewardEventStore';
import { useWalletStore } from '@/stores/walletStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Icons
import FileUploadIcon from '@/components/icons/FileUpload.vue';
import EyeIcon from '@/components/icons/Eye.vue';

// 📌 ...
const rewardEventStore = useRewardEventStore();
const walletStore = useWalletStore();

onMounted(() => {
  rewardEventStore.fetchRewardEventsByUser();
});

const handleClaim = async (id) => {
  const result = await rewardEventStore.claimRewardEvent(id);
  if (result) {
    console.log('Reward berhasil diklaim!');
    await rewardEventStore.fetchRewardEventsByUser(); // refresh data
    await walletStore.fetchWalletByUser(); // refresh data
  }
};
</script>

<template>
  <div class="flex flex-col gap-5 rounded-xl bg-gray-900 px-5 py-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-lightning-yellow-400 h-6 w-1 rounded-md"></div>
        <p class="text-xl font-medium">Daftar Hadiah</p>
      </div>
      <!-- <div>tools</div> -->
    </div>
    <div class="flex flex-col gap-3">
      <template v-for="rewardEvent in rewardEventStore.rewardEvents" :key="rewardEvent.id">
        <div
          class="flex items-center justify-between gap-3 rounded-lg bg-gray-800 px-3 py-2 sm:px-5 sm:py-2.5"
        >
          <!-- 📌 Detail -->
          <div class="flex items-center gap-3">
            <div class="flex-none">
              <img src="/images/coin.png" class="h-6 w-auto sm:h-8" />
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-lightning-yellow-400 text-sm font-semibold sm:text-base">
                + {{ formatRupiah(rewardEvent.amount) }}
              </p>
              <p class="text-xs text-gray-500 sm:text-sm">{{ rewardEvent.note }}</p>
            </div>
          </div>
          <!-- 📌 Button -->
          <div class="w-24 flex-none">
            <ButtonComponent
              v-if="rewardEvent.status == 'pending'"
              @click="handleClaim(rewardEvent.id)"
              variant="solid"
              size="sm"
              textColor="black"
              class="w-full"
            >
              <span>Claim</span>
            </ButtonComponent>
            <ButtonComponent
              v-else-if="rewardEvent.status == 'claimed'"
              variant="solid"
              size="sm"
              color="gray"
              textColor="black"
              disabled
              class="w-full"
            >
              <span>Claimed</span>
            </ButtonComponent>
            <ButtonComponent
              v-else-if="rewardEvent.status == 'rejected'"
              variant="solid"
              size="sm"
              color="red"
              textColor="black"
              disabled
              class="w-full"
            >
              <span>Rejected</span>
            </ButtonComponent>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
