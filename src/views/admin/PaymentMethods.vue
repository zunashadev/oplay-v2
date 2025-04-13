<script setup>
import { ref, onMounted } from 'vue';

// Stores
import { usePaymentMethodStore } from '@/stores/paymentMethodStore';

// Components
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import FileInputComponent from '@/components/form/FileInput.vue';
import SelectComponent from '@/components/form/Select.vue';
import TableComponent from '@/components/tables/Table.vue';

// Icons
import EyeSolidIcon from '@/components/icons/EyeSolid.vue';
import PenSquareSolidIcon from '@/components/icons/PenSquareSolid.vue';
import TrashSolidIcon from '@/components/icons/TrashSolid.vue';

const paymentMethodStore = usePaymentMethodStore();

// START : Form Tambah Metode Pembayarn
const name = ref('');
const type = ref('');
const account_name = ref('');
const account_number = ref(null);
const qr_code_file = ref(null);
const logo_file = ref(null);
const is_active = ref(true);

const paymentMethodTypes = [
  { label: 'E-wallet', value: 'e-wallet' },
  { label: 'Bank', value: 'bank' },
  { label: 'Qris', value: 'qris' },
];

const addPaymentMethod = async () => {
  if (!name.value || !type.value || !account_name.value || !logo_file.value)
    return alert('Nama, Tipe, Nama Akun, dan Logo semua field!');

  await paymentMethodStore.addPaymentMethod(
    name.value,
    type.value,
    account_name.value,
    account_number.value,
    qr_code_file.value,
    logo_file.value,
    is_active.value,
  );

  // Reset form jika berhasil
  if (!paymentMethodStore.error) {
    name.value = '';
    type.value = '';
    account_name.value = '';
    account_number.value = null;
    qr_code_file.value = null;
    logo_file.value = null;
    //   is_active.value = true;
  }
};
// END : Form Tambah Metode Pembayarn

// START : Menampilkan Daftar Metode Pembayaran
onMounted(() => {
  paymentMethodStore.fetchPaymentMethods();
});

const paymentMethodTableColums = [
  { label: 'Nama', key: 'custom-name' }, // Custom
  { label: 'Tipe', key: 'type' },
  { label: 'Nama Akun', key: 'account_name' },
  { label: 'Nomor Akun', key: 'account_number' },
  { label: 'QR Code', key: 'custom-qr-code', align: 'center' }, // Custom
  { label: 'Action', key: 'action', align: 'right' }, // Custom
];
// END : Menampilkan Daftar Metode Pembayaran

// START : Hapus Metode Pembayaran
// END : Hapus Metode Pembayaran
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : Form Tambah Metode Pembayaran -->
    <div class="overflow-hidden rounded-xl bg-gray-900">
      <div class="bg-gray-800 px-3 py-3">
        <p class="text-lg font-medium">➕ Tambah Metode Pembayaran</p>
      </div>

      <div class="px-5 py-5">
        <form @submit.prevent="addPaymentMethod" class="flex flex-col gap-5">
          <div class="flex flex-col gap-5">
            <!-- Nama -->
            <InputComponent
              v-model="name"
              label="Nama"
              placeholder="Masukkan nama metode pembayaran"
              required
            />
            <!-- Tipe -->
            <SelectComponent
              v-model="type"
              :options="paymentMethodTypes"
              placeholder="Pilih jenis metode pembayaran"
            ></SelectComponent>
            <!-- Nama Akun -->
            <InputComponent
              v-model="account_name"
              label="Nama Akun"
              placeholder="Masukkan nama akun"
              required
            />
            <!-- Nomor Akun -->
            <InputComponent
              v-model="account_number"
              label="Nomor Akun"
              placeholder="Masukkan nomor akun"
            />
            <!-- QR Code File -->
            <FileInputComponent v-model="qr_code_file" label="QR Code" />
            <!-- Logo File -->
            <FileInputComponent v-model="logo_file" label="Logo" required />
          </div>

          <ButtonComponent type="submit" variant="solid" textColor="black">
            Tambah Metode Pembayaran
          </ButtonComponent>
        </form>
      </div>
    </div>
    <!-- END : Form Tambah Metode Pembayaran -->

    <!-- START : Daftar Metode Pembayaran -->
    <div>
      <TableComponent :columns="paymentMethodTableColums" :data="paymentMethodStore.paymentMethods">
        <!-- Nama -->
        <template #cell-custom-name="{ row }">
          <div class="flex items-center gap-3">
            <div class="flex-none">
              <img v-if="row.logo_image_url" :src="row.logo_image_url" alt="Logo" class="max-h-8" />
            </div>
            <p class="text-base font-medium">{{ row.name }}</p>
          </div>
        </template>
        <!-- QR Code -->
        <template #cell-custom-qr-code="{ row }">
          <div class="flex flex-none items-center justify-center">
            <img
              v-if="row.qr_code_image_url"
              :src="row.qr_code_image_url"
              alt="QR Code"
              class="max-h-10"
            />
          </div>
        </template>
        <!-- Action -->
        <template #cell-action="{ row }">
          <div class="flex justify-end gap-2">
            <ButtonComponent size="xs" textColor="black" color="green">
              <EyeSolidIcon class="size-4" />
            </ButtonComponent>
            <ButtonComponent size="xs" textColor="black" color="lightning-yellow">
              <PenSquareSolidIcon class="size-4" />
            </ButtonComponent>
            <ButtonComponent
              @click="paymentMethodStore.deletePaymentMethod(row.id)"
              size="xs"
              textColor="black"
              color="red"
            >
              <TrashSolidIcon class="size-4" />
            </ButtonComponent>
          </div>
        </template>
      </TableComponent>
    </div>
    <!-- End : Daftar Metode Pembayaran -->
  </div>
</template>
