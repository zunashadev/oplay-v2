<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 📌 Stores
import { useDeliveryTypeStore } from '@/stores/deliveryTypeStore';

// 📌 Components
import DialogModalComponent from '@/components/modals/DialogModal.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import TextAreaComponent from '@/components/form/TextArea.vue';
import SelectComponent from '@/components/form/Select.vue';

// 📌 Inisialisasi Stores
const deliveryTypeStore = useDeliveryTypeStore();

// START : MODAL
const dialogModalRef = ref(null);

async function openModal(deliveryTypeId) {
  selectedDeliveryTypeId.value = deliveryTypeId;

  if (selectedDeliveryTypeId.value) {
    const data = await deliveryTypeStore.fetchDeliveryTypeById(selectedDeliveryTypeId.value);

    if (data) {
      deliveryType.value = data;
      direction.value = data.direction;
      key.value = data.key;
      label.value = data.label;
      description.value = data.description;
      requiredMetadataFields.value = data.required_metadata_fields;
    }
  }

  dialogModalRef.value.openModal();
}

function closeModal() {
  selectedDeliveryTypeId.value = '';
  deliveryType.value = '';
  direction.value = '';
  key.value = '';
  label.value = '';
  description.value = '';
  requiredMetadataFields.value = [''];

  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : EDIT PRODUCT
const selectedDeliveryTypeId = ref('');
const deliveryType = ref('');

const direction = ref('');
const key = ref('');
const label = ref('');
const description = ref('');
const requiredMetadataFields = ref(['']);

const addField = () => {
  requiredMetadataFields.value.push('');
};

const removeField = (index) => {
  requiredMetadataFields.value.splice(index, 1);
};

const updateDeliveryType = async () => {
  if (!selectedDeliveryTypeId.value) return alert('ID metode pemesanan tidak ditemukan');

  if (
    !direction.value.trim() ||
    !key.value.trim() ||
    !label.value.trim() ||
    !description.value.trim()
  ) {
    return alert('Direction, key, label, dan deskripsi tidak boleh kosong.');
  }

  const keyRegex = /^[a-z_]+$/;
  if (!keyRegex.test(key.value)) {
    return alert("Key hanya boleh mengandung huruf kecil dan underscore ('_').");
  }

  const cleanedFields = requiredMetadataFields.value.map((f) => f.trim()).filter((f) => f !== '');
  if (cleanedFields.length === 0) return alert('Minimal 1 field metadata diperlukan.');

  const updatedData = {
    direction: direction.value,
    key: key.value,
    label: label.value,
    description: description.value,
    required_metadata_fields: cleanedFields,
  };

  await deliveryTypeStore.updateDeliveryType(selectedDeliveryTypeId.value, updatedData);

  if (!deliveryTypeStore.error) {
    closeModal(); // Tutup modal jika tidak ada error
  }
};
// END : EDIT PRODUCT

// 📌 Direction
const directions = [
  {
    id: 'admin_to_customer',
    name: 'Admin to Customer - Admin memberikan data ke customer',
  },
  {
    id: 'customer_to_admin',
    name: 'Customer to Admin - Customer memberikan data ke admin',
  },
];
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Edit Metode Pengiriman">
    <form @submit.prevent="updateDeliveryType" class="flex flex-col gap-5">
      <div class="flex flex-col gap-5">
        <!-- Arah Pengiriman Data -->
        <SelectComponent
          class="w-full"
          v-model="direction"
          :options="directions"
          label="Arah pengiriman data"
          labelKey="name"
          valueKey="id"
          placeholder="Pilih arah pengiriman data"
          required
        >
        </SelectComponent>

        <!-- Key -->
        <InputComponent
          v-model="key"
          label="Key (gunakan huruf kecil dan underscore '_' sebagai pemisah antar kata)"
          placeholder="Masukkan key metode pengiriman"
          required
        />

        <!-- Label -->
        <InputComponent
          v-model="label"
          label="Label"
          placeholder="Masukkan label metode pengiriman"
          required
        />

        <!-- Deskripsi -->
        <TextAreaComponent
          v-model="description"
          label="Deskripsi"
          placeholder="Masukkan deskripsi metode pengiriman"
          required
        />

        <!-- Metadata Fields -->
        <div class="flex flex-col gap-1">
          <label class="block text-sm text-gray-500">
            Field Metadata yang Dibutuhkan (gunakan huruf kecil semua)
            <span class="text-red-500">*</span>
          </label>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-2">
              <div
                v-for="(field, index) in requiredMetadataFields"
                :key="index"
                class="flex items-center gap-2"
              >
                <InputComponent
                  v-model="requiredMetadataFields[index]"
                  placeholder="Contoh: email, password, username"
                  required
                  class="w-full"
                />
                <button
                  type="button"
                  @click="removeField(index)"
                  class="text-xs text-red-500 transition-all hover:cursor-pointer hover:text-red-600"
                  v-if="requiredMetadataFields.length > 1"
                >
                  Hapus
                </button>
              </div>
            </div>

            <ButtonComponent
              @click="addField"
              variant="solid"
              color="green"
              textColor="black"
              size="xs"
            >
              + Tambah Field Metadata
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <ButtonComponent
        type="submit"
        variant="solid"
        textColor="black"
        :disabled="deliveryTypeStore.loading"
      >
        Edit Metode Pengiriman
      </ButtonComponent>
    </form>
  </DialogModalComponent>
</template>
