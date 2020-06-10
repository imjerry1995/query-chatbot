const {chain} = require('bottender');
const dialogflow = require('@bottender/dialogflow');
const result = require('./data.js'); //驗證有沒有接到



//data
statistic_basic = ['完整報表','全部人數','男女生']
statistic_advance = ['年齡', '教育程度', '月收入', '職業別']
specific_list = ['沉默成本','滿意度', '反向題']
sub_list = {
  '男女生': ['男生','女生'],
  '年齡': ['18歲以下', '18-30歲', '31-40歲', '41-50歲', '51-60歲', '60歲以上'],
  '教育程度': ['國小或以下', '高中/高職', '專科', '大學', '碩士', '專業碩士', '博士'],
  '月收入': ['20000元以下', '20000-39999元', '40000-59999元', '60000-79999元', '80000-99999元', '100000元以上'],
  '職業別': ['學生', '軍公教', '服務業', '工商業', '自由業', '家管', '其他'],
}


const RuleBased = (context, props) => {
  if (context.event.isFollow) {
    HandleFollow(context)
  }
  if(context.event.isText){
    if (context.event.text === 'follow'){
      HandleFollow(context)
    }
    HandleMessage(context)
  }

  if(context.event.isPayload){
    HandlePayload(context)
  }
}

/**handle functions start*/
async function HandleFollow(context) {
  let welcome_msg = `Hi, 歡迎來到問卷小幫手 ${String.fromCodePoint(0x10008A)}
  您可以輸入文字來對您的問卷做查詢
  如：幫我查目前問卷的總人數
  或是點選按鈕看可以列出什麼資訊👇
  `
  let hint_text = `列出Menu👇`
  await context.sendText(welcome_msg)
  await context.sendFlex('this is a hint area flex', {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [{
        type: 'text',
        text: hint_text,
      }]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [{
        type: 'button',
        style: 'primary',
        action: {
          type: 'message',
          label: '列出全部',//顯示按鈕的名稱
          text: '列出可以查看的功能', //視為使用者打字(所以可接到)
        },
      }]
    }
  })
}

//這裡處理接過來的訊息:純文字
async function HandleMessage(context,props){
  context.event.text === '列出可以查看的功能' && showMenu(context)
  context.event.text === '描述性統計' && showSubMenu(context, context.event.text)
  context.event.text === '特定題' && showSubMenu(context, context.event.text)
}

//處理 payload
async function HandlePayload(context) {
  //await context.sendText(`received the payload: ${context.event.payload}`);
  const res = JSON.parse(context.event.payload)
  res.quick && makeQuickReply(context, res.type, sub_list) //按鈕有PAYLOAD且需要快速回應
  if (!res.quick && res.type == '沉默成本' || !res.quick && res.type == '滿意度' || !res.quick && res.type == '反向題'){
    queryQuestion(context, undefined, res.type)
  } else if (!res.quick) {
    queryAll(context, undefined, res.type) //沒有快速回應的值接傳文字
  }
}

async function others(context) {
  let welcome_msg = `抱歉, 小幫手聽不懂 ${String.fromCodePoint(0x10009B)}
  您可以...
  輸入文字來對您的問卷做查詢
  如：幫我查目前問卷的總人數
  或是點選按鈕看可以列出什麼資訊👇
  `
  let hint_text = `列出Menu👇`
  await context.sendText(welcome_msg)
  await context.sendFlex('this is a hint area flex', {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [{
        type: 'text',
        text: hint_text,
      }]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [{
        type: 'button',
        style: 'primary',
        action: {
          type: 'message',
          label: '列出全部',//顯示按鈕的名稱
          text: '列出可以查看的功能', //視為使用者打字(所以可接到)
        },
      }]
    }
  })
}
/**handle functions end*/

/**show Menus start*/
async function showMenu(context){
  const menu = [
    {
      title: '列出描述性統計',
      text: '包含完整報表、全部人數、男女生、年齡、教育程度、月收入、職業別',
      actions: [
        {
          type: 'message',
          label: '描述性統計',
          text: '描述性統計'
        }
      ]
    },
    {
      title: '列出特定題目狀況',
      text: '包含特定題目、反向題填答狀況',
      actions: [
        {
          type: 'message',
          label: '特定題',
          text: '特定題'
        }
      ]
    }
  ]
  const altText = '可以查看的功能列表';//電腦版會看到的文字
  await context.sendCarouselTemplate(altText, menu);
}


async function showSubMenu(context,text) {
  const subMenu = {
    text: '要顯示什麼呢',
  };
  const altText = '可以查看的子列表'; //電腦版會看到的文字
  if (text === '描述性統計'){
    subMenu.title = '看看最基本的'
    subMenu.actions = makeButtonMenuActions(statistic_basic)
    const subMenu2 = {...subMenu}
    subMenu2.title = '或其他特定資訊'
    subMenu2.actions = makeButtonMenuActions(statistic_advance)
    await context.sendButtonTemplate(altText, subMenu);
    await context.sendButtonTemplate(altText, subMenu2);
  } else if (text === '特定題') {
    subMenu.actions = makeButtonMenuActions(specific_list)
    await context.sendButtonTemplate(altText, subMenu);
  }
}
/**show Menus end*/

/**快速生成template function start */
const makeButtonMenuActions = lists =>{
  const actions = []
  lists.map(list=>{
    const item = {
      type: 'postback',
      label: list,
    }
    const data = {
      quick: true,
      type: list
    }
    if(list === '完整報表' || list === '全部人數' || list === '沉默成本' || list === '滿意度' || list === '反向題') data.quick = false
    item.data = JSON.stringify(data)
    actions.push(item)
  })
  return actions
}

const makeQuickReply = async (context,type, sub_list) => {
  const lists = sub_list[type]
  const quickReply = {
    items: []
  }
  lists.map(list => {
    const item = {
      type: 'action',
      action: {
        type: 'message',
        label: list, //顯示按鈕的名稱
        text: list, //視為使用者打字(所以可接到)
      }
    }
    //快速回應(最後一層) 直接送文字接dialog
    quickReply.items.push(item)
  })
  await context.send([{
    type: 'text',
    text: '要顯示什麼呢',
    quickReply,
  }, ]);
}
/**快速生成template function end */


/**綁 dialogFlow function start */

async function queryAll(context, props, text) {
  const param = props === undefined ? '' : props.parameters.fields
  const all = param === '' ? text : param.all.stringValue
  const gender = param === '' ? '':(param.gender.listValue.values.length > 0 ? param.gender.listValue.values[0].stringValue : '')
  const count = param === '' ? text :param.count.stringValue
 //測試有沒有抓到

  //測試chart.js
  if (all === '完整報表') {
    await context.sendText(`性別人數\n
    男生:${result.boy}人\n
    女生:${result.girl}人\n
    總人數:${result.total}人\n
    ---------------\n
    年齡分布\n
    18歲以下:${result.age['18歲以下']}人\n
    18-30歲:${result.age['18-30歲']}人\n
    31-40歲:${result.age['31-40歲']}人\n
    41-50歲:${result.age['41-50歲']}人\n
    60歲以上:${result.age['60歲以上']}人\n
    ---------------\n
    教育程度\n
    國小或以下:${result.edu['國小或以下']}人\n
    高中/高職:${result.edu['高中/高職']}人\n
    專科:${result.edu['專科']}人\n
    大學:${result.edu['大學']}人\n
    碩士:${result.edu['碩士']}人\n
    專業碩士:${result.edu['專業碩士']}人\n
    博士:${result.edu['博士']}人\n
    ---------------\n
    平均月收入\n
    20000元以下:${result.salary['20000元以下']}人\n
    20000-39999元:${result.salary['20000-39999元']}人\n
    40000-59999元:${result.salary['40000-59999元']}人\n
    60000-79999元:${result.salary['60000-79999元']}人\n
    80000-99999元:${result.salary['80000-99999元']}人\n
    100000元以上:${result.salary['100000元以上']}人\n
    ---------------\n
    職業別\n
    學生:${result.job['學生']}人\n
    軍公教:${result.job['軍公教']}人\n
    服務業:${result.job['服務業']}人\n
    工商業:${result.job['工商業']}人\n
    自由業:${result.job['自由業']}人\n
    家管:${result.job['家管']}人\n
    其他:${result.job['其他']}人\n`)

    await context.sendText(`沉默成本\n
    sunk_1平均:${result.sunk['sunk_1']}分\n
    sunk_2平均:${result.sunk['sunk_2']}分\n
    sunk_3平均:${result.sunk['sunk_3']}分\n
    sunk_4平均:${result.sunk['sunk_4']}分\n
    sunk_5平均:${result.sunk['sunk_5']}分\n
    ---------------\n
    滿意度\n
    satis_1平均:${result.satis['satis_1']}分\n
    satis_2平均:${result.satis['satis_2']}分\n
    satis_3平均:${result.satis['satis_3']}分\n
    satis_4平均:${result.satis['satis_4']}分\n
    ---------------\n
    反向題\n
    目前有:${result.reverse}個人不符合資格\n
    `)

  } else if (gender === '性別') {
    context.sendText(`目前男生人數總共${result.boy}}人\n目前女生人數總共${result.girl}人`)
  } else if (gender === '男生') {
    await context.sendText(`目前男生人數總共${result.boy}人`)
  } else if (gender === '女生' || (gender === '女生' && count != '')) {
    await context.sendText(`目前女生人數總共${result.total}人`)
  } else if (all === '總數' || count != '' || (all === '所有' && count != '')) {
    await context.sendText(`目前回收人數總共${result.total}人`)
  }
}


async function queryAge(context, props) {
  const param = props.parameters.fields
  const all =  param.all.stringValue
  const ages = param.ages.listValue.values.length > 0 ? param.ages.listValue.values : ''
  const count = param.count.stringValue
 //測試有沒有抓到

  //測試chart.js
  if ((all != '' && ages === '年齡')|| ages === '年齡') {
    await context.sendText(`18歲以下總共${result.age['18歲以下']}\n
    18-30歲總共${result.age['18-30歲']}\n
    31-40歲總共${result.age['31-40歲']}\n
    41-50歲總共${result.age['41-50歲']}\n
    60歲以上總共${result.age['60歲以上']}\n`)
  } else if (ages.length>0) {
    ages.map(async (el) =>{
      await context.sendText(`${el.stringValue}總共${result.age[el.stringValue]}人`)
    })
  }
}

async function queryEdu(context, props) {
  const param = props.parameters.fields
  const all = param.all.stringValue
  const edu = param.edu.listValue.values.length > 0 ? param.edu.listValue.values : ''
 //測試有沒有抓到

  //測試chart.js
  if ((all != '' && edu === '教育') || edu === '教育') {
    await context.sendText(`國小或以下總共${result.edu['國小或以下']}\n
    高中/高職總共${result.edu['高中/高職']}\n
    專科總共${result.edu['專科']}\n
    大學總共${result.edu['大學']}\n
    碩士總共${result.edu['碩士']}\n
    專業碩士總共${result.edu['專業碩士']}\n
    博士總共${result.edu['博士']}\n`)
  } else if (edu.length > 0) {
    edu.map(async (el) => {
      await context.sendText(`${el.stringValue}總共${result.edu[el.stringValue]}人`)
    })
  }
}

async function querySalary(context, props) {
  const param = props.parameters.fields
  const all = param.all.stringValue
  const salary = param.salary.listValue.values.length > 0 ? param.salary.listValue.values : ''
 //測試有沒有抓到

  //測試chart.js
  if ((all != '' && salary === '薪水') || salary === '薪水') {
    await context.sendText(`20000元以下總共${result.salary['20000元以下']}\n
    20000-39999元總共${result.salary['20000-39999元']}\n
    40000-59999元總共${result.salary['40000-59999元']}\n
    60000-79999元總共${result.salary['60000-79999元']}\n
    80000-99999元總共${result.salary['80000-99999元']}\n
    100000元以上總共${result.salary['100000元以上']}\n`)
  } else if (salary.length > 0) {
    salary.map(async (el) => {
      await context.sendText(`${el.stringValue}總共${result.salary[el.stringValue]}人`)
    })
  }
}


async function queryJob(context, props) {
  const param = props.parameters.fields
  const all = param.all.stringValue
  const job = param.job.listValue.values.length > 0 ? param.job.listValue.values : ''
  const count = param.count.stringValue
 //測試有沒有抓到

  //測試chart.js
  if ((all != '' && job === '職業') || job === '職業') {
    await context.sendText(`學生總共${result.job['學生']}\n
    軍公教總共${result.job['軍公教']}\n
    服務業總共${result.job['服務業']}\n
    工商業總共${result.job['工商業']}\n
    自由業總共${result.job['自由業']}\n
    家管總共${result.job['家管']}\n
    其他總共${result.job['其他']}\n`)
  } else if (job.length > 0) {
    job.map(async (el) => {
      await context.sendText(`${el.stringValue}總共${result.job[el.stringValue]}人`)
    })
  }
}

async function queryQuestion(context, props, text) {
  //console.log(props)

  // const all = param.all
  // const item = param.item.listValue.values.length > 0 ? param.item.listValue.values : ''
  // const count = param.count.stringValue

  const param = props === undefined ? '' : props.parameters.fields
  console.log(param)

  const item = param === '' ? [{stringValue: text}] : (param.item.listValue.values.length > 0 ? param.item.listValue.values : '')
  

   console.log(item) //測試有沒有抓到

  if (item.length > 0){
    item.map(async el => {
      if(el.stringValue === '沉默成本'){
        await context.sendText(`sunk_1平均:${result.sunk['sunk_1']}分\n
        sunk_2平均:${result.sunk['sunk_2']}分\n
        sunk_3平均:${result.sunk['sunk_3']}分\n
        sunk_4平均:${result.sunk['sunk_4']}分\n
        sunk_5平均:${result.sunk['sunk_5']}分`)
      } else if (el.stringValue === '滿意度') {
        await context.sendText(`satis_1平均:${result.satis['satis_1']}分\n
        satis_2平均:${result.satis['satis_2']}分\n
        satis_3平均:${result.satis['satis_3']}分\n
        satis_4平均:${result.satis['satis_4']}分`)
      } else if (el.stringValue === '反向題') {
        await context.sendText(`反向題共有${result.reverse}人填錯，不符合資格`)
      }
    }) 
  }else if(item==='反向題'){
    await context.sendText(`反向題共有${result.reverse}人填錯，不符合資格`)
  }
}


/**綁 dialogFlow function end */

const Dialogflow = dialogflow({
  projectId: process.env.GOOGLE_APPLICATION_PROJECT_ID,
  actions: {
    queryAll: queryAll,
    queryAge: queryAge,
    queryEdu: queryEdu,
    querySalary: querySalary,
    queryJob: queryJob,
    queryQuestion: queryQuestion
  },
});

module.exports = async function App(context) {
  return chain([
    Dialogflow,
    RuleBased,
    others,
  ]);
};

