statistic_basic = ['完整報表', '全部人數', '男女生']


const makeButtonMenuActions = lists => {
  const actions = []
  lists.map(list => {
    const item = {
      type: 'postback',
      label: list,
    }
    const data = {
      quick: true,
      type: list
    }
    
    if (list === '完整報表' || list === '全部人數' || list === '沉默成本' || list === '滿意度' || list === '反向題') data.quick = false
    item.data = JSON.stringify(data)
    actions.push(item)
  })
  return actions
}

let res = makeButtonMenuActions(statistic_basic)
res = JSON.parse(res[2].data)
console.log(res.type)

res.quick && console.log('here')


sub_list = {
  '男女生': ['男生', '女生'],
  '年齡': ['18歲以下', '18-30歲', '31-40歲', '41-50歲', '51-60歲', '60歲以上'],
  '教育程度': ['國小或以下', '高中/高職', '專科', '大學', '碩士', '專業碩士', '博士'],
  '月收入': ['20000元以下', '20000-39999元', '40000-59999元', '60000-79999元', '80000-99999元', '100000元以上'],
  '職業別': ['學生', '軍公教', '服務業', '工商業', '自由業', '家管', '其他'],
}

console.log(sub_list[res.type])