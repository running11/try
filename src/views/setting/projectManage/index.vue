<template>
  <div class="main-wrapper">
    <div class="title">{{$t("projectManage.title")}}</div>
    <div class="content-box">
      <div class="menu-box">
        <el-tree
          ref="tree"
          class="filter-tree"
          highlight-current
          node-key="compyId"
          :expand-on-click-node="false"
          :data="companyList"
          :props="defaultProps"
          :current-node-key="currentCompanyId"
          :default-expanded-keys="treeExpandedKeys"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="table-box">
        <project-table ref="projectTable" :companyId="currentCompanyId"></project-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import projectTable from "./components/table.vue";
import service from "@/utils/request";
import { getParentId } from "@/utils";
// import TreeTable from "@/components/treeTable/index.vue";

interface TreeData {
  id?: any;
  label?: string;
  disabled?: boolean;
  isLeaf?: boolean;
  children?: TreeData[];
}
@Component({
  components: {
    projectTable,
  },
})
export default class projectManage extends Vue {
  currentCompany: any = null;
  companyList:any = [];
  treeExpandedKeys: string[] | number[] = [];
  currentCompanyId: any = null;
  private defaultProps = {
    children: "children",
    label: "compyName",
    id: "compyId"
  };

  created(): void{
    this.getCompanyList();
  }

  // 获取公司数据 tree
  getCompanyList(): void{
    service({
      method: "get",
      url: "/dmapi/business/EmsCompany/treeList",
    })
      .then((res) => {
        if (res && res.data.code === 200) {
          let list = res.data.data || [];
          let compyId = Number(this.$route.query.compyId) || null; // 从公司管理页面跳转过来，会带上compyId
          if (!compyId) { // 如果url没有带compyId，那默认选中第一个
            if(list.length > 0){
              let arr:any = [list[0].compyId];
              this.treeExpandedKeys = arr; 
              this.currentCompany = list[0]; // 默认展开第一个
              this.currentCompanyId = list[0].compyId; // 默认选中第一个
              this.$nextTick(() => {
                (this.$refs["tree"] as any).setCurrentKey(this.currentCompanyId);
              })
            }
          }else{
            this.currentCompanyId = compyId;
            this.treeExpandedKeys = (getParentId(list, this.currentCompanyId));
            this.$nextTick(() => {
              (this.$refs["tree"] as any).setCurrentKey(this.currentCompanyId);
            })
          }
          this.companyList = list;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleNodeClick(data: any): void {
    this.currentCompany = data;
    this.treeExpandedKeys = [data.parentId, data.compyId];
    this.currentCompanyId = data.compyId;
  }
  
}
</script>
<style lang="scss" scoped>
.main-wrapper {
  height: 100%;
  background: $white;
  padding: 20px 0 20px 20px;
  // padding-top: 10px;
  .title {
    font-size: 18px;
    line-height: 36px;
  }
  .content-box {
    display: flex;
    .menu-box {
      min-width: 170px;
      box-sizing: border-box;
      padding: 20px 0;
      ::v-deep.el-tree-node__content{
        padding-right: 20px;
      }
    }
    .table-box {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
