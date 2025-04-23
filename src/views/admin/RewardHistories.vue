<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// 📌 Stores
import { useRewardEventStore } from '@/stores/rewardEventStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Icons
import FileUploadIcon from '@/components/icons/FileUpload.vue';
import EyeIcon from '@/components/icons/Eye.vue';
import EyeSolidIcon from '@/components/icons/EyeSolid.vue';
import TrashSolidIcon from '@/components/icons/TrashSolid.vue';

// 📌 ...
const rewardEventStore = useRewardEventStore();

onMounted(() => {
  rewardEventStore.fetchAllRewardEvents();
});

// 📌 Table
import TableComponent from '@/components/tables/Table.vue';

const columns = [
  { label: 'Pengguna', key: 'custom-user' },
  { label: 'Note', key: 'note' },
  { label: 'Amount', key: 'custom-amount', align: 'center' },
  { label: 'Status', key: 'custom-status', align: 'center' },
  { label: 'Actions', key: 'actions', align: 'right' },
];

const roles = [
  { id: 'admin', name: 'Admin' },
  { id: 'customer', name: 'Customer' },
];
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : ... -->
    <div>
      <p class="text-2xl font-semibold">⏰ Riwayat Hadiah</p>
    </div>
    <!-- END : ... -->

    <!-- START : USERS TABLE -->
    <div class="rounded-xl bg-gray-900 px-5 py-5">
      <TableComponent :columns="columns" :data="rewardEventStore.rewardEvents">
        <!-- User -->
        <template #cell-custom-user="{ row }">
          <div class="flex items-center gap-3">
            <div class="flex-none">
              <img
                :src="row.profile.avatar_url || '/images/avatar.jpg'"
                alt="Avatar"
                class="size-10 rounded-full object-cover"
              />
            </div>
            <div>
              <p class="text-sm">{{ row.profile.name }}</p>
              <p class="text-xs text-gray-500">{{ row.profile.username }}</p>
            </div>
          </div>
        </template>
        <!-- Amount -->
        <template #cell-custom-amount="{ row }">
          <p class="text-lightning-yellow-400 font-semibold">+ {{ formatRupiah(row.amount) }}</p>
        </template>
        <!-- Status -->
        <template #cell-custom-status="{ row }">
          <template v-if="row.status">
            <p
              class="rounded-full px-3 py-1 text-center text-xs font-medium capitalize"
              :class="[
                {
                  // ! Perlu disesuaikan lagi
                  'text-lightning-yellow-400 bg-lightning-yellow-400/10': row.status === 'pending',
                  'bg-blue-500/10 text-blue-500': row.status === 'dibayar',
                  'bg-green-500/10 text-green-500': row.status === 'claimed',
                  'bg-red-500/10 text-red-500': row.status === 'gagal',
                },
              ]"
            >
              {{ row.status }}
            </p>
          </template>
        </template>
        <!-- Actions -->
        <template #cell-actions="{ row }">
          <div class="flex items-center gap-3">
            <div class="group hover:cursor-pointer">
              <EyeSolidIcon
                class="size-5 text-blue-500 transition-all group-hover:text-green-600"
              />
            </div>
            <div class="group hover:cursor-pointer">
              <TrashSolidIcon class="size-5 text-red-500 transition-all group-hover:text-red-600" />
            </div>
          </div>
        </template>
      </TableComponent>
    </div>
    <!-- END : USERS TABLE -->
  </div>
</template>
