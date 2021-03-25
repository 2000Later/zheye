export interface PostProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  columnId: number;
}
export interface ColumnProps {
    id: number;
    title: string;
    avatar?: string;
    description: string;

}
export const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1专栏',
    avatar: 'https://v3.cn.vuejs.org/logo.png',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    id: 2,
    title: 'test2专栏',
    // avatar: 'https://v3.cn.vuejs.org/logo.png',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    id: 3,
    title: 'test3专栏',
    avatar: 'https://v3.cn.vuejs.org/logo.png',
    description: '这是的test3专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    id: 4,
    title: 'test4专栏',
    avatar: 'https://v3.cn.vuejs.org/logo.png',
    description: '这是的test4专栏，有一段非常有意思的简介，可以更新一下欧'
  }
]

export const testPosts: PostProps[] = [
  {
    id: 1,
    title: '这是我的第一篇文章',
    content: '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    image: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee1980819f4ae08ac78d458.png?x-oss-process=image/resize,m_fill,m_pad,w_200,h_110',
    createdAt: '2020-06-11 10:34:22',
    columnId: 1
  },
  {
    id: 2,
    title: '这是我的第二篇文章',
    content: '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    createdAt: '2020-06-11 10:34:22',
    columnId: 1
  },
  {
    id: 3,
    title: '这是我的第三篇文章',
    content: '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    image: 'https://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5edcc2329f2b4e28352b75eb.jpg?x-oss-process=image/resize,m_fill,m_pad,w_200,h_110',
    createdAt: '2020-06-11 10:34:22',
    columnId: 1
  }
]
