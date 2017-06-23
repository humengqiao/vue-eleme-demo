<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive> 
  </div>
</template>

<script>
import header from './components/header/header';
const ERR_OK=0;
const URL='http://www.humengqiao.net/eleme/getjson.php?type=seller';

export default{
  data(){
    return{
      seller:{}
    }
  },
  async beforeMount(){
    let result=await this.$http.get('api/seller?id=123');
    if(result.status===200){
      let dataObj=await result.json();
      if(dataObj.errno===ERR_OK){
        this.seller=dataObj.data;
      }
    }else{
      alert(result.statusText);
    }
  },
  components:{
    'v-header':header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  #app
    .tab
      display:flex
      width:100%
      height:40px
      line-height:40px
      .tab-item
        flex:1
        text-align:center
        &>a
          display:block
          font-size:14px
          color:rgb(77,85,93)
          &.active
            color:rgb(240,20,20)
</style>
