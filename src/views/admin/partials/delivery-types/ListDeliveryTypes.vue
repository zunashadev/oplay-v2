<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 📌 Stores
import { useDeliveryTypeStore } from '@/stores/deliveryTypeStore';

// 📌 Components
import TableComponent from '@/components/tables/Table.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

import EditDeliveryTypeModalComponent from '../../components/delivery-types/EditDeliveryTypeModal.vue';
import DeleteDeliveryTypeModalComponent from '../../components/delivery-types/DeleteDeliveryTypeModal.vue';

// 📌 Icons
import EditIcon from '@/components/icons/Edit.vue';
import TrashIcon from '@/components/icons/Trash.vue';

// 📌 Inisialisasi Stores
const deliveryTypeStore = useDeliveryTypeStore();

onMounted(() => {
  deliveryTypeStore.fetchDeliveryTypes();
});

const columns = [
  { label: 'Direction', key: 'direction' },
  { label: 'Key', key: 'key' },
  { label: 'Label', key: 'label' },
  { label: 'Deskripsi', key: 'description' },
  { label: 'Required Metadata Fields', key: 'required_metadata_fields' },
  { label: 'Action', key: 'action', align: 'right' },
];

// 📌 Edit Metode Pengiriman
const editDeliveryTypeModalRef = ref(null);

function openEditDeliveryTypeModal(id) {
  editDeliveryTypeModalRef.value.openModal(id);
}

// 📌 Delete Metode Pengiriman
const deleteDeliveryTypeModalRef = ref(null);

const openDeleteDeliveryTypeModal = async (id) => {
  deleteDeliveryTypeModalRef.value.openModal(id);
};
</script>

<template>
  <!-- Edit Metode Pengiriman -->
  <EditDeliveryTypeModalComponent ref="editDeliveryTypeModalRef" />
  <!-- Delete Metode Pengiriman -->
  <DeleteDeliveryTypeModalComponent ref="deleteDeliveryTypeModalRef" />

  <div class="rounded-xl bg-gray-900 px-5 py-5">
    <TableComponent :columns="columns" :data="deliveryTypeStore.deliveryTypes">
      <!-- Action -->
      <template #cell-action="{ row }">
        <div class="flex justify-end gap-2">
          <!-- Edit -->
          <ButtonComponent @click="openEditDeliveryTypeModal(row.id)" variant="link" size="xs">
            <EditIcon class="size-4" />
          </ButtonComponent>
          <!-- Delete -->
          <ButtonComponent
            @click="openDeleteDeliveryTypeModal(row.id)"
            variant="link"
            size="xs"
            color="red"
          >
            <TrashIcon class="size-4" />
          </ButtonComponent>
        </div>
      </template>
    </TableComponent>
  </div>
</template>
