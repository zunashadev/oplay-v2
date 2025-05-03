<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 📌 ...
import { getPublicImageUrl } from '@/utils/storageHelper';
import { formatRupiah } from '@/utils/format';

// 📌 Stores
import { useWalletStore } from '@/stores/walletStore';

// 📌 Components
import TableComponent from '@/components/tables/Table.vue';
import ButtonCompnent from '@/components/buttons/Button.vue';

import EditWalletBalanceModalComponent from './components/wallets/modals/EditWalletBalanceModal.vue';

// 📌 Icons
// ...

const walletStore = useWalletStore();

onMounted(() => {
  walletStore.fetchWallets();
});

onUnmounted(() => {
  walletStore.resetWalletsState();
});

// 📌 Wallets Table
const columns = [
  { label: 'Pengguna', key: 'custom-user' },
  { label: 'Balance', key: 'custom-balance' },
  { label: 'Actions', key: 'actions', align: 'right' },
];

// 📌 Edit Wallet Balance
const editWalletBalanceModalRef = ref(null);

function openEditWalletBalanceModal(walletId) {
  editWalletBalanceModalRef.value.openModal(walletId);
}
</script>

<template>
  <!-- Edit Product -->
  <EditWalletBalanceModalComponent ref="editWalletBalanceModalRef" />

  <div class="flex flex-col gap-5">
    <!-- START : WALLETS TABLE -->
    <div class="rounded-xl bg-gray-900 px-5 py-5">
      <TableComponent :columns="columns" :data="walletStore.wallets">
        <!-- Pengguna -->
        <template #cell-custom-user="{ row }">
          <div class="flex items-center gap-3">
            <div class="flex-none">
              <img
                :src="getPublicImageUrl(row.profiles.avatar_image_path, 'avatar')"
                alt="Avatar"
                class="size-10 rounded-full object-cover"
              />
            </div>
            <div>
              <p class="text-sm">{{ row.profiles.name }}</p>
              <p class="text-xs text-gray-500">{{ row.profiles.username }}</p>
            </div>
          </div>
        </template>

        <!-- Balance -->
        <template #cell-custom-balance="{ row }">
          <div class="flex justify-start">
            <p class="text-lightning-yellow-400 font-semibold">{{ formatRupiah(row.balance) }}</p>
          </div>
        </template>

        <!-- Actions -->
        <template #cell-actions="{ row }">
          <div class="flex items-center justify-end gap-3">
            <ButtonCompnent @click="openEditWalletBalanceModal(row.id)" size="xs" textColor="black">
              Ubah Balance
            </ButtonCompnent>
          </div>
        </template>
      </TableComponent>
    </div>
    <!-- END : WALLETS TABLE -->
  </div>
</template>
