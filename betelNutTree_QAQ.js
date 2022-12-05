/* 
 微信小程序 口味王

 海南嫩青果园

 除邀请任务外 其他功能

 青龙测试通过

 必须变量名 kwwmemberId  多账号分割符是 @ 或者 换行

 注意nodejs 依赖 

 axios@0.27.2
 jsdom
 xpath
 xmldom
 request
 
*/


const jsname = '海南嫩青果园'
const $ = Env(jsname)

var redirect,loginUrl,Cookie,token_str,ohjaiohdf_key,token,todaySign,leftEnergyBall,isTravelling
var kwwmemberId = ($.isNode() ? process.env.kwwmemberId : $.getdata("kwwmemberId")) || ""
var kwwmemberIdArr = []
try{
    var axios = require('axios')
    var request = require("request").defaults({jar: true})
    var XmldomParser = require('xmldom').DOMParser
    var domParser = new XmldomParser ({
            errorHandler: {}
        })
    var xpath = require('xpath')
    var jsdom = require('jsdom')
    var {JSDOM} = jsdom
} catch (e) {
    console.log(e)
}

!(async () => {
    if (!(await Envs()))
            return;
        else {
            console.log(`\n\n=============================================    \n
            脚本执行 - 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 +8 * 60 * 60 * 1000).toLocaleString()} 
            \n=============================================\n`);
        console.log(`\n=================== 共找到 ${kwwmemberIdArr.length} 个账号 ===================`)
        for (let index = 0; index < kwwmemberIdArr.length; index++) {            
            let num = index + 1
            console.log(`\n===== 开始【第 ${num} 个账号】=====\n`)
            undone_code = []
            completed = []
            undone =[]
            memberId = kwwmemberIdArr[index];
            await $.wait(1000)
            await all()     
        }       
       } 
})()

async function all(){
    await user()
    await $.wait(1000)
    await activity_url()
    await $.wait(1000)
    await login_free_plugin()
    await $.wait(1000)
    await setCookies()
    await $.wait(1000)
    await queryTasks()
    await $.wait(1000)
    tasklog()
    await $.wait(1000)
    await get_key_str()
    await $.wait(1000)
    await dotask()
    await $.wait(1000)
    await today_checkin()
    await $.wait(1000)
    await game_index()
    await $.wait(1000)
    if (!todaySign){
        await doSign()
    }
    if (leftEnergyBall){
        for (let i = 0; i < leftEnergyBall;i++){
            await $.wait(1000)
            await useEnergyBall()
        }
    }
    if (!isTravelling){
        await $.wait(1000)
        await startTravel()
    }
    await $.wait(1000)
    await newRewardInfo()
}

function tasklog(){
    try{
        console.log('\n==== 未完成任务 ====\n')
    for(let i=0;i<undone.length;i++){
        console.log(undone[i])
    }
    console.log('\n==== 已完成任务 ====\n')
    for(let i=0;i<completed.length;i++){
        console.log(completed[i])
    }
    } catch(e)
    {console.log(e)}
    
}

async function dotask(){
    try{
        if(undone_code.length){
            //console.log('做任务')
             for(let i = 0;i < undone_code.length;i++)
             {
                switch(undone_code[i])
                {   
            
                    case 'browseGm':
                        await $.wait(1000)
                        console.log('\n==== 参与天天抢红包 ====\n')
                        await finishBrowseInfoTask('browseGm')
                        break
                    case 'browseDc':
                        await $.wait(1000)
                        console.log('\n==== 参与疯狂摇奖机 ====\n')
                        await finishBrowseInfoTask('browseDc')
                        break
                    case 'browseBm':
                        await $.wait(1000)
                        console.log('\n==== 参与海岛游乐场 ====\n')
                        await finishBrowseInfoTask('browseBm')
                        break
                    case 'browseTjhw':
                        await $.wait(1000)
                        console.log('\n==== 参与点球大战 ====\n')
                        await finishBrowseInfoTask('browseTjhw')
                        break
                    case 'browseZhc':
                        await $.wait(1000)
                        console.log('\n==== 浏览世界杯主会场 ====\n')
                        await finishBrowseInfoTask('browseZhc')
                        break
                    case 'browseSsjc':
                        await $.wait(1000)
                        console.log('\n==== 参与赛事竞猜 ====\n')
                        await finishBrowseInfoTask('browseSsjc')
                        break
                    case 'browseInfo':
                        await $.wait(1000)
                        console.log('\n==== 浏览资讯 ====\n')
                        await finishBrowseInfoTask('browseInfo')
                        break

                }
             }      
            } else {
            console.log('任务已完成,跳过')
        }
       
    } catch(e){
        console.log(e)
    }
}

async function newRewardInfo(){
    console.log('\n==== 查询任务奖励 ====\n')
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/customTask1/newRewardInfo.do`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
                url: url,
                headers: {
                    'Host' : host,
                    'Connection' : 'keep-alive',
                    'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    'Accept-Encoding' : 'gzip',
                    'Cookie':Cookie,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                }
            }
           axios.request(options).then(function (response) {
                try {
                    let result = response.data
                    if (result.success == true ) {
                        console.log(result.data)
                    } else {
                        console.log(result)
                    }                                                                    
                } catch (e) {
                   console.log(e)
                }
            }).then(() => {
                resolve();
            }).catch(function (err) {
                console.log(err);
            })   
        }) 
}

async function user(){
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://member.kwwblcj.com/member/api/info/?userKeys=v1.0&pageName=member-info-index-search&formName=searchForm&kwwMember.memberId=${memberId}&kwwMember.unionid=undefined&memberId=${memberId}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
                url: url,
                headers: {
                    'Host' : host,
                    'Connection' : 'keep-alive',
                    'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    'Accept-Encoding' : 'gzip',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                }
            }
           axios.request(options).then(function (response) {
                try {
                    let result = response.data
                    if (result.flag == 'T' ) {
                        console.log(`用户：${result.ids.memberInfo.userCname}`)
                    } else {
                        console.log(result)
                    }
                                                                    
                } catch (e) {
                   console.log(e)
                }
            }).then(() => {
                resolve();
            }).catch(function (err) {
                console.log(err);
            })   
        }) 
}

async function activity_url(){
    return new Promise((resolve)=>{
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let url = `https://cms.kwwblcj.com/data/c00.json?T=${ts}`
    let host = (url.split('//')[1]).split('/')[0]
    let options = {
            url: url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                'Accept-Encoding' : 'gzip',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
            }
        }
       axios.request(options).then(function (response) {
            try {
                let result = response.data
                //console.log(result)
                let rows = result.rows
                for (let i = 0; i < rows.length; i++)
                {       
                if(rows[i].title == 1){
                redirect = rows[i].url
                console.log('获取活动URL')
                //console.log(redirect)
                }
                }         
                
            } catch (e) {
               console.log(e)
            }
        }).then(() => {
            resolve();
        }).catch(function (err) {
            console.log(err);
        })   
    })    
}

async function login_free_plugin(){
    //console.log('获得活动免登录地址')
    return new Promise((resolve)=>{
    let url_redirect = encodeURIComponent(redirect)
    let url = `https://member.kwwblcj.com/member/api/info/?userKeys=v1.0&pageName=loginFreePlugin&formName=searchForm&uid=${memberId}&levelCode=1&redirect=${url_redirect}&memberId=${memberId}`
    let host = (url.split('//')[1]).split('/')[0]
    let options = {
        url: url,
        headers: {
            'Host' : host,
            'Connection' : 'keep-alive',
            'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
            'Accept-Encoding' : 'gzip',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
        }
    }
   axios.request(options).then(function (response) {
        try {
            let result = response.data
            //console.log(result)
            if(result.flag == 'T'){
                loginUrl = result.result
                //console.log(loginUrl)                
            } else {
                console.log(result)
            }            
        } catch (e) {
           console.log(e)
        }
    }).then(() => {
        resolve();
    }).catch(function (err) {
        console.log(err);
    })
    })
    
}

async function setCookies() {
    console.log('开始获取Cookie值')
    return new Promise((resolve)=>{
        let host = (loginUrl.split('//')[1]).split('/')[0];
        let options = {
                        url: loginUrl,
                        method: "GET",
                        headers: {
                            'Host': host,
                            'Connection': 'keep-alive',
                            'Upgrade-Insecure-Requests': '1',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Accept-Language': 'en-us,en',
                            }
                        }
        try {
            request(options,function (err, res, body) {
                    if (!err && res.statusCode == 200){                        
                        let cookie = res.request.headers.cookie;                                           
                        Cookie = cookie
                        //console.log(Cookie)
                        resolve()
                                              
                    }
                                     
                })
        } catch (e) {
            console.log(e)
        }
    })      
   
}

async function get_key_str(){
    console.log('\n==== 开始获取KEY字符串 ====\n')
    return new Promise((resolve)=>{
    let ts = Math.round(new Date().getTime() / 1000).toString();  
    let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/getTokenKey?_t=${ts}&_t=${ts}`
    let host = (url.split('//')[1]).split('/')[0]
    let options = {
        url: url,
        headers: {
            'Host' : host,
            'Connection' : 'keep-alive',
            'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
            'Accept-Encoding' : 'gzip',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'Cookie':Cookie,
            'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/index.html?appID=89420&from=login&spm=89420.1.1.1',
        }
    }
   axios.request(options).then(function (response) {
        try {
            //console.log(response)
            let result = response.data           
            console.log('获取成功')
            get_key(result)
            //console.log(result)
                        
        } catch (e) {
           console.log(e)
        }
    }).then(()=> {
        resolve();
    }).catch(function (err) {
        console.log(err);
    })
    })

}

async function get_key(str){
    console.log('开始解密KEY')
    return new Promise(()=>{
        try{
            let dom =  new JSDOM(`<script>${str}</script>`, {
                runScripts: 'dangerously'
        
            })
            let ohjaiohdf_funtion = dom.window.ohjaiohdf.toString()
            //console.log(ohjaiohdf_funtion)
            ohjaiohdf_key = ohjaiohdf_funtion.match(/var key = '(.*)?';/)[1];
            console.log('解密成功')
            //console.log(ohjaiohdf_key)
            dom.window.close()
        } catch (e) {
            console.log(e)
        }


    })
    
}

async function getToken(){
    console.log('开始获取token')
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/getToken?_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
                'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/index.html?appID=89420&from=login&spm=89420.1.1.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        } 
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                //console.log(result)                
                token_str = result.data
                console.log('获取成功')                                       
                
            } catch (e) {
               console.log(e)
            }
        }).then(() => {
            resolve();
        }).catch(function (err) {
            console.log(err);
        })

    })  
     
}

async function decrypt_token(str,key){
    console.log('开始解密token值')
    return new Promise((resolve) => {
        let dom =  new JSDOM(`<script>${str}</script>`, {
            runScripts: 'dangerously'
            })
        try {
		        token = dom.window[key]
                console.log(token)
                console.log('解密成功')
                resolve()     
			} catch (e) {
			    console.log(e);					
			} 
        });
}

async function game_index(){
    console.log('\n==== 查询能量值 ====\n')
    return new Promise((resolve)=>{
    let ts = Math.round(new Date().getTime() / 1000).toString();  
    let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/game/index.do?user_type=0&is_from_share=1&_t=${ts}`
    let host = (url.split('//')[1]).split('/')[0]
    let options = {
        url: url,
        headers: {
            'Host' : host,
            'Connection' : 'keep-alive',
            'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
            'Accept-Encoding' : 'gzip',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'Cookie':Cookie,        
        }
    }
   axios.request(options).then(function (response) {
        try {
            //console.log(response)
            let result = response.data 
            if (result.success == true) {
                console.log(`能量值：${result.data.leftEnergyBall}`)
                leftEnergyBall = result.data.leftEnergyBall
                isTravelling = result.data.isTravelling
                console.log(`旅行中：${result.data.isTravelling}`)
            } else {
                console.log(result) 
            }                                   
        } catch (e) {
           console.log(e)
        }
    }).then(()=> {
        resolve();
    }).catch(function (err) {
        console.log(err);
    })
    })
}

async function today_checkin(){
    console.log('\n==== 查询今日签到信息 ====\n')
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/checkin_1/query.do?intervalType=0&user_type=0&is_from_share=1&_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
                url: url,
                headers: {
                    'Host' : host,
                    'Connection' : 'keep-alive',
                    'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    'Accept-Encoding' : 'gzip',
                    'Cookie':Cookie,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                }
            }
           axios.request(options).then(function (response) {
                try {
                    let result = response.data
                    //console.log(result)
                    todaySign = result.data.todaySign
                    console.log(todaySign)                    
                } catch (e) {
                   console.log(e)
                }
            }).then(() => {
                resolve();
            }).catch(function (err) {
                console.log(err);
            })   
        }) 
}

async function doSign(){
    console.log('\n==== 开始签到 ====\n')
    await getToken()
    await $.wait(1000)
    await decrypt_token(token_str,ohjaiohdf_key)
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/checkin_1/doSign.do?_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            method:'post',
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:`token=${token}&user_type=0&is_from_share=1&_t=${ts}`
        } 
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                console.log(result)                                                                                                    
            } catch (e) {
               console.log(e)
            }
        }).then(() => {
            resolve();
        }).catch(function (err) {
            console.log(err);
        })

    })  
}

async function useEnergyBall(){    
    console.log('\n==== 加速能量 ====\n')
    await getToken()
    await $.wait(1000)
    await decrypt_token(token_str,ohjaiohdf_key)
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/game/useEnergyBall.do?_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            method:'post',
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:`token=${token}&user_type=0&is_from_share=1&_t=${ts}`
        } 
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                //console.log(result)
                if (result.success == true ){
                    console.log('加速成功') 
                } else {
                    console.log(result)
                }                                                                                              
            } catch (e) {
               console.log(e)
            }
        }).then(() => {
            resolve();
        }).catch(function (err) {
            console.log(err);
        })

    })  
}

async function finishBrowseInfoTask(code){
    await getToken()
    await $.wait(1000)
    await decrypt_token(token_str,ohjaiohdf_key)
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/customTask1/finishBrowseInfoTask.do?_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            method:'post',
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:`taskCode=${code}&token=${token}&user_type=0&is_from_share=1&_t=${ts}`
        } 
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                console.log(result)                                                          
            } catch (e) {
               console.log(e)
            }
        }).then(() => {
            resolve();
        }).catch(function (err) {
            console.log(err);
        })

    })  
}

async function queryTasks(){
    console.log('\n==== 查询任务列表 ====\n')
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/customTask1/queryTasks.do?user_type=0&is_from_share=1&_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
            }
        } 
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                if (result.success = true) {
                   let tasklist = result.data.item
                   for (let i = 0;i < tasklist.length;i++) {
                        //console.log(tasklist[i].title)
                        if (!tasklist[i].completedSize) {
                            undone.push(tasklist[i].title)
                            undone_code.push(tasklist[i].code)
                        } else {
                            completed.push(tasklist[i].title)
                        }
                   }
                }
                //console.log(result)                
                console.log('获取成功')
            } catch (e) {
               console.log(e)
            }
        }).then(() => {
            resolve();
        }).catch(function (err) {
            console.log(err);
        })

    })  
     
}

async function startTravel(){
    console.log('\n==== 开始旅行 ====\n')
    await getToken()
    await $.wait(1000)
    await decrypt_token(token_str,ohjaiohdf_key)
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p85657820/customTask1/startTravel.do?_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            method:'post',
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:`token=${token}&user_type=1&is_from_share=1&_t=${ts}`
        } 
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                console.log(result)                                                                                                    
            } catch (e) {
               console.log(e)
            }
        }).then(() => {
            resolve();
        }).catch(function (err) {
            console.log(err);
        })

    })  
}

async function Envs() {
    if (kwwmemberId) {
        if (kwwmemberId.indexOf("@") != -1) {
            kwwmemberId.split("@").forEach((item) => {
                kwwmemberIdArr.push(item);
            });
        } else if (kwwmemberId.indexOf("\n") != -1) {
            kwwmemberId.split("\n").forEach((item) => {
                kwwmemberIdArr.push(item);
            });
        } else {
            kwwmemberIdArr.push(kwwmemberId);
        }
    } else {
        console.log(`\n 【${$.name}】：未填写变量 kwwmemberId`)
        return;
    }

    return true;
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }