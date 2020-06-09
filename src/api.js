const fetchData = api =>{
  fetch(process.env.API_URL + api, {
    method: 'get'
  }).then(response => {
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  }).then(jsonData => {
    return jsonData //看看有沒有return出來
  }).catch(err => {
    console.log(err)
  })
}

const result_data = {}


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


result_data.total = fetchData('all').data //總數
result_data.boy = fetchData('all/m').data //男生
result_data.girl = fetchData('all/f').data // 女生
// result_data.age = fetchData('age').data // 年齡(一包json)
// result_data.edu = fetchData('edu').data // 年齡(一包json)
// result_data.salary = fetchData('salary').data // 年齡(一包json)
// result_data.job = fetchData('job').data // 年齡(一包json)


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


/**沉默成本 */
result_data.sunk = {
  'sunk_1': converse(fetchData('form/q1').data), //平均數
  'sunk_2': converse(fetchData('form/q2').data),
  'sunk_3': converse(fetchData('form/q3').data),
  'sunk_4': converse(fetchData('form/q4').data),
  'sunk_5': converse_r(fetchData('form/q5').data)
}
/**沉默end */


/**滿意度 */
result_data.satis = {
  'satis_1': converse(fetchData('form/q6').data), //平均數
  'satis_2': converse(fetchData('form/q7').data),
  'satis_3': converse(fetchData('form/q8').data),
  'satis_4': converse(fetchData('form/q9').data)
}
/**滿意度end */

/**反向題 */
const data_q4 = fetchData('form/q4').data
const data_q5 = fetchData('form/q5').data
let count = 0;
for (let i = 0; i < 10; i++) {
  if (data_q4[i] != '普通' && data_q4[i] === data_q5[i]) count++
}
result_data.reverse = count
/**反向題end */

// const data_q5 = [
//   "同意",
//   "非常同意",
//   "同意",
//   "同意",
//   "普通",
//   "同意",
//   "非常同意",
//   "不同意",
//   "不同意",
//   "同意"
// ]
module.exports = result_data;




