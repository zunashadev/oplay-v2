<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';

// 📌 Stores
import { useAuthStore } from '@/stores/authStore';

// 📌 Components
import WaveLoaderComponent from '@/components/loaders/WaveLoader.vue';
import InputComponent from '@/components/form/Input.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Icons
import EyeIcon from '@/components/icons/Eye.vue';
import EyeCrossedIcon from '@/components/icons/EyeCrossed.vue';

// 📌 Inisialisasi store dan router
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// 📌 State lokal
const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const refferalCode = ref('');

const confirmPassword = ref('');
const confirmPasswordError = ref('');

// 📌 Tampilkan Password
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 📌 Fungsi Register
const handleRegister = async () => {
  confirmPasswordError.value = '';

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Password tidak cocok';
    return;
  }

  try {
    await authStore.register(
      email.value,
      password.value,
      name.value,
      username.value,
      null,
      refferalCode.value,
    );

    // ℹ Redirect ke halaman sebelumnya atau dashboard
    const redirect = route.query.redirect;
    if (redirect) {
      router.push(redirect);
    } else if (authStore.userRole === 'admin') {
      router.push({ name: 'AdminDashboardHome' });
    } else if (authStore.userRole === 'customer') {
      router.push({ name: 'CustomerDashboardHome' });
    } else {
      router.push('/');
    }
  } catch (error) {
    // ℹ Opsional, pesan error sudah di handle pada store
  }
};

onMounted(() => {
  authStore.resetMessageState();
});
</script>

<template>
  <!-- START : Loading -> Page -->
  <template v-if="authStore.loading">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <WaveLoaderComponent />
    </div>
  </template>
  <!-- END : Loading -> Page -->

  <div class="relative flex min-h-screen w-full items-center justify-center px-5 py-5">
    <!-- START : LOGO BRAND -->
    <div class="absolute top-5 left-5 flex">
      <RouterLink
        :to="{ name: 'PublicHome' }"
        class="flex items-center space-x-1 px-2 sm:space-x-2"
      >
        <img src="/app-logo.png" class="h-6 w-auto" />
        <p class="text-xl font-semibold text-white sm:text-2xl">OPLAY</p>
      </RouterLink>
    </div>
    <!-- END : LOGO BRAND -->

    <!-- START : REGISTER FORM -->
    <div class="w-full max-w-xl rounded-xl bg-gray-800 px-1 pt-1 shadow-lg">
      <div class="space-y-8 rounded-xl bg-gray-900 px-6 py-8">
        <div class="space-y-2">
          <h1 class="text-4xl font-semibold">Register</h1>
          <p class="text-base font-normal text-gray-500">
            Silahkan buat akun baru apabila anda belum memiliki akun
          </p>
        </div>

        <!-- Error Message -->
        <template v-if="authStore.error">
          <div class="flex flex-col gap-1 rounded-md bg-red-500/10 p-3">
            <p class="text-sm font-medium text-red-500">{{ authStore.message }}</p>
            <p class="text-xs text-red-500">{{ authStore.error }}</p>
          </div>
        </template>

        <form @submit.prevent="handleRegister" class="space-y-8">
          <!-- Input Form -->
          <div class="space-y-4">
            <!-- Name -->
            <div class="flex flex-col gap-2">
              <label for="name" class="block text-sm font-normal text-gray-500">Nama Lengkap</label>
              <InputComponent
                v-model="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <!-- Username -->
            <div class="flex flex-col gap-2">
              <label for="username" class="block text-sm font-normal text-gray-500">Username</label>
              <InputComponent
                v-model="username"
                type="text"
                placeholder="Masukkan username"
                required
              />
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label for="email" class="block text-sm font-normal text-gray-500">Email</label>
              <InputComponent v-model="email" type="email" placeholder="Masukkan email" required />
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2">
              <label for="password" class="block text-sm font-normal text-gray-500">Password</label>
              <InputComponent
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                iconPlacement="end"
                required
              >
                <template #icon-end>
                  <div @click="showPassword = !showPassword">
                    <EyeIcon
                      v-if="!showPassword"
                      class="hover:text-lightning-yellow-400 size-4 transition-all"
                    />
                    <EyeCrossedIcon
                      v-else
                      class="hover:text-lightning-yellow-400 size-4 transition-all"
                    />
                  </div>
                </template>
              </InputComponent>
            </div>

            <!-- Confirm Password -->
            <div class="flex flex-col gap-2">
              <label for="confirm-password" class="block text-sm font-normal text-gray-500"
                >Konfirmasi Password</label
              >
              <InputComponent
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Ulangi password"
                iconPlacement="end"
                :error="!!confirmPasswordError"
                required
              >
                <template #icon-end>
                  <div @click="showConfirmPassword = !showConfirmPassword">
                    <EyeIcon
                      v-if="!showConfirmPassword"
                      class="hover:text-lightning-yellow-400 size-4 transition-all"
                    />
                    <EyeCrossedIcon
                      v-else
                      class="hover:text-lightning-yellow-400 size-4 transition-all"
                    />
                  </div>
                </template>
              </InputComponent>
              <p v-if="confirmPasswordError" class="text-sm text-red-500">
                {{ confirmPasswordError }}
              </p>
            </div>

            <!-- Refferal Code -->
            <div class="flex flex-col gap-2">
              <label for="refferal-code" class="block text-sm font-normal text-gray-500">
                Kode Refferal (Opsional)
              </label>
              <InputComponent
                v-model="refferalCode"
                type="text"
                placeholder="Masukkan kode refferal"
              />
            </div>
          </div>

          <!-- Register Button -->
          <div class="flex flex-col items-center space-y-3">
            <ButtonComponent
              :disabled="authStore.loading"
              type="submit"
              textColor="black"
              class="w-full"
            >
              Register
            </ButtonComponent>
          </div>
        </form>
      </div>
      <div class="rounded-xl bg-gray-800 px-5 py-3 text-center">
        <p class="text-sm text-gray-500">
          Sudah punya akun?
          <RouterLink
            :to="{ name: 'AuthLogin' }"
            class="hover:text-lightning-yellow-400 underline transition-all hover:cursor-pointer"
          >
            klik disini untuk login
          </RouterLink>
        </p>
      </div>
    </div>
    <!-- END : REGISTER FORM -->
  </div>
</template>
