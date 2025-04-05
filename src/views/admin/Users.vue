<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchAllProfiles();
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : ... -->
    <div>xxx</div>
    <!-- END : ... -->

    <!-- START : USERS TABLE -->
    <div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead
            class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
          >
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
              v-for="user in authStore.allProfiles"
              :key="user.id"
              class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
              >
                --Avatar
              </th>
              <td class="px-6 py-4">{{ user.name }}</td>
              <td class="px-6 py-4">{{ user.username }}</td>
              <td class="px-6 py-4">--Email</td>
              <td class="px-6 py-4">{{ user.role }}</td>
              <td class="px-6 py-4 text-right">
                <a href="#" class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >Edit</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- END : USERS TABLE -->
  </div>
</template>
