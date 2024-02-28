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


  // 遍历
  const traverse = function (arr) {
    const res = []
    arr.forEach(item => {
      item.$_SELF_MARK = item.$_MARK = method(item)
      item.$_NOT_SELF_MARK = !item.$_SELF_MARK

      if (item.children) {
        item.children = traverse(item.children)
        item.$_MARK = item.$_MARK || item.children.some(child => child.$_MARK)
      }

      if (item.$_MARK) res.push(item)
    })
    return res
  }


  /**
   * @method findTreeStructure
   * @description 查询树结构
   * @param {Array} data 数据
   * @param {Function} match 匹配方法
   * @param {Boolean} deep 是否深拷贝
   * @returns {Array}
 */

  export const findTreeStructure = (data, match, deep) => {
    const d = deep ? JSON.parse(JSON.stringify(data)) : data
    const result = traverse(d)
    return result
  
    function traverse (data) {
      const res = []
      data.forEach((item, index) => {
        item._$isMatched = match(item)
        item._$isSelfMatched = item._$isMatched
        item._$index = index
  
        if (Array.isArray(item.children)) {
          item.children = traverse(item.children)
          item._$isMatched = item._$isMatched || item.children.some((child) => child._$isMatched)
        }
  
        if (item._$isMatched) res.push(item)
      })
      return res
    }
  }