<template>
  <div class="main-wrapper">
    <div class="tab-box">
      <el-tabs tab-position="top">
        <el-tab-pane :label="text.tabText">
          <basic-information></basic-information>
        </el-tab-pane>
        <el-tab-pane :label="text.tabPassword">
          <change-password></change-password>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import basicInformation from "./basicInformation/index.vue";
import changePassword from "./changePassword/index.vue";
import i18n from "@/language";

@Component({
  components: {
    basicInformation,
    changePassword,
  },
})
export default class PersonCenter extends Vue {
  text = {
    tabText: i18n.t("personCenter.tabText"),
    tabPassword: i18n.t("personCenter.tabPassword"),
   
  };
}
</script>
<style lang="scss" scoped>
.tab-box {
  padding: 20px;
  background: $white;
  ::v-deep .el-tabs__item:focus.is-active.is-focus:not(:active) {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
</style>
