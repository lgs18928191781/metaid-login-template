import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import MetaIdJs from "metaidjs"
import VueCookies from "vue-cookies";
import VueI18n from "vue-i18n";
Vue.config.productionTip = false;
Vue.config.devtools = true
Vue.use(VueCookies);
Vue.use(VueI18n);
Vue.prototype.$metaidjs = MetaIdJs;
Vue.prototype.$cookie = VueCookies;
const i18n = new VueI18n({
    locale: "zh", // 定义默认语言为中文
    messages: {
      zh: require("./assets/lang/zh.json"),
      en: require("./assets/lang/en.json")
    }
});
new Vue({
    router,
    i18n,
    store,
    render: (h) => h(App),
  }).$mount("#app");