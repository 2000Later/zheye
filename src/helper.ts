import { ColumnProps, UserProps, ImageProps } from '@/store'
// export const generateFitUrl = (column: ColumnProps, width: number, height: number) => {
//   if (column.avatar) {
//     column.avatar.fitUrl = column.avatar.url + `?x-oss-process=image/resize,m_fixed,h_${height},w_${width}`
//   } else {
//     column.avatar = {
//       fitUrl: require('@/assets/column.jpg')
//     }
//   }
//   return column
// }

export function generateFitUrl (data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

export function addColumnAvatar (data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}

interface CheckCodition {
    format: string[];
    size: number;
}
type ErrorType = 'size' | 'format' | null

export const beforeUploadCheck = (file: File, conditiom: CheckCodition) => {
  // const { size, type} = file
  const { format, size } = conditiom
  // 验证图片大小是否符合
  const isVaildSize = size ? file.size / 1024 / 1024 < size : true
  // 验证图片格式是否符合
  const isVaildFormat = format ? format.includes(file.type) : true
  let error: ErrorType = null
  if (!isVaildSize) {
    error = 'size'
  }
  if (!isVaildFormat) {
    error = 'format'
  }
  return {
    passed: isVaildSize && isVaildFormat,
    error
  }
}

interface TestProps {
  _id: string;
  name: string;
}

const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]

// 将数组转换为键值对的对象
export const arrToObj = <T extends { _id?: string}>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}

// const result = arrToObj(testData)
// console.log(result)
const testData2: { [key: string]: TestProps} = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
}

// 将键值对的对象 转换为普通数组
export const objToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map(key => obj[key])
}
// const result2 = objToArr(testData2)
// console.log(result2)
