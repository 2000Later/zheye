import { ColumnProps } from '@/store'
export const generateFitUrl = (column: ColumnProps, width: number, height: number) => {
  console.log(column, width, height)
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
