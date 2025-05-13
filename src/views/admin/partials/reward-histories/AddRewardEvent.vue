<script setup>
import { ref, onMounted, computed } from 'vue';

// 📌 Stores
import { useAuthStore } from '@/stores/authStore';
import { useRewardEventStore } from '@/stores/rewardEventStore';
import { useRewardSettingStore } from '@/stores/rewardSettingStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import SelectComponent from '@/components/form/Select.vue';
import TextAreaComponent from '@/components/form/TextArea.vue';

const authStore = useAuthStore();
const rewardSettingStore = useRewardSettingStore();
const rewardEventStore = useRewardEventStore();

onMounted(() => {
  authStore.fetchAllUsers();
  rewardSettingStore.fetchGroupedRewardSettings();
});

// 📌 Add Reward Form Fields
const userId = ref('');
const rewardSettingType = ref('');
const rewardSettingId = ref('');
const amount = ref('');
const note = ref('');

// 📌 Select user options
const userOptions = computed(() => {
  const users = authStore.users || [];

  return users.map((item) => ({
    label: `${item.profile.name} - ${item.profile.username} - ${item.email}`,
    value: item.id,
  }));
});

// 📌 Select reward setting options
const typeOptions = computed(() =>
  Object.keys(rewardSettingStore.groupedRewardSettings).map((type) => ({
    label: type,
    value: type,
  })),
);

const rewardOptions = computed(() => {
  const rewards = rewardSettingStore.groupedRewardSettings[rewardSettingType.value] || [];

  return rewards
    .filter((item) => item.is_active) // hanya reward aktif
    .map((item) => ({
      label: `${item.key} - ${item.description} (${item.amount})`,
      value: item.id,
    }));
});

// 📌 Add Reward Event
const addRewardEvent = async () => {
  if (!userId.value || !rewardSettingId.value || !amount.value || !note.value)
    return alert('Isi semua field!');

  try {
    await rewardEventStore.addRewardEvent({
      user_id: userId.value,
      reward_setting_id: rewardSettingId.value,
      amount: amount.value,
      note: note.value,
      status: 'pending',
      metadata: {
        admin_id: authStore.user.id,
        admin_name: authStore.profile.name,
        admin_username: authStore.profile.username,
      },
    });

    userId.value = '';
    rewardSettingType.value = '';
    rewardSettingId.value = '';
    amount.value = '';
    note.value = '';

    rewardEventStore.fetchAllRewardEvents();
  } catch (err) {
    // ...
  }
};
</script>

<template>
  <div class="overflow-hidden rounded-xl bg-gray-900">
    <div class="bg-gray-800 px-3 py-3">
      <p class="text-lg font-medium">➕ Tambah Reward Event</p>
    </div>

    <div class="px-5 py-5">
      <form @submit.prevent="addRewardEvent" class="flex flex-col gap-5">
        <div class="flex flex-col gap-5">
          <!-- User -->
          <SelectComponent
            class="w-full"
            v-model="userId"
            :options="userOptions"
            label="User"
            placeholder="Pilih user"
            required
          />

          <!-- Reward Setting -->
          <!-- Select: Tipe Reward -->
          <SelectComponent
            class="w-full"
            v-model="rewardSettingType"
            :options="typeOptions"
            label="Tipe"
            placeholder="Pilih tipe reward"
            required
          />

          <!-- Select: Reward berdasarkan tipe -->
          <SelectComponent
            class="w-full"
            v-model="rewardSettingId"
            :options="rewardOptions"
            label="Reward"
            placeholder="Pilih reward"
            :disabled="!rewardSettingType"
            required
          />

          <!-- Amount -->
          <InputComponent
            v-model="amount"
            type="number"
            label="Nilai"
            placeholder="Masukkan nilai reward"
            required
          />

          <!-- Note -->
          <TextAreaComponent
            v-model="note"
            label="Note"
            placeholder="Masukkan note untuk reward"
            required
          />
        </div>

        <ButtonComponent
          type="submit"
          variant="solid"
          textColor="black"
          :disabled="rewardEventStore.isCreating"
        >
          Beri Reward
        </ButtonComponent>
      </form>
    </div>
  </div>
</template>
