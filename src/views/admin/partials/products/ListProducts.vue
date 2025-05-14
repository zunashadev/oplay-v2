<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { getPublicImageUrl } from '@/utils/storageHelper';

// 📌 Stores
import { useProductStore } from '@/stores/productStore';
import { useProductCategoryStore } from '@/stores/productCategoryStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
import GeometryLoaderComponent from '@/components/loaders/GeometryLoader.vue';

import InputComponent from '@/components/form/Input.vue';
import ListboxSelectComponent from '@/components/form/ListboxSelect.vue';

import AddProductPackageModalComponent from '../../components/products/AddProductPackageModal.vue';
import AddProductPackageDurationModalComponent from '../../components/products/AddProductPackageDurationModal.vue';
import EditProductPackageModalComponent from '../../components/products/EditProductPackageModal.vue';
import EditProductModalComponent from '../../components/products/EditProductModal.vue';
import DeleteProductModalComponent from '../../components/products/DeleteProductModal.vue';
import DeleteProductPackageModalComponent from '../../components/products/DeleteProductPackageModal.vue';
import DeleteProductPackageDurationComponent from '../../components/products/DeleteProductPackageDuration.vue';

// 📌 Icons
import CrossIcon from '@/components/icons/Cross.vue';
import PlusIcon from '@/components/icons/Plus.vue';

import EditIcon from '@/components/icons/Edit.vue';
import TrashIcon from '@/components/icons/Trash.vue';

// 📌 Inisialisasi Store
const productStore = useProductStore();
const categoryStore = useProductCategoryStore();

// 📌 Fetch Product
onMounted(() => {
  productStore.fetchProducts();
});

onUnmounted(() => {
  productStore.resetProductsState();
});

// 📌 Edit Product
const editProductModalRef = ref(null);

function openEditProductModal(productId) {
  editProductModalRef.value.openModal(productId);
}

// 📌 Delete Product
const deleteProductModalRef = ref(null);

const openDeleteProductModal = async (id) => {
  deleteProductModalRef.value.openModal(id);
};

// 📌 Add Package
const addProductPackageModalRef = ref(null);

function openAddProductPackageModal(productId) {
  if (!productId) {
    alert('Product ID tidak valid');
    return;
  }

  addProductPackageModalRef.value.openModal(productId);
}

// 📌 Edit Package
const editProductPackageModalRef = ref(null);

function openEditProductPackageModal(packageId) {
  editProductPackageModalRef.value.openModal(packageId);
}

// 📌 Delete Package
const deleteProductPackageModalRef = ref(null);

const openDeleteProductPackageModal = async (id) => {
  deleteProductPackageModalRef.value.openModal(id);
};

// 📌 Add Duration
const addProductPackageDurationModalRef = ref(null);

function openAddDurationModal(productPackageId) {
  if (!productPackageId) {
    alert('Product Package ID tidak valid');
    return;
  }

  addProductPackageDurationModalRef.value.openModal(productPackageId);
}

// 📌 Delete Duration
const deleteProductPackageDurationModalRef = ref(null);

const openDeleteProductPackageDurationModal = async (id) => {
  deleteProductPackageDurationModalRef.value.openModal(id);
};

// 📌 Search & Filter
const keyword = ref('');
const selectedCategory = ref(null);

watch([keyword, selectedCategory], () => {
  productStore.searchAndFilterProducts({
    keyword: keyword.value,
    categoryId: selectedCategory.value,
  });
});

// 📌 Expand Descriptions
// Menyimpan ID produk yang sedang di-expand
const expandedDescriptionProductIds = ref(new Set());

// Fungsi toggle expand/collapse
const toggleExpand = (productId) => {
  if (expandedDescriptionProductIds.value.has(productId)) {
    expandedDescriptionProductIds.value.delete(productId);
  } else {
    expandedDescriptionProductIds.value.add(productId);
  }
};

// Mengecek apakah produk sedang di-expand
const isExpanded = (productId) => {
  return expandedDescriptionProductIds.value.has(productId);
};
</script>

<template>
  <!-- Edit Product -->
  <EditProductModalComponent ref="editProductModalRef" />
  <!-- Delete Product -->
  <DeleteProductModalComponent ref="deleteProductModalRef" />
  <!-- Add Package -->
  <AddProductPackageModalComponent ref="addProductPackageModalRef" />
  <!-- Edit Package -->
  <EditProductPackageModalComponent ref="editProductPackageModalRef" />
  <!-- Delete Package -->
  <DeleteProductPackageModalComponent ref="deleteProductPackageModalRef" />
  <!-- Add Duration -->
  <AddProductPackageDurationModalComponent ref="addProductPackageDurationModalRef" />
  <!-- Delete Duration -->
  <DeleteProductPackageDurationComponent ref="deleteProductPackageDurationModalRef" />

  <div class="flex flex-col gap-5">
    <!-- START : HEADER -->
    <div class="rounded-xl bg-gray-800 px-6 py-3">
      <p class="text-center text-2xl font-semibold">🛒 Daftar Produk</p>
    </div>
    <!-- END : HEADER -->

    <!-- START : Filter -->
    <div
      class="flex w-full flex-row items-center justify-between gap-4 rounded-xl bg-gray-800 px-3 py-3"
    >
      <!-- 📌 Search -->
      <div class="w-full sm:max-w-96">
        <InputComponent v-model="keyword" placeholder="Cari produk..." />
      </div>

      <div class="flex items-center gap-3">
        <!-- 📌 Filter -->
        <template v-if="categoryStore.categories.length">
          <ListboxSelectComponent
            class="w-full sm:max-w-52"
            v-model="selectedCategory"
            :options="categoryStore.categories"
            labelKey="name"
            valueKey="id"
            placeholder="Pilih kategori"
            required
          >
          </ListboxSelectComponent>
        </template>
        <div>
          <RouterLink :to="{ name: 'AdminDashboardPrintProducts' }">
            <ButtonComponent textColor="black">Cetak</ButtonComponent>
          </RouterLink>
        </div>
      </div>
    </div>
    <!-- END : Filter -->

    <!-- START : List Products -->
    <!-- START : loading -->
    <template v-if="productStore.isFetchingList">
      <div class="flex h-96 w-full items-center justify-center">
        <GeometryLoaderComponent />
      </div>
    </template>
    <!-- END : loading -->

    <template v-else>
      <!-- Products Kosong -->
      <template v-if="!productStore.products || productStore.products.length === 0">
        <div class="py-10 text-center">
          <span class="text-gray-500">Belum ada produk.</span>
        </div>
      </template>

      <!-- Products -->
      <template v-else>
        <div
          v-for="(product, index) in productStore.products"
          :key="product.id"
          class="overflow-hidden rounded-xl bg-gray-900"
        >
          <!-- START : HEAD -->
          <div class="flex items-center justify-between bg-gray-800 px-4 py-4">
            <div class="flex items-center space-x-3">
              <img
                v-if="product.product_image_path"
                :src="getPublicImageUrl(product.product_image_path)"
                alt="Produk"
                class="max-h-8"
              />
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
                @click="openDeleteProductModal(product.id)"
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
            <!-- START : Banner -->
            <img
              v-if="product.product_banner_image_path"
              :src="getPublicImageUrl(product.product_banner_image_path)"
              alt="Gambar"
              class="h-44 w-full rounded-2xl object-cover"
            />
            <!-- END : Banner -->

            <!-- START : DETAIL -->
            <div
              class="flex w-full flex-col gap-5 rounded-md border border-dashed border-gray-600 px-3 py-3"
            >
              <p class="text-base font-medium">ℹ️ Informasi</p>
              <div class="flex flex-col gap-2">
                <div>
                  <p class="text-xs font-normal text-gray-400">Category</p>
                  <p class="text-sm">{{ product.product_categories.name }}</p>
                </div>
                <div>
                  <p class="text-xs font-normal text-gray-400">Delivery Type</p>
                  <p class="text-sm">{{ product.delivery_types.label }}</p>
                </div>

                <div class="flex flex-col gap-2">
                  <p class="text-xs font-normal text-gray-400">Description</p>

                  <!-- <div class="ql-editor">
                    <div v-html="product.description"></div>
                  </div> -->

                  <div class="rounded-xl p-3">
                    <div
                      class="ql-editor scrollbar-custom relative max-h-16 overflow-hidden rounded-xl bg-gray-800 transition-all duration-300 ease-in-out"
                      :class="{ '!max-h-full': isExpanded(product.id) }"
                    >
                      <div v-html="product.description"></div>
                    </div>

                    <div
                      class="mt-2 w-fit cursor-pointer text-sm text-gray-500 hover:underline"
                      @click="toggleExpand(product.id)"
                    >
                      {{
                        isExpanded(product.id)
                          ? 'Tampilkan lebih sedikit'
                          : 'Tampilkan selengkapnya'
                      }}
                    </div>
                  </div>
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
                    class="flex items-start justify-between gap-3 rounded-md border border-l-6 border-gray-600 bg-gray-800 px-5 py-5"
                  >
                    <div class="flex w-full flex-col gap-3">
                      <div class="flex items-center gap-3">
                        <p class="text-lg font-medium">{{ pkg.name }}</p>
                        <p
                          v-if="pkg.is_best_seller"
                          class="rounded-md bg-yellow-500 px-3 py-0.5 text-xs font-medium text-black"
                        >
                          🔥 Terlaris
                        </p>
                      </div>
                      <div class="flex w-full flex-col gap-6 text-gray-400">
                        <div class="flex flex-col gap-1">
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
                                -{{ formatRupiah(pkg.discount_value) }}
                              </span>

                              <span v-if="pkg.discount_type == 'percentage'">
                                -{{ pkg.discount_value }}%
                              </span>
                            </p>
                            <!-- Harga Akhir -->
                            <p class="text-sm font-normal text-yellow-500">
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
                                pkg.product_package_durations &&
                                pkg.product_package_durations.length
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
                                    @click="openDeleteProductPackageDurationModal(duration.id)"
                                    class="absolute right-0.5 rounded-full p-0.5 text-black transition-all hover:cursor-pointer hover:bg-red-600 hover:text-white"
                                  >
                                    <CrossIcon class="size-3" />
                                  </div>
                                </div>
                              </div>
                            </template>
                            <!-- Add Duration -->
                            <div
                              @click="openAddDurationModal(pkg.id)"
                              class="group flex items-center justify-center rounded-full border border-dashed border-gray-600 bg-gray-200 px-3 transition-all hover:cursor-pointer hover:border-black hover:bg-yellow-500"
                            >
                              <span class="text-xs text-gray-600 group-hover:text-black"
                                >Tambah Durasi
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-none gap-2">
                      <!-- Edit -->
                      <ButtonComponent
                        @click="openEditProductPackageModal(pkg.id)"
                        variant="link"
                        color="yellow"
                      >
                        <EditIcon class="size-5" />
                      </ButtonComponent>

                      <!-- Delete -->
                      <ButtonComponent
                        @click="openDeleteProductPackageModal(pkg.id)"
                        variant="link"
                        color="red"
                      >
                        <TrashIcon class="size-5" />
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
      <!-- END : List Products -->
    </template>
  </div>
</template>
