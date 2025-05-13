<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 📌 Stores
import { useWalletStore } from '@/stores/walletStore';

// 📌 Components
import DialogModalComponent from '@/components/modals/DialogModal.vue';
import InputComponent from '@/components/form/Input.vue';
import SelectComponent from '@/components/form/Select.vue';
import CheckBoxComponent from '@/components/form/CheckBox.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

// START : MODAL
const dialogModalRef = ref(null);

async function openModal(walletId) {
  selectedWalletId.value = walletId;

  if (selectedWalletId.value) {
    const data = await walletStore.fetchWalletById(selectedWalletId.value);

    if (data) {
      wallet.value = data;
      balance.value = data.balance || 0;
    }
  }

  dialogModalRef.value.openModal();
}

function closeModal() {
  selectedWalletId.value = '';
  wallet.value = '';
  balance.value = 0;

  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : EDIT PRODUCT PACKAGE
const walletStore = useWalletStore();

const selectedWalletId = ref('');
const wallet = ref('');

const balance = ref(0);

const updateWalletBalance = async () => {
  if (!selectedWalletId.value) return alert('ID wallet tidak ditemukan');

  const updatedFields = {
    balance: balance.value,
  };

  await walletStore.updateWallet(selectedWalletId.value, updatedFields);

  if (!walletStore.error) {
    closeModal();
  }
};
// END : EDIT PRODUCT PACKAGE
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Edit Wallet Balance">
    <form @submit.prevent="updateWalletBalance" class="flex flex-col gap-2">
      <!-- Balance -->
      <InputComponent v-model="balance" placeholder="Masukkan balance" type="number" required />

      <!-- Button -->
      <ButtonComponent
        type="submit"
        variant="solid"
        textColor="black"
        :disabled="walletStore.isUpdating"
      >
        Edit Wallet Balance
      </ButtonComponent>
    </form>
  </DialogModalComponent>
</template>
