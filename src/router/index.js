import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 📌 Public
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
    // 📌 Auth
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
    // 📌 Customer
    {
      path: '/customer',
      component: () => import('../views/customer/layouts/CustomerLayout.vue'),
      children: [
        {
          path: '',
          name: 'CustomerDashboardHome',
          component: () => import('../views/customer/Home.vue'),
          meta: {
            title: 'Customer Dashboard',
            requiresAuth: true,
            requiredRoles: ['customer'],
          },
        },
        {
          path: 'profile',
          name: 'CustomerDashboardEditProfile',
          component: () => import('../views/customer/EditProfile.vue'),
          meta: {
            title: 'Customer Dashboard Edit Profile',
            requiresAuth: true,
            requiredRoles: ['customer'],
          },
        },
        {
          path: 'payment',
          name: 'CustomerPayment',
          component: () => import('../views/customer/Payment.vue'),
          meta: {
            title: 'Customer Payment',
            requiresAuth: true,
            requiredRoles: ['customer'],
          },
        },
      ],
    },
    // 📌 Admin
    {
      path: '/admin',
      component: () => import('../views/admin/layouts/AdminLayout.vue'),
      children: [
        // Dashboard
        {
          path: '',
          name: 'AdminDashboardHome',
          component: () => import('../views/admin/Home.vue'),
          meta: {
            title: 'Beranda',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        // Product
        {
          path: 'products',
          name: 'AdminDashboardProducts',
          component: () => import('../views/admin/Products.vue'),
          meta: {
            title: 'Daftar Produk',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        {
          path: 'categories',
          name: 'AdminDashboardCategories',
          component: () => import('../views/admin/Categories.vue'),
          meta: {
            title: 'Daftar Kategori',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        // Order
        {
          path: 'orders',
          name: 'AdminDashboardOrders',
          component: () => import('../views/admin/Orders.vue'),
          meta: {
            title: 'Daftar Pesanan',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        {
          path: 'payment-methods',
          name: 'AdminDashboardPaymentMethods',
          component: () => import('../views/admin/PaymentMethods.vue'),
          meta: {
            title: 'Metode Pembayaran',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        // Wallet
        // ...
        // Reward
        {
          path: 'reward-configurations',
          name: 'AdminDashboardRewardConfigurations',
          component: () => import('../views/admin/RewardConfigurations.vue'),
          meta: {
            title: 'Konfigurasi Hadiah',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        {
          path: 'reward-histories',
          name: 'AdminDashboardRewardHistories',
          component: () => import('../views/admin/RewardHistories.vue'),
          meta: {
            title: 'Riwayat Hadiah',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        // Users
        {
          path: 'users',
          name: 'AdminDashboardUsers',
          component: () => import('../views/admin/Users.vue'),
          meta: {
            title: 'Daftar Pengguna',
            requiresAuth: true,
            requiredRoles: ['admin'],
          },
        },
        // Profile
        {
          path: 'profile',
          name: 'AdminDashboardProfile',
          component: () => import('../views/admin/Profile.vue'),
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
  const authStore = useAuthStore();
  await authStore.initAuth();

  // Set judul halaman
  document.title = to.meta.title ? `${to.meta.title} - Oplay` : 'Oplay';

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const requiresGuest = to.matched.some((r) => r.meta.requiresGuest);
  const requiredRoles = to.meta.requiredRoles || [];

  const isAuth = authStore.isAuthenticated;
  const role = authStore.userRole;

  if (requiresAuth && !isAuth) {
    next({ name: 'AuthLogin', query: { redirect: to.fullPath } });
  } else if (requiresGuest && isAuth) {
    // Redirect logged in user ke dashboard sesuai role
    if (role === 'admin') next({ name: 'AdminDashboardHome' });
    else if (role === 'customer') next({ name: 'CustomerDashboardHome' });
    else next('/');
  } else if (requiresAuth && isAuth && requiredRoles.length && !requiredRoles.includes(role)) {
    // Jika login tapi role tidak sesuai
    if (role === 'admin') next({ name: 'AdminDashboardHome' });
    else if (role === 'customer') next({ name: 'CustomerDashboardHome' });
    else next('/');
  } else {
    next();
  }
});

export default router;
