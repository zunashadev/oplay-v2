<script setup>
import { ref, onMounted } from 'vue';

// 📌 Stores
import { useRewardSettingStore } from '@/stores/rewardSettingStore';

// 📌 Components
import DialogModalComponent from '@/components/modals/DialogModal.vue';
import InputComponent from '@/components/form/Input.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 START : Modal
const dialogModalRef = ref(null);

async function openModal(rewardSettingId) {
  selectedRewardSettingId.value = rewardSettingId;

  if (selectedRewardSettingId.value) {
    const data = await rewardSettingStore.fetchRewardSettingById(selectedRewardSettingId.value);

    if (data) {
      rewardSetting.value = data;
      amount.value = data.amount || 0;
    }
  }

  dialogModalRef.value.openModal();
}

function closeModal() {
  rewardSetting.value = '';
  amount.value = 0;

  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// 📌 END : Modal

// 📌 START : Edit Amount
const rewardSettingStore = useRewardSettingStore();

const selectedRewardSettingId = ref('');
const rewardSetting = ref('');

const amount = ref('');

const updateRewardSettingAmount = async () => {
  if (!selectedRewardSettingId.value) return alert("ID 'Reward Setting' tidak ditemukan");

  await rewardSettingStore.updateRewardSettingAmount(selectedRewardSettingId.value, amount.value);

  if (!rewardSettingStore.error) {
    closeModal(); // Tutup modal jika tidak ada error
  }
};
// 📌 END : Edit Amount
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Edit Amount">
    <form @submit.prevent="updateRewardSettingAmount" class="flex flex-col gap-2">
      <!-- Price -->
      <InputComponent v-model="amount" placeholder="Masukkan nominal" type="number" required />

      <!-- Button -->
      <ButtonComponent type="submit" variant="solid" textColor="black">
        Edit Nominal
      </ButtonComponent>
    </form>
  </DialogModalComponent>
</template>
