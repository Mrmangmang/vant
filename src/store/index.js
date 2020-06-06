import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

// 这样做的目的可以避免访问和获取数据的名字不一致导致的问题
const USER_KEY = 'TOUTIAO_USER'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY), // 当前登录用户的登录状态（token等数据）
    // 用户的登录状态信息
    // user: JSON.parse(window.localStorage.getItem('TOUTIAO_USER')),
    async onLogin () {
      // Toast.loading({
      this.$toast.loading({
        message: '登录中...', // 提示文本
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
      })
      // 1. 找到数据接口
      // 2. 封装请求方法
      // 3. 请求调用登录
      try {
        const { data } = await login(this.user)

        // 4. 处理响应结果
        this.$toast.success('登录成功')

        // 将后端返回的用户登录状态（token等数据）放到 Vuex 容器中
            this.$store.commit('setUser', data.data)
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中，这里仅仅是为了持久化数据
      setItem(USER_KEY, state.user)
      // window.localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {
  },
  modules: {
  },
})