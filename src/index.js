const {chain} = require('bottender');
const {
  router,
  line
} = require('bottender/router');


//data
statistic_list = ['完整報表','全部人數','男女生','年齡','教育程度','月收入','職業別']
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

//這裡處理接過來的訊息
async function HandleMessage(context,props){
  context.event.text === '列出可以查看的功能' && showMenu(context)
  context.event.text === '描述性統計' || context.event.text === '特定題目' && showQuickReply(context, context.event.text)
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
  const altText = 'this is a carousel template';
  await context.sendCarouselTemplate(altText, menu);
}

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

const makeQuickReply = list =>{
  const quickReply = {
    items: []
  }

  for(let i=0;i<list.length;i++){
    const item = {
      type: 'action',
      action: {
        type: 'message',
        label: list[i],
        text: list[i],
      }
    }
    quickReply.items.push(item)
  }

  return quickReply
}

module.exports = async function App(context) {
  return chain([
    RuleBased
  ]);
  //context.event.text === '訂閱' && await context.sendText('訂閱') || await context.sendText('falljgfhjkd')

};

