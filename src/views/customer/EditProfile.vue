<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import FileInputComponent from '@/components/form/FileInput.vue';

const authStore = useAuthStore();

// START : PROFILE
const name = ref('');
const username = ref('');
const avatarFile = ref(null);

const updateProfile = async () => {
  const updatedData = {
    name: name.value,
    username: username.value,
  };

  await authStore.updateProfile(updatedData, avatarFile.value);

  if (!authStore.error) {
    // ...
  }
};
// END : PROFILE

// START : USER
const email = ref('');
const password = ref('');

const updateUser = async () => {
  await authStore.updateUser(email.value, password.value);
};
// END : USER

onMounted(() => {
  if (authStore.profile) {
    name.value = authStore.profile.name;
    username.value = authStore.profile.username;
  }

  if (authStore.user) {
    email.value = authStore.user.email;
  }
});
</script>

<template>
  <div class="flex flex-col gap-5 py-0">
    <!-- START : PROFILE -->
    <div class="flex flex-col gap-5 rounded-xl bg-gray-900 px-5 py-5">
      <form @submit.prevent="updateProfile" class="flex flex-col gap-8">
        <div class="flex flex-col gap-5">
          <!-- Name -->
          <div class="flex flex-col gap-1">
            <p class="text-sm font-normal text-gray-400">Nama</p>
            <InputComponent v-model="name" placeholder="Masukkan nama" />
          </div>
          <!-- Username -->
          <div class="flex flex-col gap-1">
            <p class="text-sm font-normal text-gray-400">Username</p>
            <InputComponent v-model="username" placeholder="Masukkan username" />
          </div>
          <!-- Avatar File -->
          <div class="flex flex-col gap-1">
            <p class="text-sm font-normal text-gray-400">Avatar</p>
            <FileInputComponent v-model="avatarFile" class="" />
          </div>
        </div>
        <!-- Submit Button -->
        <ButtonComponent type="submit" variant="solid" textColor="black">
          Simpan Perubahan
        </ButtonComponent>
      </form>
    </div>
    <!-- END : PROFILE -->

    <!-- START : USER -->
    <div class="flex flex-col gap-5 rounded-xl bg-gray-900 px-5 py-5">
      <form @submit.prevent="updateUser" class="flex flex-col gap-8">
        <div class="flex flex-col gap-5">
          <!-- Email -->
          <div class="flex flex-col gap-1">
            <p class="text-sm font-normal text-gray-400">Email</p>
            <InputComponent v-model="email" placeholder="Masukkan email" type="email" />
          </div>
          <!-- Username -->
          <div class="flex flex-col gap-1">
            <p class="text-sm font-normal text-gray-400">password</p>
            <InputComponent
              v-model="password"
              placeholder="Masukkan password baru"
              type="password"
            />
          </div>
        </div>
        <!-- Submit Button -->
        <ButtonComponent type="submit" variant="solid" textColor="black">
          Simpan Perubahan
        </ButtonComponent>
      </form>
    </div>
    <!-- END : USER -->
  </div>
</template>
