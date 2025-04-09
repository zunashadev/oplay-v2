<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

import SelectComponent from '@/components/form/Select.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchAllProfiles();
});

const roles = [
  { id: 'admin', name: 'Admin' },
  { id: 'customer', name: 'Customer' },
];
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : ... -->
    <div>
      <p class="text-2xl font-semibold">👥 Daftar User</p>
    </div>
    <!-- END : ... -->

    <!-- START : USERS TABLE -->
    <div class="rounded-2xl bg-gray-900 px-5 py-5">
      <div class="relative overflow-x-auto sm:rounded-lg">
        <table class="w-full text-left text-sm text-gray-400">
          <thead class="bg-gray-800 text-xs text-white uppercase">
            <tr>
              <th scope="col" class="px-6 py-3">Avatar</th>
              <th scope="col" class="px-6 py-3">Name</th>
              <th scope="col" class="px-6 py-3">Username</th>
              <th scope="col" class="px-6 py-3">Email</th>
              <th scope="col" class="px-6 py-3">Role</th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in authStore.profiles"
              :key="user.id"
              class="border-b border-gray-800 bg-gray-900 hover:bg-gray-800"
            >
              <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                <img
                  alt="User Avatar"
                  :src="user.avatar_url || '/images/avatar.jpg'"
                  class="size-10 rounded-full object-cover"
                />
              </th>
              <td class="px-6 py-4">{{ user.name }}</td>
              <td class="px-6 py-4">{{ user.username }}</td>
              <td class="px-6 py-4">--Email</td>
              <td class="px-6 py-4">
                <SelectComponent
                  v-model="user.role"
                  @update:modelValue="(newRole) => authStore.updateUserRole(user.id, newRole)"
                  :options="roles"
                  labelKey="name"
                  valueKey="id"
                  placeholder="Pilih role"
                  required
                >
                </SelectComponent>
              </td>
              <td class="px-6 py-4 text-right">
                <a href="#" class="font-medium text-blue-600 hover:underline">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- END : USERS TABLE -->
  </div>
</template>
