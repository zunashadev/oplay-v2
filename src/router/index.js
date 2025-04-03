import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public
    {
      path: '/',
      component: () => import('../views/public/layouts/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'PublicHome',
          component: () => import('../views/public/Home.vue'),
          meta: {
            title: 'Beranda',
            requiresAuth: false,
          },
        },
        {
          path: 'products',
          name: 'PublicProducts',
          component: () => import('../views/public/Products.vue'),
          meta: {
            title: 'Produk',
            requiresAuth: false,
          },
        },
        {
          path: 'products/:slug',
          name: 'PublicProductDetail',
          component: () => import('../views/public/ProductDetail.vue'),
          meta: {
            title: 'Detail Produk',
            requiresAuth: false,
          },
        },
        {
          path: 'faq',
          name: 'PublicFAQ',
          component: () => import('../views/public/FAQ.vue'),
          meta: {
            title: 'FAQ',
            requiresAuth: false,
          },
        },
      ],
    },
    // Auth
    {
      path: '/auth',
      component: () => import('../views/auth/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'AuthLogin',
          component: () => import('../views/auth/Login.vue'),
          meta: {
            title: 'Login',
            requiresGuest: true,
          },
        },
        {
          path: 'register',
          name: 'AuthRegister',
          component: () => import('../views/auth/Register.vue'),
          meta: {
            title: 'Registrasi',
            requiresGuest: true,
          },
        },
      ],
    },
    // Dashboard (Login)
    {
      path: '/dashboard',
      component: () => import('../views/dashboard/layouts/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'DashboardHome',
          component: () => import('../views/dashboard/Home.vue'),
          meta: {
            title: 'Dashboard',
            requiresAuth: true,
          },
        },
        {
          path: 'products',
          name: 'DashboardProducts',
          component: () => import('../views/dashboard/Products.vue'),
          meta: {
            title: 'Produk Dashboard',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        {
          path: 'users',
          name: 'DashboardUsers',
          component: () => import('../views/dashboard/Users.vue'),
          meta: {
            title: 'Manajemen Pengguna',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        {
          path: 'profile',
          name: 'DashboardProfile',
          component: () => import('../views/dashboard/Profile.vue'),
          meta: {
            title: 'Profile Pengguna',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
      ],
    },
    // 404 Not Found
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('../views/NotFound.vue'),
    //   meta: {
    //     title: 'Halaman Tidak Ditemukan',
    //     requiresAuth: false
    //   }
    // }
  ],
});

// Navigation Guard Global
router.beforeEach(async (to, from, next) => {
  // Ambil auth store
  const authStore = useAuthStore();

  // Cek session saat ini
  await authStore.getCurrentSession();

  // Update judul halaman
  document.title = to.meta.title ? `${to.meta.title} - Oplay` : 'Oplay';

  // Cek apakah route membutuhkan autentikasi - ini dapat dari 'meta' pada router
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  // Cek role (jika ada)
  const requiredRoles = to.meta.requiredRoles || [];

  // Logic guard autentikasi
  if (requiresAuth && !authStore.isAuthenticated) {
    // Jika membutuhkan auth tapi tidak login, redirect ke login
    next({
      name: 'AuthLogin',
      query: { redirect: to.fullPath }, // Mengarahkan pengguna ke halaman yang ingin dikunjungi sebelumnya
    });
  }
  // Cek halaman guest
  else if (requiresGuest && authStore.isAuthenticated) {
    // Jika halaman guest tapi sudah login, redirect ke dashboard
    next({ name: 'DashboardHome' });
  }
  // Cek role (jika diperlukan)
  else if (
    requiresAuth &&
    authStore.isAuthenticated &&
    requiredRoles.length > 0 &&
    !requiredRoles.includes(authStore.userRole)
  ) {
    // Jika role tidak sesuai, redirect ke dashboard atau tampilkan error - ini perlu disesuaikan lagi si ❗❗❗
    next({ name: 'DashboardHome' });
  } else {
    // Lanjutkan navigasi
    next();
  }
});

export default router;
