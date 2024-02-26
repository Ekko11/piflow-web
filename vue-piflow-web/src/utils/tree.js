/**
 * @description 判断数据类型
 * @param {*} obj 传入数据
 * @returns String
 */
export const typeOf = obj => {
    if (obj instanceof Element) {
      return 'element'
    } else {
      // toString会返回对应不同的标签的构造函数
      const toString = Object.prototype.toString
      const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
      }
      return map[toString.call(obj)]
    }
  }

/**
 * 查找数据对应节点（深度优先）
 * @param {Array} data 数据
 * @param {*} value 数值
 * @param {*} key key
 */
export const findTree = (data, value, key = 'id') => {
    const stack = []
    const type = typeOf(data)
    let root = {}
  
    if (type === 'array') {
      root.name = 'root'
      root.children = data
    } else if (type === 'object') {
      root = data
    } else {
      return null
    }
  
    stack.push(root)
    while (stack.length) {
      const current = stack.pop()
      if (!current) continue
      if (current[key] == value) return current
  
      if (current.children && current.children.length) {
        for (let i = 0; i < current.children.length; i++) {
          stack.push(current.children[i])
        }
      }
    }
  }