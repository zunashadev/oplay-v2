<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Inisialisasi store dan router
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// State lokal
const email = ref('');
const password = ref('');

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
    // Error sudah di-handle di store,
    // authStore.error akan otomatis terisi
    console.error('Login gagal');
  }
};
</script>

<template>
  <div class="bg-blue-charcoal-950 w-full max-w-xl rounded-lg px-6 py-8 shadow-lg">
    <div class="space-y-12">
      <div class="space-y-2">
        <h1 class="text-4xl font-semibold">Login</h1>
        <p class="text-base font-normal text-gray-500">
          Klo bukan admin, tolong jangan kesini! Ngapain juga disini 😜
        </p>
      </div>

      <!-- Loading Indicator -->
      <div v-if="authStore.loading" class="text-yellow-500">Sedang memproses...</div>
      <!-- Error Message -->
      <p v-if="authStore.error" class="text-red-500">{{ authStore.error }}</p>

      <div class="space-y-8">
        <!-- Input Form -->
        <div class="space-y-4">
          <!-- Email -->
          <div class="">
            <label for="email" class="block text-sm font-normal">Email</label>
            <div class="mt-2">
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="Masukkan email"
                class="outline-blue-charcoal-900 focus:outline-lightning-yellow-400 block w-full rounded-md bg-black px-3 py-1.5 text-base font-normal text-white outline-1 -outline-offset-1 placeholder:text-gray-600 focus:outline-2 focus:-outline-offset-2"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="">
            <label for="password" class="block text-sm font-normal">Password</label>
            <div class="mt-2">
              <input
                v-model="password"
                type="password"
                placeholder="Masukkan password"
                class="outline-blue-charcoal-900 focus:outline-lightning-yellow-400 block w-full rounded-md bg-black px-3 py-1.5 text-base font-normal text-white outline-1 -outline-offset-1 placeholder:text-gray-600 focus:outline-2 focus:-outline-offset-2"
              />
            </div>
          </div>
        </div>

        <!-- Login Button -->
        <div class="flex flex-col items-center space-y-3">
          <button
            @click="handleLogin"
            type="button"
            class="bg-lightning-yellow-400 hover:bg-lightning-yellow-500 focus:bg-lightning-yellow-600 inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-black transition-all hover:cursor-pointer focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          >
            Login
          </button>
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
    </div>
  </div>
</template>
