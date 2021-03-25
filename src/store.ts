import { Commit, createStore } from 'vuex'
import axios from 'axios'

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: number;
  column?: string;
  email?: string;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createAt?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;

}
export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
export interface GlobalDataProps {
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
async function getAndCommit (url: string, mutationName: string, commit: Commit) {
  const { data } = await axios.get('/api/' + url)
  commit(mutationName, data)
}
/**
 *
 * @param url 地址
 * @param mutationName 方法名称
 * @param commit // 提交mutation处理
 * @param payload 调用action方法传入的参数
 * @returns
 */
async function postAndCommit (url: string, mutationName: string, commit: Commit, payload: any) {
  const { data } = await axios.post(`/api/${url}`, payload)
  commit(mutationName, data)
  return data
}
export default createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'Jack' }
    // },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading (state, status) {
      state.loading = status
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      // axios.get('/api/columns').then(res => {
      //   commit('fetchColumns', res.data)
      // })
      getAndCommit('columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      getAndCommit(`columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      getAndCommit(`columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchCurrentUser ({ commit }) {
      getAndCommit('user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('user/login', 'login', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then((res) => {
        console.log(res)
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    biggerColumnsLen (state) {
      return state.columns.filter(c => +c._id > 2).length
    },
    getColumnById: (state) => (id: string) => state.columns.find(c => c._id === id),
    getPostsById: (state) => (cid: string) => state.posts.filter(post => post.column === cid)
  }
})
