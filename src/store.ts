import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from '@/helper'

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
  isHTML?: boolean;
}
interface ListProps <P>{
  [id: string]: P;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: { data: ListProps<ColumnProps>; isLoaded: boolean; total: number };
  posts: { data: ListProps<PostProps>; loadedColumns: string[] };
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
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit,
  config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(`/api/${url}`, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

export default createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, isLoaded: false, total: 0 },
    posts: { data: {}, loadedColumns: [] },
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'Jack' }
    // },
    createPost (state, newPost) {
      // state.posts.push(newPost)
      state.posts.data[newPost._id] = newPost
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count } = rawData.data
      // console.log(list)
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        isLoaded: true
      }
      // state.columns.data = arrToObj(rawData.data.list)
      // state.columns.isLoaded = true
    },
    fetchColumn (state, rawData) {
      // state.columns = [rawData.data]
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      // state.posts = rawData.data.list
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost (state, rawData) {
      // state.posts = [rawData.data]
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost (state, { data }) {
      // state.posts = state.posts.filter(post => post._id !== data._id)
      delete state.posts.data[data._id]
    },
    updatePost (state, { data }) {
      // state.posts = state.posts.map((post) => {
      //   if (post._id === data._id) {
      //     return data
      //   } else {
      //     return post
      //   }
      // })
      state.posts.data[data._id] = data
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
    // 获取全部专栏
    fetchColumns ({ state, commit }, params = {}) {
      // axios.get('/api/columns').then(res => {
      //   commit('fetchColumns', res.data)
      // })
      // if (!state.columns.isLoaded) {
      //   getAndCommit('columns', 'fetchColumns', commit)
      // }
      const { currentPage = 1, pageSize = 6 } = params
      return asyncAndCommit(`columns/?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
    },
    // 获取单个专栏
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        getAndCommit(`columns/${cid}`, 'fetchColumn', commit)
      }
    },
    // 获取文章列表
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) { // loadedColumns 没有cid就去请求
        return asyncAndCommit(`columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    // 获取单个文章
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) { // 文章列表没有 或者 单个文章没有content字段就请求数据
        return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
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
    deletePost ({ commit }, id) {
      return asyncAndCommit(`posts${id}`, 'deletePost', commit, { method: 'delete' })
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
    getColumns: (state) => objToArr(state.columns.data),
    // getColumnById: (state) => (id: string) => state.columns.find(c => c._id === id),
    getColumnById: (state) => (id: string) => state.columns.data[id],
    getPostsBycId: (state) => (cid: string) => objToArr(state.posts.data).filter(post => post.column === cid),
    getCurrentPost (state) {
      // return (id: string) => state.posts.find(c => c._id === id)
      return (id: string) => state.posts.data[id]
    }
  }
})
