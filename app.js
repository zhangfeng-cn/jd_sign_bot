// version v0.0.1
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

const exec = require('child_process').execSync
const fs = require('fs')
const rp = require('request-promise')
const download = require('download')

// 公共变量
const KEY = process.env.JD_COOKIE
const serverJ = process.env.PUSH_KEY

async function downFile () {
    // const url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js'
    const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js'
    await download(url, './')
}

async function changeFiele () {
   let content = await fs.readFileSync('./JD_DailyBonus.js', 'utf8')
   content = content.replace(/var Key = ''/, `var Key = '${KEY}'`)
   await fs.writeFileSync( './JD_DailyBonus.js', content, 'utf8')
}

async function sendNotify (text,desp) {
  const options ={
    uri:  `https://sc.ftqq.com/${serverJ}.send`,
    form: { text, desp },
    json: true,
    method: 'POST'
  }
  await rp.post(options).then(res=>{
    console.log(res)
  }).catch((err)=>{
    console.log(err)
  })
}

async function start() {
  if (!KEY) {
    console.log('请填写 key 后在继续')
    return
  }
  // 下载最新代码
  await downFile();
  console.log('下载代码完毕')
  // 替换变量
  await changeFiele();
  console.log('替换变量完毕')
  // 执行
  await exec("node JD_DailyBonus.js >> result.txt");
  console.log('执行完毕')

  if (serverJ) {
    //const path = "./result.txt";
    //let content = "";
    //if (fs.existsSync(path)) {
      //content = fs.readFileSync(path, "utf8");
    //}
      let updateTime = new Date('2021/3/5 14:25:00').getTime();//更新时间，每30天提醒更新cookie
      let nowTime = new Date().getTime();
      let day = parseInt((nowTime - updateTime)/(24*60*60*1000));
      if(day>28){
           await sendNotify("您的cookie已经使用"+day+"天了哦，有效期30天，记得到github上面更新哦！记得更改app.js上面的updateTime");
           console.log('发送结果完毕')
      }else{
           console.log('已使用'+day+'天，不到30天，不发送通知')
           //await sendNotify("cookie已经使用"+day+"天！");
           //await sendNotify("京东签到-" + new Date().toLocaleDateString(), content);
      }
      
    //await sendNotify("京东签到-" + new Date().toLocaleDateString(), content);
    
  }
}

start()
