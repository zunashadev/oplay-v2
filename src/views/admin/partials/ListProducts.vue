<script setup>
import { ref, onMounted, watch, watchEffect, nextTick } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';
import { useProductPackageDurationStore } from '@/stores/productPackageDurationStore';

import AddProductPackageModalComponent from '../components/modals/AddProductPackageModal.vue';
import AddProductPackageDurationModalComponent from '../components/modals/AddProductPackageDurationModal.vue';
import EditProductPackageModalComponent from '../components/modals/EditProductPackageModal.vue';
import EditProductModalComponent from '../components/modals/EditProductModal.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

import CrossIcon from '@/components/icons/Cross.vue';
import PlusIcon from '@/components/icons/Plus.vue';

const productStore = useProductStore();
const productPackageStore = useProductPackageStore();
const productPackageDurationStore = useProductPackageDurationStore();

// Fetch Product
onMounted(() => {
  productStore.fetchProducts();
});

// Edit Product
const editProductModalRef = ref(null);

function openEditProductModal(productId) {
  editProductModalRef.value.openModal(productId);
}

function closeEditProductModal() {
  editProductModalRef.value.closeModal();
}

// Delete Product
const deleteProduct = async (id) => {
  await productStore.deleteProduct(id);
};

// Add Package
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

// Edit Package
const editProductPackageModalRef = ref(null);

function openEditProductPackageModal(packageId) {
  editProductPackageModalRef.value.openModal(packageId);
}

function closeEditProductPackageModal() {
  editProductPackageModalRef.value.closeModal();
}

// Delete Package
const deleteProductPackage = async (id) => {
  await productPackageStore.deleteProductPackage(id);
};

// Add Duration
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

// Delete Duration
const deleteProductPackageDuration = async (id) => {
  await productPackageDurationStore.deleteProductPackageDuration(id);
};
</script>

<template>
  <!-- Edit Product -->
  <EditProductModalComponent ref="editProductModalRef" />
  <!-- Add Package -->
  <AddProductPackageModalComponent ref="addProductPackageModalRef" />
  <!-- Edit Package -->
  <EditProductPackageModalComponent ref="editProductPackageModalRef" />
  <!-- Add Duration -->
  <AddProductPackageDurationModalComponent ref="addDurationModalRef" />

  <div class="flex flex-col gap-5">
    <!-- START : HEADER -->
    <div class="rounded-xl bg-gray-800 px-6 py-3">
      <p class="text-center text-2xl font-semibold">🛒 Daftar Produk</p>
    </div>
    <!-- END : HEADER -->

    <!-- START : LIST PRODUCTS -->
    <template v-if="productStore.products && productStore.products.length">
      <div
        v-for="product in productStore.products"
        :key="product.id"
        class="overflow-hidden rounded-xl bg-gray-900"
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
            <ButtonComponent
              @click="openEditProductModal(product.id)"
              type="button"
              variant="solid"
              size="sm"
              textColor="black"
            >
              Edit
            </ButtonComponent>
            <ButtonComponent
              @click="deleteProduct(product.id)"
              type="button"
              variant="solid"
              size="sm"
              color="red"
              textColor="black"
            >
              Delete
            </ButtonComponent>
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
                class="group rounded-md border border-gray-600 bg-gray-800 p-1 transition-all hover:cursor-pointer hover:border-gray-500 hover:bg-gray-700"
              >
                <PlusIcon
                  @click="openAddProductPackageModal(product.id)"
                  class="size-5 text-gray-500 group-hover:text-white"
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
                        <!-- Harga Normal -->
                        <p class="text-sm font-normal">
                          Harga Normal : {{ formatRupiah(pkg.price) }}
                        </p>
                        <template v-if="pkg.discount_type && pkg.discount_value">
                          <!-- Nilai Diskon -->
                          <p
                            v-if="pkg.discount_type && pkg.discount_value"
                            class="text-sm font-normal text-red-500"
                          >
                            Nilai Diskon :
                            <span v-if="pkg.discount_type == 'fixed_amount'">
                              {{ formatRupiah(pkg.discount_value) }}
                            </span>

                            <span v-if="pkg.discount_type == 'percentage'">
                              {{ pkg.discount_value }}%
                            </span>
                          </p>
                          <!-- Harga Akhir -->
                          <p class="text-lightning-yellow-400 text-sm font-normal">
                            Harga Akhir :
                            {{
                              formatRupiah(
                                calculateFinalPrice(
                                  pkg.price,
                                  pkg.discount_type,
                                  pkg.discount_value,
                                ),
                              )
                            }}
                          </p>
                        </template>
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
                                  <p>{{ duration.name }}</p>
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
                    <!-- <ButtonComponent
                      type="button"
                      variant="solid"
                      size="sm"
                      color="blue"
                      textColor="black"
                    >
                      Atur Sebagai Terlaris 🔥
                    </ButtonComponent> -->
                    <ButtonComponent
                      @click="openEditProductPackageModal(pkg.id)"
                      type="button"
                      variant="solid"
                      size="sm"
                      color="lightning-yellow"
                      textColor="black"
                    >
                      Edit
                    </ButtonComponent>
                    <ButtonComponent
                      @click="deleteProductPackage(pkg.id)"
                      type="button"
                      variant="solid"
                      size="sm"
                      color="red"
                      textColor="black"
                    >
                      Delete
                    </ButtonComponent>
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
