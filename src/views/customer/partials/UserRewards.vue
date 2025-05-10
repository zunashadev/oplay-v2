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
import InterrogationIcon from '@/components/icons/Interrogation.vue';

// 📌 Inisialisasi Store
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
  <div class="flex h-full flex-col gap-5 rounded-xl bg-gray-900 px-5 py-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-6 w-1 rounded-md bg-yellow-500"></div>
        <p class="text-xl font-medium">Hadiah</p>
      </div>
      <div>
        <InterrogationIcon
          class="size-5 text-gray-700 transition-all hover:cursor-pointer hover:text-yellow-500"
        />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <!-- START : Loading -->
      <template v-if="rewardEventStore.loading">
        <div
          v-for="x in 2"
          :key="x"
          class="flex animate-pulse items-center justify-between gap-3 rounded-lg bg-gray-800 px-4 py-2 sm:px-5 sm:py-2.5"
        >
          <div class="flex items-center gap-3">
            <div class="flex-none">
              <div class="size-6 rounded-full bg-gray-600 sm:size-8"></div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="h-4 w-16 rounded bg-gray-600 sm:w-20"></div>
              <div class="h-3 w-24 rounded bg-gray-700 sm:w-28"></div>
            </div>
          </div>
        </div>
      </template>
      <!-- END : Loading -->

      <!-- START : Loading Done -->
      <template v-else>
        <!-- START : No Reward -->
        <template
          v-if="!rewardEventStore.rewardEvents || rewardEventStore.rewardEvents.length === 0"
        >
          <div class="flex flex-col items-center justify-center gap-1">
            <p class="text-sm text-gray-500">Belum ada hadiah untuk anda ☹️</p>
          </div>
        </template>
        <!-- END : No Reward -->

        <!-- START : Rewards -->
        <template v-else>
          <template v-for="rewardEvent in rewardEventStore.rewardEvents" :key="rewardEvent.id">
            <div
              class="flex items-center justify-between gap-3 rounded-lg bg-gray-800 px-4 py-2 sm:px-5 sm:py-2.5"
            >
              <!-- 📌 Detail -->
              <div class="flex items-center gap-3">
                <div class="flex-none">
                  <img src="/images/coin.png" class="h-6 w-auto sm:h-8" />
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-sm font-semibold text-yellow-500 sm:text-base">
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
                  size="xs"
                  textColor="black"
                  class="w-full"
                >
                  <span>Claim</span>
                </ButtonComponent>
                <ButtonComponent
                  v-else-if="rewardEvent.status == 'claimed'"
                  variant="solid"
                  size="xs"
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
                  size="xs"
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
        </template>
        <!-- END : Rewards -->
      </template>
      <!-- END : Loading Done -->
    </div>
  </div>
</template>
