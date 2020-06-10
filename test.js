// // statistic_basic = ['完整報表', '全部人數', '男女生']


// // const makeButtonMenuActions = lists => {
// //   const actions = []
// //   lists.map(list => {
// //     const item = {
// //       type: 'postback',
// //       label: list,
// //     }
// //     const data = {
// //       quick: true,
// //       type: list
// //     }
    
// //     if (list === '完整報表' || list === '全部人數' || list === '沉默成本' || list === '滿意度' || list === '反向題') data.quick = false
// //     item.data = JSON.stringify(data)
// //     actions.push(item)
// //   })
// //   return actions
// // }

// // let res = makeButtonMenuActions(statistic_basic)
// // res = JSON.parse(res[2].data)
// // console.log(res.type)

// // res.quick && console.log('here')


// // sub_list = {
// //   '男女生': ['男生', '女生'],
// //   '年齡': ['18歲以下', '18-30歲', '31-40歲', '41-50歲', '51-60歲', '60歲以上'],
// //   '教育程度': ['國小或以下', '高中/高職', '專科', '大學', '碩士', '專業碩士', '博士'],
// //   '月收入': ['20000元以下', '20000-39999元', '40000-59999元', '60000-79999元', '80000-99999元', '100000元以上'],
// //   '職業別': ['學生', '軍公教', '服務業', '工商業', '自由業', '家管', '其他'],
// // }

// // console.log(sub_list[res.type])

// // const result_data = {
// //   boy: 0,
// //   girl: 0,
// //   ed
// // } fetch 完之後用這個輸出資料
// const fetch = require("node-fetch");
// // let u = {}
// // async function fetchData() {
// //   let response = await fetch('https://api.malulai.com/all');
// //   u = await response.json();
// //   //await new Promise((resolve, reject) => setTimeout(resolve, 3000));
// //   // console.log(user)
// //   console.log(u)
// //   //return u
// // }

// // fetchData()


// // async function fetchAsync() {
// //   // await response of fetch call
// //   let response = await fetch('https://api.malulai.com/all');
// //   // only proceed once promise is resolved
// //   let data = await response.json();
// //   // only proceed once second promise is resolved
// //   return data;
// // }

// // trigger async function
// // log response or catch error of fetch promise
// // let d = {}

// // fetchAsync()
// //   .then(data => d.data = data)
// //   .catch(reason => console.log(reason.message))

// // console.log(d)


// // class RequestService {

// //   // async function
// //   async getRequest(url) {
// //     let data = await (await (fetch(url)
// //       .then(res => {
// //         return res.json()
// //       })
// //       .catch(err => {
// //         console.log('Error: ', err)
// //       })
// //     ))
// //     return data
// //   }
// // }

// // const data = new RequestService('https://api.malulai.com/all')
// // console.log(data)

// let result_data = {}

// async function fetchData2() {

//   let all_res = await fetch('https://api.malulai.com/all');
//   let all_data = await all_res.json();

//   let boy_res = await fetch('https://api.malulai.com/all/m');
//   let boy_data = await boy_res.json();

//   let girl_res = await fetch('https://api.malulai.com/all/f');
//   let girl_data = await girl_res.json();

//   let 
//   //console.log(data)
//   result_data = {
//     all: all_data.data,
//     boy: boy_data.data,
//     girl: girl_data.data,
//     // sunk : {
//     //   'sunk_1': converse(fetchData('form/q1').data), //平均數
//     //   'sunk_2': converse(fetchData('form/q2').data),
//     //   'sunk_3': converse(fetchData('form/q3').data),
//     //   'sunk_4': converse(fetchData('form/q4').data),
//     //   'sunk_5': converse_r(fetchData('form/q5').data)
//     // }, 
//     // satis : {
//     //   'satis_1': converse(fetchData('form/q6').data), //平均數
//     //   'satis_2': converse(fetchData('form/q7').data),
//     //   'satis_3': converse(fetchData('form/q8').data),
//     //   'satis_4': converse(fetchData('form/q9').data)
//     // }

//   }
//   //console.log(a)
// }
// function fetchData(api){
//   fetch('https://api.malulai.com/' + api)
//     .then((response) => {
//       return response.json()
//       //return response.text()
//     }).then((myJson) => {
//       result_data[api] = myJson.data
//     })
// }



// fetchData('all')

// setTimeout(()=>{
//   console.log(result_data)
// },1000)

// //console.log(a)
const result = require('./src/api.js');
console.log(result)