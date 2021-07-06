import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import MetaIdJs from "metaidjs"
import VueCookies from "vue-cookies";
Vue.config.productionTip = false;
Vue.config.devtools = true
Vue.use(VueCookies);
Vue.prototype.$metaidjs = MetaIdJs;
Vue.prototype.$cookie = VueCookies;

new Vue({
    router,
    i18n,
    store,
    render: (h) => h(App),
  }).$mount("#app");