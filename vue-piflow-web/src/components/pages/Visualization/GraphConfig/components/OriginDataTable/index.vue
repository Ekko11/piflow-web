<template>
  <div>
    <!-- Table button -->
    <Table border :columns="columns" :data="tableData"> </Table>
    <!-- paging -->
    <div class="page">
      <Page
        :prev-text="$t('page.prev_text')"
        :next-text="$t('page.next_text')"
        show-elevator
        :show-total="true"
        :total="total"
        show-sizer
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "OriginDataTable",
  props: {
    originalData: Array,
  },
  data() {
    return {
      tableData: [],
      total: 0,
      page:1,
      limit:10
    };
  },
  computed:{
      columns(){
        if(this.tableData.length){
          return Object.keys(this.tableData[0]).map(v=>({title:v,key:v,minWidth:80}))
        }
        return []
      }
  },
  watch: {
    originalData(val) {
      if(val !== this.tableData){
        this.total = val.length
        this.getTableData()
      }
    },
  },
  methods: {

    getTableData(){
      const p = this.page
      const s = this.limit
      this.tableData = this.originalData.slice((p - 1) * s, p * s)
    },


    onPageChange(pageNo) {
      this.page = pageNo;
      this.getTableData();
    },
    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
