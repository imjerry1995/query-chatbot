const {chain} = require('bottender');
const {
  router,
  line
} = require('bottender/router');


//data
statistic_basic = ['完整報表','全部人數','男女生']
statistic_advance = ['年齡', '教育程度', '月收入', '職業別']
specific_list = ['沉默成本','滿意度', '反向題']


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

//改成子項
async function showQuickReply(context,text){
  let quickReply = {};
  switch (text) {
    case '描述性統計':
      quickReply = {...makeQuickReply(statistic_list)}
      await context.send([{
        type: 'text',
        text: '要顯示什麼呢',
        quickReply,
      }, ]);
      break;
    case '特定題目':
      quickReply = {...makeQuickReply(specific_list)}
      await context.send([{
        type: 'text',
        text: '要顯示什麼呢',
        quickReply,
      }, ]);
      break;
    default:
  }
}

//處理 payload
async function HandlePayload(context){
  await context.sendText(`received the payload: ${context.event.payload}`);
  const res = JSON.parse(context.event.payload)
  //context.event.payload 直接接打api回收response做判斷
  res.action === 'sta' && handleStatistc(res)
}

/**快速生成template function start */
const makeButtonMenuActions = list =>{
  const actions = []
  for (let i = 0; i < list.length; i++) {
    const item = {
      type: 'postback',
      label: list[i],
    }
    const data = {
      quick: true,
      type: list[i]
    }
    item.data = JSON.stringify(data)
    actions.push(item)
  }
  return actions
}
const makeQuickReply = list =>{
  const quickReply = {
    items: []
  }
  for(let i=0;i<list.length;i++){
    const item = {
      type: 'action',
      action: {
        type: 'postback',
        label: list[i],
      }
    }
    // if (list[i] === '完整報表' || list[i] === '全部人數'){
    //   item.action.data = 'action=sta&all=true'
    // } else if (list[i] === '沉默成本' || list[i] === '忠誠度' || list[i] === '反向題') {
    //   item.action.data = 'action=item'
    // }else{
    //   item = {
    //     ...item,
    //     action: {
    //       type: 'message',
    //       label: '列出全部', //顯示按鈕的名稱
    //       text: '列出可以查看的功能', //視為使用者打字(所以可接到)
    //     }
    //   }
    //   // const data = {
    //   //   action: 'sta',
    //   //   type: list[i]
    //   // }
    //   //item.action.data = JSON.stringify(data)
    // }
    quickReply.items.push(item)
  }
  return quickReply
}
/**快速生成template function end */

const handleStatistc = res => {
  res.all && queryAll()
}

/**綁 dialogFlow function start */
async function queryAll(all='',count='',gender=''){
  //call api
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

