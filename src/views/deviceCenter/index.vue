<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DeviceCenter extends Vue {}
</script>
<style lang="scss" scoped></style>
