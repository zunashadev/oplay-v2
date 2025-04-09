<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';

// Stores
import { useAuthStore } from '@/stores/authStore';

// Components
import WaveLoaderComponent from '@/components/loaders/WaveLoader.vue';
import InputComponent from '@/components/form/Input.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

// Icons
import EyeIcon from '@/components/icons/Eye.vue';
import EyeCrossedIcon from '@/components/icons/EyeCrossed.vue';

// Inisialisasi store dan router
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// State lokal
const email = ref('');
const password = ref('');

// Tampilkan Password
const showPassword = ref(false);

// Fungsi Login
const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);

    // Redirect ke halaman sebelumnya atau dashboard
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
    // Opsional, pesan error sudah di handle pada store
  }
};

onMounted(() => {
  authStore.resetMessageState();
});
</script>

<template>
  <!-- START : LOADER -->
  <div
    v-if="authStore.loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs"
  >
    <WaveLoaderComponent />
  </div>
  <!-- END : LOADER -->

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

    <!-- START : LOGIN FORM -->
    <div class="w-full max-w-xl rounded-xl bg-gray-800 px-1 pt-1 shadow-lg">
      <div class="space-y-8 rounded-xl bg-gray-900 px-6 py-8">
        <div class="space-y-2">
          <h1 class="text-4xl font-semibold">Login</h1>
          <p class="text-base font-normal text-gray-500">
            Silahkan login menggunakan akun yang sudah terdaftar
          </p>
        </div>

        <!-- Error Message -->
        <template v-if="authStore.error">
          <div class="flex flex-col gap-1 rounded-md bg-red-500/10 p-3">
            <p class="text-sm font-medium text-red-500">{{ authStore.message }}</p>
            <p class="text-xs text-red-500">{{ authStore.error }}</p>
          </div>
        </template>

        <form @submit.prevent="handleLogin" class="space-y-8">
          <!-- Input Form -->
          <div class="space-y-4">
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
          </div>

          <!-- Login Button -->
          <div class="flex flex-col items-center space-y-3">
            <ButtonComponent
              :disabled="authStore.loading"
              type="submit"
              textColor="black"
              class="w-full"
            >
              Login
            </ButtonComponent>
          </div>
        </form>
      </div>
      <div class="rounded-xl bg-gray-800 px-5 py-3 text-center">
        <p class="text-sm text-gray-500">
          Belum punya akun?
          <RouterLink
            :to="{ name: 'AuthRegister' }"
            class="hover:text-lightning-yellow-400 underline transition-all hover:cursor-pointer"
          >
            klik disini untuk register
          </RouterLink>
        </p>
      </div>
    </div>
    <!-- END : LOGIN FORM -->
  </div>
</template>
