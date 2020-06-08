const {chain} = require('bottender');
const {
  router,
  line
} = require('bottender/router');


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

async function HandleFollow(context) {
  let welcome_msg = `Hi, 歡迎來到問卷小幫手 ${String.fromCodePoint(0x10008A)}
  您可以輸入文字來對您的問卷做查詢
  如：幫我查目前問卷的總人數
  `
  let hint_text = `或者點按列出全部按鈕看可以列出什麼資訊👇`
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
  || context.event.text === '特定題目' && showSubMenu(context, context.event.text)
}

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
          label: '特定題目',
          text: '特定題目'
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
  }else{
    subMenu.actions = makeButtonMenuActions(specific_list)
    await context.sendButtonTemplate(altText, subMenu);
  }
}


//處理 payload
async function HandlePayload(context){
  await context.sendText(`received the payload: ${context.event.payload}`);
  const res = JSON.parse(context.event.payload)
  res.quick && makeQuickReply(res.type, sub_list) //按鈕有PAYLOAD且需要快速回應
  !res.quick && await context.sendText(res.type) //沒有快速回應的值接傳文字
}

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
    item.data = JSON.stringify(data)
    actions.push(item)
  })
  return actions
}

const makeQuickReply = async(type, sub_list) => {
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

const handleStatistc = res => {
  res.all && queryAll()
}

/**綁 dialogFlow function start */
async function queryAll(all='',count='',gender=''){
  //call api直接包api
  const total = 466
  const total_girl = 234
  const total_boy = total - total_girl
  all === '完整報表' && showReport() 
  || (all === '總數' || count!='' || (all==='所有' && count!='')) && await context.send.text(`目前回收人數總共${total}人`)
  || gender === '性別' && await context.send.text(`目前男生人數總共${total_boy}人
                                                  目前女生人數總共${total_girl}人`)
  || gender === '男生' && await context.send.text(`目前男生人數總共${total_boy}人`)
  || gender === '女生' && await context.send.text(`目前女生人數總共${total_girl}人`)
}
/**綁 dialogFlow function end */

module.exports = async function App(context) {
  return chain([
    RuleBased
  ]);
  //context.event.text === '訂閱' && await context.sendText('訂閱') || await context.sendText('falljgfhjkd')

};

