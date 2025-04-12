<script setup>
import ListOrdersTablePartial from './partials/ListOrdersTable.vue';
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : ... -->
    <div class="w-full">Filter</div>
    <!-- END : ... -->

    <hr class="border-gray-800" />

    <!-- START : Table -->
    <div class="w-full">
      <ListOrdersTablePartial />
    </div>
    <!-- END : Table -->
  </div>
</template>
