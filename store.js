import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
      userData: "",
      appAccessToken: "",
      metaidjs: "",
      InjectorShow: false,
      loginLoding: false,
      PhoneShow: false,
      lang:"",
    },
    getters: {
      userData(state) {
        return state.userData;
      },
      isLogined(state) {
        return !!state.accessToken && !!state.userData;
      },
      hasAccessToken(state) {
        return !!state.accessToken;
      },
    },
    mutations: {
      setLang(state,payload){
        state.lang=payload
      },
      setUserData(state, payload) {
        state.userData = payload;
      },
      setAccessToken(state, token) {
        state.accessToken = token;
      },
      setLoginLoding(state,payload){
        state.loginLoding=payload 
      },
      setMetaidJs(state,payload){
        state.metaidjs=payload 
      },
      setInjectorShow(state,payload){
        state.InjectorShow=payload 
      },
      setPhoneShow(state,payload){
        state.PhoneShow=payload 
      },
      setAppAccessToken(){
        state.appAccessToken=payload 
      },
    },
    actions:{
      asyncSetAccessToken({commit},payload){
        commit('setAccessToken',payload)
      },
      asyncSetLoginLoding({commit},payload){
        commit('setLoginLoding',payload)
      },
      asyncSetMetaidJs({commit},payload){
        commit('setMetaidJs',payload)
      },
      asyncSetInjectorShow({commit},payload){
        commit('setInjectorShow',payload)
      },
      asyncSetPhoneShow({commit},payload){
        commit('setPhoneShow',payload)
      }
    }
   
    
  });