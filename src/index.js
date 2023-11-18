import Vue from 'vue'
import Vuex from 'vuex'
// import router from "@/router";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentPathName: ''
  },
  mutations: {
    setPath (state) {
      state.currentPathName = localStorage.getItem("currentPathName")
    },
    logout() {
      localStorage.removeItem("user")
      // router.push("/login")

    }
  }
})

export default store