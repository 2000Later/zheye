import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'

export interface ResponseType <P = {}>{
  code: number;
  mes: string;
  data: P;
}

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}

export interface ImageProps {
  _id?: string;
  url?: string;
  createAt?: string;
  fitUrl?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
async function getAndCommit (url: string, mutationName: string, commit: Commit) {
  const { data } = await axios.get('/api/' + url)
  commit(mutationName, data)
  return data
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

// 重构请求方法
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
  const { data } = await axios(url, config)
  commit(mutationName, data)
  return data
}

export default createStore<GlobalDataProps>({
  state: {
    error: { status: false },
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
    fetchPost (state, rawData) {
      state.posts = [rawData.data]
    },
    updatePost (state, { data }) {
      state.posts = state.posts.map((post) => {
        if (post._id === data._id) {
          return data
        } else {
          return post
        }
      })
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.Authorization
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
    fetchPost ({ commit }, id) {
      return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`posts${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('user/login', 'login', commit, payload)
    },
    createPost ({ commit }, payload) {
      return postAndCommit('posts', 'createPost', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then((res) => {
        console.log('login返回了一个promise', res)
        dispatch('fetchCurrentUser')
        // return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    biggerColumnsLen (state) {
      return state.columns.filter(c => +c._id > 2).length
    },
    getColumnById: (state) => (id: string) => state.columns.find(c => c._id === id),
    getPostsById: (state) => (cid: string) => state.posts.filter(post => post.column === cid),
    getCurrentPost (state) {
      return (id: string) => state.posts.find(c => c._id === id)
    }
  }
})
