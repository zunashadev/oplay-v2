<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// 📌 Components
import GeometryLoaderComponent from '@/components/loaders/GeometryLoader.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const loading = ref(true);
const alreadyVerified = ref(false);

onMounted(async () => {
  // Cek error di URL hash (contoh: #error=access_denied&error_code=otp_expired...)
  const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
  if (hashParams.get('error') && hashParams.get('error_code') === 'otp_expired') {
    alreadyVerified.value = true;
    loading.value = false;
    return;
  }

  const ready = await authStore.ensureSession();
  if (!ready) {
    alreadyVerified.value = true;
    loading.value = false;
    return;
  }

  try {
    await authStore.createUserProfile();

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
    console.log('Gagal membuat profil : ', error.message);
    alreadyVerified.value = true;
    loading.value = false;
  }
});
</script>

<template>
  <div class="relative flex min-h-screen w-full items-center justify-center px-5 py-5">
    <!-- START : Logo Brand -->
    <div class="absolute top-5 left-5 flex">
      <RouterLink
        :to="{ name: 'PublicHome' }"
        class="flex items-center space-x-1 px-2 sm:space-x-2"
      >
        <img src="/app-logo.png" class="h-6 w-auto" />
        <p class="text-xl font-semibold text-white sm:text-2xl">OPLAY</p>
      </RouterLink>
    </div>
    <!-- END : Logo Brand -->

    <!-- START : Konten -->
    <div class="flex flex-col gap-8 text-center">
      <!-- START : Loading -->
      <template v-if="loading">
        <div class="flex flex-col gap-8 text-center">
          <div class="flex items-center justify-center">
            <GeometryLoaderComponent />
          </div>
          <h1 class="text-sm font-medium text-yellow-500 sm:text-lg">
            Verifikasi email telah berhasil, harap tunggu beberapa saat...
          </h1>
        </div>
      </template>
      <!-- END : Loading -->

      <!-- START : Sudah Verifikasi -->
      <template v-else-if="alreadyVerified">
        <div class="flex flex-col gap-8 text-center">
          <h1 class="text-sm font-medium text-yellow-500 sm:text-lg">
            Akun kamu sudah berhasil diverifikasi sebelumnya.
          </h1>
          <RouterLink :to="{ name: 'AuthLogin' }">
            <ButtonComponent textColor="black">Login ke Akun</ButtonComponent>
          </RouterLink>
        </div>
      </template>
      <!-- END : Sudah Verifikasi -->
    </div>

    <!-- END : Konten -->
  </div>
</template>
