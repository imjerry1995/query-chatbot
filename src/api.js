const fetch = require("node-fetch");

const all_url = 'https://api.malulai.com/all'

let result_data = {}
let data_all = {}
function fetchData(api) {
  fetch('https://api.malulai.com/' + api)
    .then((response) => {
      return response.json()
      //return response.text()
    }).then((myJson) => {
      data_all[api] = myJson.data
    })
}


/**處理data */
const converse = q_list => {
  let sum = 0
  q_list.map(el => {
    el === '非常同意' && (sum += 5)
    el === '同意' && (sum += 4)
    el === '普通' && (sum += 3)
    el === '不同意' && (sum += 2)
    el === '非常不同意' && (sum += 1)
  })
  return sum / (q_list.length)
}

const converse_r = q_list => {
  let sum = 0
  q_list.map(el => {
    el === '非常同意' && (sum += 1)
    el === '同意' && (sum += 2)
    el === '普通' && (sum += 3)
    el === '不同意' && (sum += 4)
    el === '非常不同意' && (sum += 5)
  })
  return sum / (q_list.length)
}


fetchData('all')//總數
fetchData('all/m') //男生
fetchData('all/f') // 女生
fetchData('form/q1') //平均數
fetchData('form/q2')
fetchData('form/q3')
fetchData('form/q4')
fetchData('form/q5')
fetchData('form/q6')
fetchData('form/q7')
fetchData('form/q8')
fetchData('form/q9')
// result_data.age = fetchData('age').data // 年齡(一包json)
// result_data.edu = fetchData('edu').data // 年齡(一包json)
// result_data.salary = fetchData('salary').data // 年齡(一包json)
// result_data.job = fetchData('job').data // 年齡(一包json)

setTimeout(() => {
  
  result_data.all = data_all.all
  result_data.boy = data_all['all/m']
  result_data.girl = data_all['all/f']
  /**沉默成本 */
  result_data.sunk = {
    'sunk_1': converse(data_all['form/q1']), //平均數
    'sunk_2': converse(data_all['form/q2']),
    'sunk_3': converse(data_all['form/q3']),
    'sunk_4': converse(data_all['form/q4']),
    'sunk_5': converse_r(data_all['form/q5'])
  }
  /**沉默end */


  /**滿意度 */
  result_data.satis = {
    'satis_1': converse(data_all['form/q6']), //平均數
    'satis_2': converse(data_all['form/q7']),
    'satis_3': converse(data_all['form/q8']),
    'satis_4': converse(data_all['form/q9'])
  }
  /**滿意度end */

  /**反向題 */
  const data_q4 = data_all['form/q4']
  const data_q5 = data_all['form/q5']
  let count = 0;
  for (let i = 0; i < 10; i++) {
    if (data_q4[i] != '普通' && data_q4[i] === data_q5[i]) count++
  }
  result_data.reverse = count
  /**反向題end */

  result_data.age = {
    "18歲以下":0,
    "18-30歲":1,
    "31-40歲":2,
    "41-50歲":3,
    "51-60歲":2,
    "60歲以上":2
  }

  result_data.edu = {
    "國小或以下":1,
    "高中/高職":2, 
    "專科":1,
    "大學":4,
    "碩士":1,
    "專業碩士":0,
    "博士":1
  }

  result_data.salary = {
    '20000元以下':1,
    '20000-39999元':2,
    '40000-59999元':2,
    '60000-79999元':2,
    '80000-99999元':2,
    '100000元以上':1
  }

  result_data.job = {
    '學生':1,
    '軍公教':1,
    '服務業':4,
    '工商業':3,
    '自由業':0,
    '家管':1,
    '其他':0
  }

  console.log(result_data)
  
}, 1000)






