<template>
    <div class='login'>

    </div>
</template>

<script>
import {getToken} from ".api/api";
import { mapState,mapMutations,mapActions} from "vuex";
export default {
    name:'Login',
  
    data() {
        return {
          metaIdJs:'',
          metaIdShow: false,
        };
    },
    computed: {
      ...mapState([
        'loginLoding',
        'metaidjs',
        'userData'
      ]),
      queryCode(){
        return this.$route.query.code
      },
      isInApp() {
      return window.appMetaIdJs;
      },
    },
    watch: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
    ...mapMutations([
        'setLoginLoding', 
        'setInjectorShow',
        'setUserData',
        'setAppAccessToken',
        'setAccessToken'
      ]),
    ...mapActions([
      'asyncSetAccessToken',
      'asyncSetLoginLoding',
      'asyncSetInjectorShow'
    ]), 
    initApp() {
      if (this.queryCode) {
        this.setLoginLoding(true);
        setTimeout(() => {
          if (this.loginLoding) {
            this.setLoginLoding(false);
            this.$cookie.remove("access_token");
          }
        }, 40000);
        this.getUserToken();
      } else {
        if (localStorage.getItem("access_token")) {
          if (this.loginLoding) return;
           this.setLoginLoding(true);
          const token = JSON.parse(localStorage.getItem("access_token") || "").refresh_token;
          this.refreshToken(token).then((res) => {
            if (!res) return this.outLogin();
            const token = res.data.access_token;
            if (!token) {
              return;
            }
            localStorage.setItem("access_token", JSON.stringify(res.data));
            this.asyncSetAccessToken(token)
            // this.$store.commit("setAccessToken", token);
            this.$cookie.set("access_token", token, res.data.expires_in);
            this.setInjector();
            this.asyncSetLoginLoding(false);
            setTimeout(() => {
              if (this.loginLoding) {
                this.asyncSetLoginLoding(false);
                this.$cookie.remove("access_token");
              }
            }, 40000);
         
          });
        }
      }
    },
    // 根据code获取token
    getUserToken() {
      const httpUrl = process.env.VUE_APP_httpUrl;
      const id = process.env.VUE_APP_appClientId;
      const secret = process.env.VUE_APP_appClientSecret;
      const params = {
        grant_type: "authorization_code",
        code: this.queryCode,
        redirect_uri: httpUrl,
        scope: "app",
        client_id: id,
        client_secret: secret,
      };
      console.log("getUserToken params:", params);
      getToken(params)
        .then((res) => {
          if (!res) return this.outLogin();
          const token = res.data.access_token;
          localStorage.setItem("access_token", JSON.stringify(res.data));
          this.asyncSetAccessToken(token)
          // this.$store.commit("setAccessToken", token);
          this.$cookie.set("access_token", token, res.data.expires_in);
          // this.gotoUrl("Home");
          this.setInjector();
        })
        .catch((err) => {
          if (err.response.status == 400) {
            this.outLogin();
          }
          return false;
        });
    },
    // 实例化第三方
    setInjector() {
      console.log("实例化");
      if (this.metaidjs) {
        return;
      }
      const htmlUrl = process.env.VUE_APP_redirectUri;
      const that = this;
      const httpUrl = process.env.VUE_APP_httpUrl;
      const id = process.env.VUE_APP_appClientId;
      const secret = process.env.VUE_APP_appClientSecret;
      this.metaidjs = new this.$metaidjs({
        baseUri: htmlUrl,
        oauthSettings: {
          clientId: id,
          clientSecret: secret,
          redirectUri: httpUrl,
        },
        onLoaded: function () {
          that.asyncSetInjectorShow(true);
          that.getUserLoginData();
        },
        onError: function (res) {
          console.log("setInjector onError:", res);
          if (res.code === 201) {
            that.asyncSetLoginLoding(false);
            localStorage.removeItem("access_token");
            that.asyncSetAccessToken(null);
            that.$cookie.remove("access_token");
          }
        },
      });
      this.metaIdJs = this.metaidjs;
      console.log(this.metaidjs);
    },
        // 获取用户信息
    getUserLoginData() {
      const accessToken = this.$cookie.get("access_token") || "";
      if (this.isInApp) {
        console.log("app getUserInfo");
        const appClientId = process.env.VUE_APP_appClientId;
        const appClientSecret = process.env.VUE_APP_appClientSecret;
        window.appMetaIdJs.getUserInfo(
          appClientId,
          appClientSecret,
          "handleUserLoginData"
        );
      } else if (accessToken) {
        console.log("web getUserInfo");
        this.metaIdJs.getUserInfo({
          accessToken,
          callback: this.handleUserLoginData,
        });
      }
    },
    handleUserLoginData(res) {
      console.log("实例化", res);
      if (typeof res === "string") {
        res = JSON.parse(res);
      }
      const accessToken = this.$cookie.get("access_token") || "";
      if (res.code === 200) {
        this.setLoginLoding(false);
        this.setInjectorShow(true);
        this.setUserData(res.data);
        console.log('userData',this.userData)
        this.userData.accessToken = accessToken;
        if (window.appMetaIdJs) {
          this.setAppAccessToken(res.appAccessToken);
          this.userData.accessToken = res.appAccessToken;
          this.setAccessToken(res.appAccessToken);
        }
        // this.InjectorLock = true;
        this.$forceUpdate();
      } else if (res.code === 202) {
        this.setLoginLoding(false);
        this.metaIdShow = true;
      } else {
        this.setLoginLoding(false);
        localStorage.removeItem("access_token");
        this.setAppAccessToken(null);
        this.$cookie.remove("access_token");
        this.outLogin();
      }
    },
    //退出登录
    outLogin() {
      localStorage.removeItem("access_token");
      this.setAccessToken(null);
      this.$cookie.remove("access_token");
      window.location.reload();
    },
    // 刷新token
    refreshToken(token) {
      const id = process.env.VUE_APP_appClientId;
      const secret = process.env.VUE_APP_appClientSecret;
      const params = {
        grant_type: "refresh_token",
        client_id: id,
        client_secret: secret,
        refresh_token: token,
      };
      return getToken(params).catch((err) => {
        return false;
      });
    },
    //跳转showmoney
    goShowMoney(url) {
        // 回调
       const httpUrl = process.env.VUE_APP_httpUrl;
       const id = process.env.VUE_APP_appClientId;
        // 第三方
        let SMhttp = process.env.VUE_APP_redirectUri + "/{{url}}";
        if (url === "login") {
          SMhttp = SMhttp.replace("{{url}}", "userLogin");
        } else {
          SMhttp = SMhttp.replace("{{url}}", "Matesign");
         
        }
        window.location.href =
          SMhttp +
          "?response_type=code&client_id=" +
          id +
          "&redirect_uri=" +
          httpUrl +
          "&scope=app&from=" +
          httpUrl;
    },
    },
};
</script>

<style scoped lang="scss">

</style>
