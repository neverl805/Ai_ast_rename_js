/**
 * 示例文件 - 包含各种命名不清晰的变量和函数
 * 用于演示AST重命名工具的效果
 */

// 示例1: 简单函数，具有不清晰的变量名
function calc(a, b) {
  let r = a + b;
  return r * 2;
}

// 示例2: 带有短变量名的循环
function proc(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let e = arr[i];
    if (e > 10) {
      res.push(e * 2);
    }
  }
  return res;
}

// 示例3: 多层嵌套的代码块
function fn(data) {
  let tmp = {};
  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      let v = data[k];
      if (typeof v === 'string') {
        tmp[k] = v.toUpperCase();
      } else if (Array.isArray(v)) {
        tmp[k] = v.map(i => i * 2);
      } else {
        tmp[k] = v;
      }
    }
  }
  return tmp;
}

// 示例4: 类与方法
class Util {
  constructor(cfg) {
    this.cfg = cfg;
    this.d = new Date();
  }

  getV(k) {
    return this.cfg[k] || null;
  }

  setV(k, v) {
    this.cfg[k] = v;
  }

  fmt(str, args) {
    let res = str;
    for (let i = 0; i < args.length; i++) {
      res = res.replace(`{${i}}`, args[i]);
    }
    return res;
  }
}

// 示例5: 更复杂的函数，模拟实际代码
function procData(d, opts) {
  const dflt = {
    trim: true,
    upper: false,
    max: 100
  };

  const o = { ...dflt, ...opts };
  let r = [];

  for (let i = 0; i < d.length; i++) {
    let itm = d[i];
    let v = itm.val;
    
    if (o.trim && typeof v === 'string') {
      v = v.trim();
    }
    
    if (o.upper && typeof v === 'string') {
      v = v.toUpperCase();
    }
    
    if (typeof v === 'number' && v > o.max) {
      v = o.max;
    }
    
    r.push({
      id: itm.id,
      v: v,
      ts: new Date().getTime()
    });
  }
  
  return r;
}

// 导出所有示例函数
module.exports = {
  calc,
  proc,
  fn,
  Util,
  procData
}; 