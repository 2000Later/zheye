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
