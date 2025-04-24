<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// 📌 Stores
import { useRewardSettingStore } from '@/stores/rewardSettingStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

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
</script>

<template>
  <!-- Edit Amount -->
  <EditRewardSettingAmountModalComponent ref="editRewardSettingAmountModalRef" />

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
            <div
              class="flex items-start justify-between rounded-xl bg-gray-900 px-5 py-5 transition-all"
              :class="[setting.is_active ? 'ring-lightning-yellow-400 ring' : '']"
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
                    :class="[setting.is_active ? 'text-lightning-yellow-400' : 'text-gray-500']"
                  >
                    + {{ formatRupiah(setting.amount) }}
                  </p>
                  <div
                    @click="openEditProductModal(setting.id)"
                    class="hover:text-lightning-yellow-400 text-gray-500 transition-all hover:cursor-pointer"
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
    <!-- END : Daftar Hadiah -->
  </div>
</template>
