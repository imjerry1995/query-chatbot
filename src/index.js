const {chain} = require('bottender');


//data
statistic_list = ['完整報表','全部人數','男女生','年齡','教育程度','月收入','職業別']

const RuleBased = (context, props) => {
  return router([
    line.message(HandleMessage),
    line.follow(HandleFollow),
    line.unfollow(HandleUnfollow),
  ]);
  //RuleBased design for button event
  //context.event.text === 'hi' && context.sendText(props) || context.sendText('falljgfhjkd')
  if(context.event.isFollow)
  if(!context.event.isText){

  }
  return props.next; //jump to next chain
}

async function HandleFollow(context) {
  let welcome_msg = `
  Hi, 歡迎來到問卷小幫手 ${String.fromCodePoint(0x10008A)}
  您可以輸入文字來對您的問卷做查詢
  如：幫我查目前問卷的總人數
  `
  let hint_text = `或者點按列出全部按鈕看可以列出什麼資訊👇`
  await context.sendText(welcome_msg)
  await context.sendText('this is a hint area flex',{
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
  context.event.text === 'menu' && showMenu(context)
  context.event.text === '描述性統計' && showQuickReply(context)
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

async function showQuickReply(context){
  const quickReply_statistic = makeQuickReply(statistic_list)
  await context.sendText('hello', {
    quickReply_statistic
  });
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
};

