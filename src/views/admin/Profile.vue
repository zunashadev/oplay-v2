<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

import PenSquareIcon from '@/components/icons/PenSquare.vue';

// Inisialisasi store dan router
const authStore = useAuthStore();

// State untuk form
const name = ref('');
const email = ref('');

// Fungsi update profil
const updateProfile = async () => {
  try {
    await authStore.updateProfile({ name: name.value });
  } catch (error) {
    console.error('Edit profile gagal');
  } finally {
    name.value = '';
  }
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- START : ... -->
    <div class="flex gap-6 rounded-md border-2 border-dashed border-gray-200 px-4 py-6">
      <div class="flex-none">
        <img
          alt="User Avatar"
          src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          class="size-32 rounded-md object-cover"
        />
      </div>
      <table class="w-full">
        <tbody class="w-full divide-y divide-gray-200">
          <tr class="w-full">
            <td class="w-32 px-2 py-3 text-start text-sm font-normal text-gray-500">Name</td>
            <td class="py-3 text-sm text-gray-500">:</td>
            <td class="px-2 py-3 text-sm">{{ authStore.userName }}</td>
            <td class="px-2 py-3 text-end">Edit</td>
          </tr>
          <tr class="w-full">
            <td class="w-32 px-2 py-3 text-start text-sm font-normal text-gray-500">Role</td>
            <td class="py-3 text-sm text-gray-500">:</td>
            <td class="px-2 py-3 text-sm">
              <span
                class="bg-lightning-yellow-400 inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium"
                >{{ authStore.userRole }}</span
              >
            </td>
            <td class="px-2 py-3 text-end">Edit</td>
          </tr>
          <tr class="w-full">
            <td class="w-32 px-2 py-3 text-start text-sm font-normal text-gray-500">Email</td>
            <td class="py-3 text-sm text-gray-500">:</td>
            <td class="px-2 py-3 text-sm">{{ authStore.user.email }}</td>
            <td class="px-2 py-3 text-end">Edit</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- END : ... -->

    <!-- START : TEMP FORM EDIT PROFILE -->
    <div class="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-xl font-semibold">Edit Profil</h2>

      <div class="mb-4">
        <label class="block text-gray-600">Nama</label>
        <input v-model="name" type="text" class="w-full rounded border px-3 py-2" />
      </div>

      <button
        :disabled="authStore.loading"
        @click="updateProfile"
        class="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
      >
        {{ authStore.loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>
    </div>
    <!-- END : TEMP FORM EDIT PROFILE -->
  </div>
</template>
