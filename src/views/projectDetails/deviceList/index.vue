<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="form" ref="searchForm">
        <el-form-item :label="$t('deviceList.deviceType')">
          <el-select v-model="form.deviceType" :placeholder="$t('common.pleaseSelect')">
            <el-option
              v-for="item in deviceList"
              :key="item.dictValue"
              :label="item.desc"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('deviceList.deviceName')">
          <el-input
            v-model="form.deviceName"
            :placeholder="$t('deviceList.pleaseEnterDeviceName')"
          ></el-input>
        </el-form-item>
        <el-form-item label="SN">
          <el-input v-model="form.SNNumber" :placeholder="$t('deviceList.pleaseEnterSNNumber')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData">{{$t("common.search")}}</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetForm">{{$t("common.reset")}}</el-button>
        </el-form-item>
      </el-form>
      <el-button class="add-btn" type="primary" @click="showDialog('add')">{{$t("common.new")}}</el-button>
    </div>
    <div class="table-wrapper">
      <e-table
        :loading="listLoading"
        :tableCloumns="theadColumns"
        :tableData="list"
      >
      <template slot="devType" slot-scope="scope">
        {{getDeviceTypeLabel(scope.value)}}
      </template>
      </e-table>
      <div class="pagination-box">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :page-size="pageSize"
          :current-page="page"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <device-dialog
      ref="deviceDialog"
      :deviceList="deviceList"
      :title="deviceDialogTitle"
      :current-device="currentDevice"
      @fetchData="fetchData"
    ></device-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ITheadColums, ITableList } from "@/utils/interface";
import ETable from "@/components/eTable/index.vue";
import DeviceDialog from "@/views/projectDetails/deviceList/components/dialog.vue";
import service from "@/utils/request";
import moment from "moment";
import { Form } from "element-ui";
import i18n from "@/language";
import { getLable } from "@/utils";

interface IDevice {
  devName: string;
  devSn: string;
  devAddress: string;
  devType: undefined | number | string;
  devModel: string;
  [propName: string]: any;
}

@Component({
  components: {
    ETable,
    DeviceDialog
  },
})
export default class DeviceList extends Vue {
  private listLoading = false;
  private projectId:any = "";
  private total = 0;
  private page = 1;
  private pageSize = 10;
  deviceDialogTitle = '';
  currentDevice: any = null;
  form: any = {
    deviceType: "",
    deviceName: "",
    SNNumber: "",
  };
  deviceList: any = [];
  theadColumns: ITheadColums[] = [
    {
      text: i18n.t(`deviceList.deviceName`) as string,// 设备名称
      field: "devName",
    },
    {
      text: i18n.t(`deviceList.deviceSN`) as string, // 设备sn
      field: "devSn",
    },
    {
      text: i18n.t(`deviceList.deviceAddress`) as string, // 设备地址
      field: "devAddress",
    },
    {
      text: i18n.t(`deviceList.deviceType`) as string, // 设备类型
      field: "devType",
      slot: true
    },
    {
      text: i18n.t(`deviceList.deviceModel`) as string, // 设备型号
      field: "devModel",
    },
    {
      text: i18n.t(`deviceList.manufacturer`) as string, // 生产厂家
      field: "company",
    },
    {
      text: i18n.t(`deviceList.brand`) as string, // 品牌
      field: "brand",
    },
    {
      text: i18n.t(`deviceList.installTime`) as string, // 安装时间
      field: "installTime",
      slot: true,
      render: (h: any, params: any) => {
        if(params.row.installTime.toString().length > 10) {
          return h('div', moment(params.row.installTime).format("YYYY-MM-DD"))
        }else{
          return h('div', '')
        }
      }
    },
    {
      text: i18n.t(`deviceList.gatewaySN`) as string, // 网关sn
      field: "gatewaySn",
    },
    {
      text: i18n.t(`deviceList.deviceGroup`) as string, // 设备分组
      field: "devGroup",
    },
    {
      text: i18n.t(`common.operation`) as string, // 操作
      field: "specialOperation",
      slot: true,
      render: (h: any, params: any) => {
        return h("div", {}, [h("i", {
          class: "icon el-icon-edit",
          on: {
            click: () => {
              this.showDialog('edit', params.row);
            },
          },
        }), h("i", {
          class: "icon el-icon-delete",
          on: {
            click: () => {
              this.handleDetele(params.row);
            },
          },
        })]);
      },
    },
  ];
  list: ITableList[] = [];

  created(): void{
    this.projectId = this.$route.query.id; // projectId
    this.getDeviceType();
  }

  async getDeviceType(){ // 获取设备类型
    await service({
      method: "get",
      url: `/dmapi/system/dict/data/type/device_type`
    })
      .then((res) => {
        if (res && res.data.code === 200) {
          let list = res.data.data;
          for(let i = 0, len = list.length; i < len; i++){
            list[i]["desc"] = i18n.t(`deviceList.${list[i].dictLabel}`);
          }
          this.deviceList = list;
          this.fetchData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getDeviceTypeLabel(value: string | number){
    return getLable(this.deviceList, value, 'dictValue', 'desc');
  }

  fetchData(): void{
    const paramsData = {
      DevId: undefined,
      ProjectId: this.projectId || 1,
      DevName: this.form.deviceName,
      DevSn: this.form.SNNumber,
      DevAddress: "",
      DevType: this.form.deviceType,
      DevModel: "",
      Company: "",
      Brand: "",
      InstallTime: "",
      GatewaySn: "",
      DevGroup: "",
      PageNum: this.page,
      PageSize: this.pageSize,
      Sort: "",
      SortType: "ascending"
    };
    this.listLoading = true;
    service({
      method: "get",
      url: "/dmapi/business/EmsDevice/list",
      params: paramsData,
    })
      .then((res) => {
        if (res && res.data.code === 200) {
          this.list = res.data.data.result || [];
          this.total = res.data.data.totalNum || 0;
        }
        this.listLoading = false;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleCurrentChange(val: number): void {
    this.page = val;
    this.fetchData();
  }
  resetForm(): void{
    this.form = {
      deviceType: "",
      deviceName: "",
      SNNumber: "",
    };
    if (this.$refs['searchForm']) {
      (this.$refs['searchForm'] as Form).resetFields();
    }
  }
  showDialog(type: string, row: IDevice): void {
    let obj: any = {
      add: i18n.t(`deviceList.addDevice`) as string, // 新增设备
      edit: i18n.t(`deviceList.editDevice`) as string, // 修改设备
    };
    this.deviceDialogTitle = obj[type];
    this.currentDevice = {};
    (this.$refs.deviceDialog as any).showDialog();
    type === "add" ? this.loadDailogData() : this.loadDailogData(JSON.parse(JSON.stringify(row)));
  }
  loadDailogData(row?: IDevice): void {
    let defaultData: IDevice = {
      devId: undefined,
      projectId: Number(this.projectId),
      devName: "",
      devSn: "",
      devAddress: "",
      devType: undefined,
      devModel: "",
      company: "",
      brand: "",
      installTime: undefined,
      gatewaySn: "",
      devGroup: ""
    };
    this.currentDevice = row || defaultData;
  }
  handleDetele(row: any): void{
    this.$confirm(i18n.t(`common.deletePrompt`) as string, i18n.t(`common.prompt`) as string, {
      confirmButtonText: i18n.t(`common.confirmButtonText`) as string,
      cancelButtonText: i18n.t(`common.cancelButtonText`) as string,
      type: "warning",
    }).then(() => {
      service({
        method: "delete",
        url: `/dmapi/business/EmsDevice/${row.devId}`,
      }).then((res) => {
        if (res && res.data.code === 200) {
          this.$message({
            message: i18n.t(`common.deleteSuccess`) as string,
            center: true,
            type: "success"
          });
          this.fetchData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    });
  }
}
</script>
<style lang="scss" scoped>
.search-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  background: $white;
  padding: 15px 20px;
  ::v-deep.el-form-item {
    margin-bottom: 0;
    margin-right: 20px;
  }
}
.table-wrapper {
  background: $white;
  padding: 15px 20px;
  .icon-bianzu {
    font-size: 18px;
    color: #cccccc;
  }
  .online {
    color: #00cc00;
  }
  .pagination-box {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
