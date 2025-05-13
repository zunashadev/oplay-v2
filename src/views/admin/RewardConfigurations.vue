<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// 📌 Stores
import { useRewardSettingStore } from '@/stores/rewardSettingStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
import WaveLoaderComponent from '@/components/loaders/WaveLoader.vue';
import GeometryLoaderComponent from '@/components/loaders/GeometryLoader.vue';

import EditRewardSettingAmountModalComponent from './components/modals/EditRewardSettingAmountModal.vue';

// 📌 Icons
import PencilIcon from '@/components/icons/Pencil.vue';

// 📌 ...
const rewardSettingStore = useRewardSettingStore();

onMounted(() => {
  rewardSettingStore.fetchGroupedRewardSettings();
});

const toggleActive = async (id, currentStatus) => {
  await rewardSettingStore.toggleRewardSettingStatus(id, !currentStatus);
};

// 📌 Edit Amount Modal
const editRewardSettingAmountModalRef = ref(null);

function openEditProductModal(id) {
  editRewardSettingAmountModalRef.value.openModal(id);
}

// 📌 Generate Reward Settings
function generateRewardSettings() {
  rewardSettingStore.generateRewardSettings();
}
</script>

<template>
  <!-- Edit Amount -->
  <EditRewardSettingAmountModalComponent ref="editRewardSettingAmountModalRef" />

  <div class="flex flex-col gap-12">
    <!-- START : Loading -->
    <template v-if="rewardSettingStore.isFetchingList">
      <div class="flex h-96 w-full items-center justify-center">
        <GeometryLoaderComponent />
      </div>
    </template>
    <!-- END : Loading -->

    <!-- START : Lodaing Done -->
    <template v-else>
      <!-- START : Generate Reward Settings -->
      <template v-if="Object.keys(rewardSettingStore.groupedRewardSettings).length === 0">
        <div class="flex flex-col items-center gap-3">
          <ButtonComponent
            @click="generateRewardSettings()"
            size="sm"
            textColor="black"
            class="w-fit"
          >
            Generate Reward Configurations (Reward Settings)
          </ButtonComponent>
          <div class="rounded-lg border border-red-500 bg-red-500/10 px-5 py-2">
            <p class="text-center text-sm text-red-500">
              Tombol ini berfungsi untuk mengenerate reward configurations (reward settings). Ini
              hanya dapat dipakai ketika tabel 'reward_settings' kosong.
            </p>
          </div>
        </div>
      </template>
      <!-- END : Generate Reward Settings -->

      <!-- START : Daftar Hadiah -->
      <template v-else>
        <div class="flex flex-col gap-12">
          <template v-for="(items, type) in rewardSettingStore.groupedRewardSettings" :key="type">
            <div class="flex flex-col gap-3">
              <!-- START : Type -->
              <div class="flex items-center">
                <div class="flex items-center gap-3">
                  <div class="h-6 w-1 rounded-md bg-yellow-500"></div>
                  <p class="text-xl font-medium uppercase">{{ type }}</p>
                </div>
              </div>
              <!-- END : Type -->

              <!-- START : Key -->
              <template v-for="setting in items" :key="setting.key">
                <div
                  class="flex items-start justify-between rounded-xl px-5 py-5 transition-all"
                  :class="[setting.is_active ? 'bg-gray-800 ring ring-yellow-500' : 'bg-gray-900']"
                >
                  <div class="flex flex-col gap-5">
                    <div>
                      <p
                        class="transition-all"
                        :class="[setting.is_active ? 'text-white' : 'text-gray-500']"
                      >
                        {{ setting.key }}
                      </p>
                      <p
                        class="text-sm transition-all"
                        :class="[setting.is_active ? 'text-gray-500' : 'text-gray-700']"
                      >
                        {{ setting.description }}
                      </p>
                    </div>
                    <div class="flex items-center gap-3">
                      <p
                        class="font-semibold transition-all"
                        :class="[setting.is_active ? 'text-yellow-500' : 'text-gray-500']"
                      >
                        + {{ formatRupiah(setting.amount) }}
                      </p>
                      <div
                        @click="openEditProductModal(setting.id)"
                        class="text-gray-500 transition-all hover:cursor-pointer hover:text-yellow-500"
                      >
                        <PencilIcon class="size-3" />
                      </div>
                    </div>
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
      </template>
      <!-- END : Daftar Hadiah -->
    </template>
    <!-- END : Lodaing Done -->
  </div>
</template>
