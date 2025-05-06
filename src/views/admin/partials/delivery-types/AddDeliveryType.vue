<script setup>
import { ref } from 'vue';

// 📌 Stores
import { useDeliveryTypeStore } from '@/stores/deliveryTypeStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import SelectComponent from '@/components/form/Select.vue';
import TextAreaComponent from '@/components/form/TextArea.vue';

// 📌 ...
const deliveryTypeStore = useDeliveryTypeStore();

// 📌 ...
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

// 📌 Add Delivery Type
const addDeliveryType = async () => {
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

  try {
    await deliveryTypeStore.addDeliveryType(
      direction.value,
      key.value,
      label.value,
      description.value,
      cleanedFields,
    );

    // Reset form
    direction.value = '';
    key.value = '';
    label.value = '';
    description.value = '';
    requiredMetadataFields.value = [''];
  } catch (err) {
    // Sudah ditangani oleh handleResponse di store
  }
};

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
  <div class="overflow-hidden rounded-xl bg-gray-900">
    <div class="bg-gray-800 px-3 py-3">
      <p class="text-lg font-medium">➕ Tambah Metode Pengiriman</p>
    </div>

    <div class="px-5 py-5">
      <form @submit.prevent="addDeliveryType" class="flex flex-col gap-5">
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

        <ButtonComponent type="submit" variant="solid" textColor="black">
          Tambah Metode Pengiriman
        </ButtonComponent>
      </form>
    </div>
  </div>
</template>
