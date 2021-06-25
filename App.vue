<template>
  <div id='app'>
      <router-view/>
  </div>
</template>
<script>
import {mapMutations} from "vuex";
export default {
  name:"App",
  data() {
    return {
      
    }
  },
  created(){
    this.getSyetemLang()
  },
  methods: {
      ...mapMutations(['setLang']),
      getSyetemLang() {
      switch (navigator.language) {
        case "en":
          this.$i18n.locale = "en";
          this.setLang(this.$i18n.locale);
          break;
        case "zh-CN":
          this.$i18n.locale = "zh";
          this.setLang(this.$i18n.locale);
          break;
        default:
          break;
      }
    },
  },
}
</script>