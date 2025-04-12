<!--
 ! Sebaiknya untuk shorting juga dinamis, bisa berdasarkan waktu, harga, abjad, dsb 
-->

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  sortable: {
    type: Boolean,
    default: true,
  },
});

const sortKey = ref('');
const sortOrder = ref('asc');

const sortBy = (column) => {
  if (!column.key) return;

  if (sortKey.value === column.key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = column.key;
    sortOrder.value = 'asc';
  }
};

const sortedData = computed(() => {
  if (!props.sortable || !sortKey.value) return props.data;

  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value];
    const bVal = b[sortKey.value];
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});
</script>

<template>
  <div class="flex flex-col">
    <div class="-m-1.5 overflow-x-auto">
      <div class="inline-block min-w-full p-1.5 align-middle">
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-500 overflow-hidden rounded-xl bg-gray-800">
            <thead>
              <tr class="bg-gray-800">
                <th
                  v-for="(column, index) in columns"
                  :key="index"
                  class="cursor-pointer px-8 py-4 text-xs font-medium text-white uppercase select-none"
                  :class="[
                    column.align === 'right'
                      ? 'text-end'
                      : column.align === 'center'
                        ? 'text-center'
                        : 'text-start',
                  ]"
                  @click="sortable ? sortBy(column) : null"
                >
                  <div
                    class="flex items-center gap-x-1"
                    :class="{
                      'justify-end': column.align === 'right',
                      'justify-center': column.align === 'center',
                    }"
                  >
                    {{ column.label }}
                    <span v-if="sortable && sortKey === column.key">
                      <span v-if="sortOrder === 'asc'">▲</span>
                      <span v-else>▼</span>
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-700">
              <!-- Data Tidak Ada -->
              <tr v-if="sortedData.length === 0">
                <td :colspan="columns.length" class="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data 🙏
                </td>
              </tr>

              <!-- Data Ada -->
              <tr v-for="(row, rowIndex) in sortedData" :key="rowIndex" class="hover:bg-gray-700">
                <td
                  v-for="(column, colIndex) in columns"
                  :key="colIndex"
                  class="px-8 py-4 text-sm whitespace-nowrap text-white"
                  :class="[
                    column.align === 'right'
                      ? 'text-end'
                      : column.align === 'center'
                        ? 'text-center'
                        : 'text-start',
                    column.bold ? 'font-medium' : '',
                  ]"
                >
                  <slot
                    :name="`cell-${column.key}`"
                    :row="row"
                    :value="row[column.key]"
                    :column="column"
                  >
                    {{ row[column.key] }}
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
