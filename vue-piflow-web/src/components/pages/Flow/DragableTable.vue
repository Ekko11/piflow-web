<template>
  <Modal
    v-model="open"
    title="组件展示排序"
    :ok-text="$t('modal.ok_text')"
    :cancel-text="$t('modal.cancel_text')"
    @on-ok="handleComfirm"
    width="900"
  >
    <div class="modal-warp">
      <div class="table_head">
        <Row>
          <Col span="2">
            <div class="drag">排序</div>
          </Col>
          <Col span="10">
            <div>组件名称</div>
          </Col>
          <Col span="10">
            <div>已选中属性</div>
          </Col>
        </Row>
      </div>
      <draggable
        v-model="data"
        group="site"
        animation="300"
        dragClass="dragClass"
        ghostClass="ghostClass"
        chosenClass="chosenClass"
        handle=".move"
      >
        <transition-group>
          <div class="table_body" v-for="item in data" :key="item.stopId">
            <Row v-if="item">
              <Col span="2">
                <div class="drag move" ><Icon type="ios-menu" /></div>
              </Col>
              <Col span="10">
                <div>{{ item.stopName }}</div>
              </Col>
              <Col span="12">
                <div>
                  {{
                    item.stopPublishingPropertyVos
                      .map((v) => v.name)
                      .join(" , ")
                  }}
                </div>
              </Col>
            </Row>
          </div>
        </transition-group>
      </draggable>
    </div>
  </Modal>
</template>
  
  <script>
import draggable from "vuedraggable";
export default {
  components: { draggable },
  data() {
    return {
      open: false,
      data: [],
    };
  },
  created() {},
  methods: {
    handleComfirm() {
        this.data = this.data.map((v,i)=>({
            ...v,
            bak1:i+1+'',
            stopPublishingPropertyVos:v.stopPublishingPropertyVos.map(k=>({
                ...k,
                bak1:i+1+'',
            }))

            
        }))
        this.$emit('stopChange',this.data)
    },
    handleOpen(data) {
        if(data[0].bak1){
            data.sort(function(a, b) {  
                return parseInt(a.bak1, 10) - parseInt(b.bak1, 10);  
            }); 
        }
      this.data = data
      this.open = true;
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.table_head {
  div {
    text-align: center;
    line-height: 36px;
    border-radius: 6px 6px 0 0;
    font-size: 14px;
    color: #515a6e;
    background: #f8f8f9;
  }
}
.table_body {
  border: 1px solid #eee;
  > div > div {
    border-right: 1px solid #eee;
    &:last-child {
      border: 0;
    }
  }
  div {
    line-height: 36px;
    text-indent: 5px;
  }
  .drag {
    text-align: center;
    font-size: 28px;
    text-indent: 0;
  }
  .move{
    cursor: pointer;
  }
}
</style>
  
