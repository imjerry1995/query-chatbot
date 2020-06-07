const boygirls = ['男生','女生']

const makeQuickReply = list => {
  const quickReply = {
    items: []
  }

  for (let i=0; i < list.length; i++) {

    console.log(typeof(list[i]))
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


console.log((makeQuickReply(boygirls)).items[0].action)
