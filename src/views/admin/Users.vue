<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

// Components
import SelectComponent from '@/components/form/Select.vue';

// Icons
import EyeSolidIcon from '@/components/icons/EyeSolid.vue';
import TrashSolidIcon from '@/components/icons/TrashSolid.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchAllUsers();
});

// START : TABLE
import TableComponent from '@/components/tables/Table.vue';

const columns = [
  { label: 'Avatar', key: 'custom-profile-avatar' },
  { label: 'Nama', key: 'custom-profile-name' },
  { label: 'Username', key: 'profile.username' },
  { label: 'Referral', key: 'profile.referral_code' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'custom-profile-role', align: 'center' },
  { label: 'Actions', key: 'actions', align: 'right' },
];

const roles = [
  { id: 'admin', name: 'Admin' },
  { id: 'customer', name: 'Customer' },
];
// END : TABLE
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : ... -->
    <div>
      <p class="text-2xl font-semibold">👥 Daftar User</p>
    </div>
    <!-- END : ... -->

    <!-- START : USERS TABLE -->
    <div class="rounded-xl bg-gray-900 px-5 py-5">
      <TableComponent :columns="columns" :data="authStore.users">
        <!-- Avatar -->
        <template #cell-custom-profile-avatar="{ row }">
          <div class="flex-none">
            <img
              :src="row.profile.avatar_url || '/images/avatar.jpg'"
              alt="Produk"
              class="size-10 rounded-full object-cover"
            />
          </div>
        </template>
        <!-- Name -->
        <template #cell-custom-profile-name="{ row }">
          <p class="text-lightning-yellow-400">{{ row.profile.name }}</p>
        </template>
        <!-- Role -->
        <template #cell-custom-profile-role="{ row }">
          <div class="flex w-max">
            <SelectComponent
              class="w-full"
              v-model="row.profile.role"
              @update:modelValue="(newRole) => authStore.updateUserRole(row.id, newRole)"
              :options="roles"
              labelKey="name"
              valueKey="id"
              placeholder="Pilih role"
              required
            >
            </SelectComponent>
          </div>
        </template>
        <!-- Actions -->
        <template #cell-actions="{ row }">
          <div class="flex items-center gap-3">
            <div class="group hover:cursor-pointer">
              <EyeSolidIcon
                class="size-5 text-green-500 transition-all group-hover:text-green-600"
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
