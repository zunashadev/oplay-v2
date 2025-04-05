<script setup>
import { ref, onMounted, watch, watchEffect, nextTick } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';
import { useProductPackageDurationStore } from '@/stores/productPackageDurationStore';

import AddProductPackageComponent from '../components/modals/AddProductPackageModal.vue';
import AddProductPackageDurationModalComponent from '../components/modals/AddProductPackageDurationModal.vue';

import CrossIcon from '@/components/icons/Cross.vue';
import PlusIcon from '@/components/icons/Plus.vue';

const productStore = useProductStore();
const productPackageStore = useProductPackageStore();
const productPackageDurationStore = useProductPackageDurationStore();

// Fetch Product
onMounted(() => {
  productStore.fetchProducts();
});

// Delete Product
const deleteProduct = async (id) => {
  await productStore.deleteProduct(id);
};

// Delete Product Package
const deleteProductPackage = async (id) => {
  await productPackageStore.deleteProductPackage(id);
};

// Delete Product Package Duration
const deleteProductPackageDuration = async (id) => {
  await productPackageDurationStore.deleteProductPackageDuration(id);
};

// Add Product Package Modal
const addProductPackageModalRef = ref(null);

function openAddProductPackageModal(productId) {
  if (!productId) {
    alert('Product ID tidak valid');
    return;
  }

  addProductPackageModalRef.value.openModal(productId);
}

function closeAddProductPackageModal() {
  addProductPackageModalRef.value.closeModal();
}

// Add Duration Modal
const addDurationModalRef = ref(null);

function openAddDurationModal(productId, productPackageId) {
  if (!productId || !productPackageId) {
    alert('Product ID atau Product Package ID tidak valid');
    return;
  }

  addDurationModalRef.value.openModal(productId, productPackageId);
}

function closeAddDurationModal() {
  addDurationModalRef.value.closeModal();
}
</script>

<template>
  <!-- Start : Modal -->
  <AddProductPackageComponent ref="addProductPackageModalRef"></AddProductPackageComponent>

  <AddProductPackageDurationModalComponent
    ref="addDurationModalRef"
  ></AddProductPackageDurationModalComponent>
  <!-- End : Modal -->

  <div class="flex flex-col gap-5">
    <!-- START : HEADER -->
    <div class="rounded-md bg-gray-800 px-6 py-3">
      <p class="text-center text-2xl font-semibold">🛒 Daftar Produk</p>
    </div>
    <!-- END : HEADER -->

    <!-- START : LIST PRODUCTS -->
    <template v-if="productStore.products && productStore.products.length">
      <div
        v-for="product in productStore.products"
        :key="product.id"
        class="overflow-hidden rounded-md bg-gray-900"
      >
        <!-- START : HEAD -->
        <div class="flex items-center justify-between bg-gray-800 px-4 py-4">
          <div class="flex items-center space-x-3">
            <img v-if="product.image_url" :src="product.image_url" alt="Produk" class="max-h-8" />
            <p class="text-xl font-semibold">
              {{ product.name }}
            </p>
          </div>
          <div class="flex gap-1">
            <button
              class="bg-lightning-yellow-400 hover:bg-lightning-yellow-500 rounded-md px-3 py-1 text-sm font-medium text-white transition-all hover:cursor-pointer"
            >
              Edit
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white transition-all hover:cursor-pointer hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
        <!-- END : HEAD -->

        <!-- START : BODY -->
        <div class="flex w-full flex-col gap-3 px-4 py-5">
          <!-- START : DETAIL -->
          <div
            class="flex w-full flex-col gap-5 rounded-md border border-dashed border-gray-600 px-3 py-3"
          >
            <p class="text-base font-medium">ℹ️ Informasi</p>
            <div class="flex flex-col gap-2">
              <div>
                <p class="text-xs font-normal text-gray-400">Category</p>
                <p>{{ product.category }}</p>
              </div>
              <div>
                <p class="text-xs font-normal text-gray-400">Description</p>
                <p>{{ product.description }}</p>
              </div>
            </div>
          </div>
          <!-- END : DETAIL -->

          <!-- START : PACKAGES -->
          <div
            class="flex w-full flex-col gap-5 rounded-md border border-dashed border-gray-600 px-3 py-3"
          >
            <div class="flex items-center justify-between">
              <p class="text-base font-medium">📦 Paket</p>
              <div
                class="group hover:bg-lightning-yellow-100 hover:border-lightning-yellow-400 rounded-md border border-gray-600 bg-gray-800 p-1 transition-all hover:cursor-pointer"
              >
                <PlusIcon
                  @click="openAddProductPackageModal(product.id)"
                  class="group-hover:text-lightning-yellow-500 size-5 text-gray-500"
                />
              </div>
            </div>
            <template v-if="product.product_packages && product.product_packages.length">
              <div class="flex flex-col gap-1">
                <div
                  v-for="pkg in product.product_packages"
                  :key="pkg.id"
                  class="flex items-center justify-between gap-3 rounded-md border border-l-6 border-gray-600 bg-gray-800 px-4 py-2"
                >
                  <div class="flex w-full flex-col gap-3">
                    <div class="flex items-center gap-3">
                      <p class="text-lg font-medium">{{ pkg.name }}</p>
                      <p
                        v-if="pkg.is_best_seller"
                        class="bg-lightning-yellow-400 rounded-md px-3 py-0.5 text-xs font-medium text-black"
                      >
                        🔥 Terlaris
                      </p>
                    </div>
                    <div class="flex w-full flex-col gap-6 text-gray-400">
                      <div class="flex flex-col gap-2">
                        <p class="text-sm font-normal">Harga Normal : Rp{{ pkg.price }}</p>
                        <p
                          v-if="pkg.discount_type && pkg.discount_value"
                          class="text-sm font-semibold text-red-500"
                        >
                          Nilai Diskon :
                          <span v-if="pkg.discount_type == 'fixed_amount'">Rp.</span
                          >{{ pkg.discount_value
                          }}<span v-if="pkg.discount_type == 'percentage'">%</span>
                        </p>
                      </div>

                      <div class="flex items-center gap-3">
                        <p class="text-sm font-normal">Durasi :</p>
                        <div class="flex gap-3">
                          <!-- Durations List -->
                          <template
                            v-if="
                              pkg.product_package_durations && pkg.product_package_durations.length
                            "
                          >
                            <div
                              v-for="duration in pkg.product_package_durations"
                              :key="duration.id"
                              class="flex gap-1"
                            >
                              <div
                                class="relative flex min-w-20 items-center justify-start gap-1 rounded-full bg-gray-200 py-0.5 ps-3 pe-8 text-black"
                              >
                                <div class="flex gap-1 text-xs">
                                  <p>{{ duration.value }}</p>
                                  <p>{{ duration.unit }}</p>
                                </div>
                                <div
                                  @click="deleteProductPackageDuration(duration.id)"
                                  class="absolute right-0.5 rounded-full p-0.5 text-black transition-all hover:cursor-pointer hover:bg-red-600 hover:text-white"
                                >
                                  <CrossIcon class="size-3" />
                                </div>
                              </div>
                            </div>
                          </template>
                          <!-- Add Duration -->
                          <div
                            @click="openAddDurationModal(product.id, pkg.id)"
                            class="group hover:bg-lightning-yellow-400 flex items-center justify-center rounded-full border border-dashed border-gray-600 bg-gray-200 px-3 transition-all hover:cursor-pointer hover:border-black"
                          >
                            <span class="text-xs text-gray-600 group-hover:text-black"
                              >Tambah Durasi
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-none flex-col gap-1">
                    <button
                      class="rounded-md bg-blue-500 px-3 py-1 text-xs font-medium text-white transition-all hover:cursor-pointer hover:bg-blue-600"
                    >
                      Atur Sebagai Terlaris 🔥
                    </button>
                    <button
                      class="bg-lightning-yellow-400 hover:bg-lightning-yellow-500 rounded-md px-3 py-1 text-xs font-medium text-white transition-all hover:cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteProductPackage(pkg.id)"
                      class="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white transition-all hover:cursor-pointer hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <p v-else class="text-sm text-gray-400">Belum ada paket untuk produk ini.</p>
          </div>
          <!-- END : PACKAGES -->
        </div>
        <!-- END : BODY -->
      </div>
    </template>
    <!-- END : LIST PRODUCTS -->
  </div>
</template>
