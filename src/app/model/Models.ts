// 定义为可空且初始值为空的值
// 暂时没找到比较好看的写法
export class Task {
  id: String | null = null
  name: String | null = null
  description: String | null = null
  code: String | null = null
  enabled: Boolean | null = null
  cronExpression: String | null = null
  interval: Number | null = null
  async: Boolean = false
  createDate: String | null = null
  updateDate: String | null = null
}
