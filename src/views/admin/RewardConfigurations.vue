<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// 📌 Stores
import { useRewardSettingStore } from '@/stores/rewardSettingStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Icons
// ...

// 📌 ...
const rewardSettingStore = useRewardSettingStore();

onMounted(() => {
  rewardSettingStore.fetchGroupedRewardSettings();
});

const toggleActive = async (id, currentStatus) => {
  console.log(id, currentStatus);
  await rewardSettingStore.toggleRewardSettingStatus(id, !currentStatus);
};
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- START : ... -->
    <div>
      <p class="text-2xl font-semibold">🎁 Konfigurasi Hadiah</p>
    </div>
    <!-- END : ... -->

    <!-- START : Daftar Hadiah -->
    <div class="flex flex-col gap-12">
      <template v-for="(items, type) in rewardSettingStore.groupedRewardSettings" :key="type">
        <div class="flex flex-col gap-3">
          <!-- START : Type -->
          <div class="flex items-center">
            <div class="flex items-center gap-3">
              <div class="bg-lightning-yellow-400 h-6 w-1 rounded-md"></div>
              <p class="text-xl font-medium uppercase">{{ type }}</p>
            </div>
          </div>
          <!-- END : Type -->

          <!-- START : Key -->
          <template v-for="setting in items" :key="setting.key">
            <div class="flex items-start justify-between rounded-xl bg-gray-900 px-5 py-5">
              <div class="flex flex-col gap-5">
                <div>
                  <p class="">{{ setting.key }}</p>
                  <p class="text-sm text-gray-500">{{ setting.description }}</p>
                </div>
                <p class="text-lightning-yellow-400 font-semibold">
                  + {{ formatRupiah(setting.amount) }}
                </p>
              </div>
              <div>
                <ButtonComponent
                  v-if="!setting.is_active"
                  @click="toggleActive(setting.id, setting.is_active)"
                  size="sm"
                  textColor="black"
                >
                  Aktifkan
                </ButtonComponent>
                <ButtonComponent
                  v-else
                  @click="toggleActive(setting.id, setting.is_active)"
                  size="sm"
                  textColor="black"
                  color="red"
                >
                  Matikan
                </ButtonComponent>
              </div>
            </div>
          </template>
          <!-- END : Key -->
        </div>
      </template>
    </div>
    <!-- END : Daftar Hadiah -->
  </div>
</template>
