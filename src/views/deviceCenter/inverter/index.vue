<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import deviceTable from "@/views/deviceCenter/components/templateTable.vue";
import { ITheadColums, ITableList } from "@/utils/interface";

@Component({
  mixins: [deviceTable],
})
export default class Inverter extends Vue {
  titleText = "逆变器";
  deviceForm = {
    deviceName: "",
    snNumber: "",
  };
  theadColumns: ITheadColums[] = [
    {
      text: "通信状态",
      field: "communicateStatus",
    },
    {
      text: "设备名称",
      field: "deviceName",
    },

    {
      text: "固件版本",
      field: "firmwareVersion",
    },
    {
      text: "SN号",
      field: "snNumber",
    },
    {
      text: "型号",
      field: "model",
    },

    {
      text: "品牌",
      field: "brand",
    },
    {
      text: "厂家",
      field: "manufactor",
    },
    {
      text: "项目",
      field: "projectName",
      slot: true,
    },
    {
      text: "操作",
      field: "specialOperation",
      slot: true,
    },
  ];
  list: ITableList[] = [
    {
      deviceName: "逆变器",
      snNumber: "110",
      communicateStatus: "离线",
      model: "12000",
      firmwareVersion: "2000",
      brand: "41022",
      manufactor: "上海",
      projectName: "11111",
    },
    {
      deviceName: "逆变器",
      snNumber: "110",
      communicateStatus: "离线",
      model: "12000",
      firmwareVersion: "2000",
      brand: "41022",
      manufactor: "上海",
      projectName: "22222",
    },
    {
      deviceName: "逆变器",
      snNumber: "110",
      communicateStatus: "离线",
      model: "12000",
      firmwareVersion: "2000",
      brand: "41022",
      manufactor: "上海",
      projectName: "33333",
    },
  ];

  onSubmit(): void {
    // console.log(this.list);
  }
  toDetails(): void {
    this.$router.push("/deviceCenter/inverterDetails");
  }
  toProjectDetails(): void {
    this.$router.push("/projectDetails");
  }
}
</script>
