/* 
 微信小程序 口味王

 天天抢红包

 满足条件获取红包码

 青龙测试通过

 必须变量名 kwwmemberId  多账号分割符是 @ 或者 换行

 注意nodejs 依赖 

 axios@0.27.2
 jsdom
 xpath
 xmldom
 request
 
*/


const jsname = '天天抢红包'
const $ = Env(jsname)

var redirect,loginUrl,Cookie,token_str,ohjaiohdf_key,token,todayJoinAnswerFlag,myTotalMoney,orderId,ticketNum,myNewCodeList,haveExchangeCodeCount,myCodeList,code,leftCredits
var l = [ "A", "Z", "B", "Y", "C", "X", "D", "T", "E", "S", "F", "R", "G", "Q", "H", "P", "I", "O", "J", "N", "k", "M", "L", "a", "c", "d", "f", "h", "k", "p", "y", "n" ]
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
    await game_index()
    await $.wait(1000)
    await exchangeInfo()
    await $.wait(1000)
    if (haveExchangeCodeCount < 1){
        if(todayJoinAnswerFlag){
            if(leftCredits > 880){
                await get_key_str()
                await $.wait(1000)
                await getExchangeOrderId()
                await $.wait(1000)
                await creditsCost()
                console.log("等待三秒查询状态")
                await $.wait(3000)
                await queryStatus()
                await $.wait(1000)
                await exchange()
            } else{
                console.log("跳过兑换，积分不足880")
            }
        } else {
            console.log("跳过兑换，今日未答题")
        }
    } else {
        console.log("跳过兑换，今日红包码已上限")
    }
}

async function user(){
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime()).toString();
        let url = `https://member.kwwblcj.com/member/api/info/?userKeys=v1.0&pageName=member-info-index-search&formName=searchForm&kwwMember.memberId=${memberId}&kwwMember.unionid=undefined&memberId=${memberId}`
        let host = (url.split('//')[1]).split('/')[0]
        let random = getRandomInt(0,31)
        let t = memberId
        let sign = s(ts,t,random)
        let options = {
                url: url,
                headers: {
                    'Host' : host,
                    'Connection' : 'keep-alive',
                    'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    'Accept-Encoding' : 'gzip',
                    'user-paramname': 'memberId',
                    'user-random': random,
                    'user-sign': sign,
                    'user-timestamp': ts,
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
    let url = `https://cms.kwwblcj.com/data/scanshop.json?T=${ts}`
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
                if(rows[i].title == "抢红包"){
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
    let url = `https://member.kwwblcj.com/member/api/info/?userKeys=v1.0&pageName=loginFreePlugin&formName=searchForm&uid=${memberId}&levelCode=1&redirect=${url_redirect}&actionType=betelNutTree&actionDesc=%E7%82%B9%E5%87%BB%E9%A6%96%E9%A1%B5%E6%A7%9F%E6%A6%94%E6%A0%91%E5%8C%BA%E5%9F%9F%E8%B7%B3%E8%BD%AC%E5%85%BB%E6%88%90%E6%B4%BB%E5%8A%A8&memberId=${memberId}`
    let host = (url.split('//')[1]).split('/')[0]
    let ts = Math.round(new Date().getTime()).toString();
    let random = getRandomInt(0,31)
    let t = memberId
    let sign = s(ts,t,random)
    let options = {
        url: url,
        headers: {
            'Host' : host,
            'Connection' : 'keep-alive',
            'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
            'Accept-Encoding' : 'gzip',
            'user-paramname': 'memberId',
            'user-random': random,
            'user-sign': sign,
            'user-timestamp': ts,
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
    let url = ` https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/getTokenKey?_t=${ts}&_t=${ts}`
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
            'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/index.html?appID=89420&from=login&spm=89420.1.1.1',
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
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/getToken?_t=${ts}`
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
                'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/index.html?appID=89420&from=login&spm=89420.1.1.1',
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
    console.log('\n==== 查询答题红包信息====\n')
    return new Promise((resolve)=>{
    let ts = Math.round(new Date().getTime() / 1000).toString();  
    let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/game/index.do?kww_user_source=4&kww_user_type=0&user_type=1&is_from_share=1&_t=${ts}`
    let host = (url.split('//')[1]).split('/')[0]
    let options = {
        url: url,
        headers: {
            'Host' : host,
            'Connection' : 'keep-alive',
            'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
            'Accept-Encoding' : 'gzip',
            'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/index.html?appID=89420&from=login&spm=89420.1.1.1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'Cookie':Cookie,        
        }
    }
   axios.request(options).then(function (response) {
        try {
            //console.log(response)
            let result = response.data 
            //console.log(result)
            if (result.success == true) {
                 todayJoinAnswerFlag = result.data.todayJoinAnswerFlag
                 console.log("参与今日答题："+todayJoinAnswerFlag)
                 myTotalMoney = result.data.myTotalMoney
                 console.log("我的红包："+(myTotalMoney/100)+"元")
                 myCodeList = result.data.currentCycleInfo.myCodeList
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

async function getExchangeOrderId(){    
    console.log('\n==== 开始获取订单号 ====\n')
    await getToken()
    await $.wait(1000)
    await decrypt_token(token_str,ohjaiohdf_key)
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();        
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/game/getExchangeOrderId.do?_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            method:'post',
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/index.html?appID=89420&from=login&spm=89420.1.1.1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:`exchangeOneCodeConsumeCredits=880&exchangeCodeCount=1&token=${token}&user_type=1&is_from_share=1&_t=${ts}`

        }
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                //console.log(result)
                if (result.success == true ){
                    orderId = result.data.orderId
                    console.log(orderId)
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

async function creditsCost(){    
    console.log('\n==== 提交订单 ====\n')
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();        
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/credits/creditsCost.do?_t=${ts}`        
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            method:'post',
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/index.html?appID=89420&from=login&spm=89420.1.1.1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:`toPlaywayId=game&toActionId=exchange&desc=exchange_consume_credits_desc&credits=880&orderId=${orderId}&user_type=1&is_from_share=1&_t=${ts}`

        }
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                //console.log(result)
                if (result.success == true ){
                    ticketNum = result.data
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

async function queryStatus(){
    console.log('\n==== 查询提交状态 ====\n')
    return new Promise((resolve)=>{
    let ts = Math.round(new Date().getTime() / 1000).toString();  
    let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/credits/queryStatus.do?ticketNum=${ticketNum}&user_type=1&is_from_share=1&_t=${ts}`
    let host = (url.split('//')[1]).split('/')[0]
    let options = {
        url: url,
        headers: {
            'Host' : host,
            'Connection' : 'keep-alive',
            'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
            'Accept-Encoding' : 'gzip',
            'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/index.html?appID=89420&from=login&spm=89420.1.1.1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'Cookie':Cookie,        
        }
    }
   axios.request(options).then(function (response) {
        try {
            //console.log(response)
            let result = response.data 
            console.log(result)
            if (result.success == true) {
                 //console.log(result.data)
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

async function exchange(){    
    console.log('\n==== 开始兑换红包码 ====\n')
    await getToken()
    await $.wait(1000)
    await decrypt_token(token_str,ohjaiohdf_key)
    return new Promise((resolve)=>{
        let ts = Math.round(new Date().getTime() / 1000).toString();   
        let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/game/exchange.do?_t=${ts}`
        let host = (url.split('//')[1]).split('/')[0]
        let options = {
            method:'post',
            url:url,
            headers: {
                'Host' : host,
                'Connection' : 'keep-alive',
                'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
                'Accept-Encoding' : 'gzip',
                'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/index.html?appID=89420&from=login&spm=89420.1.1.1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'Cookie':Cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:`ticket=${ticketNum}&exchangeCodeCount=1&exchangeOneCodeConsumeCredits=880&token=${token}&user_type=1&is_from_share=1&_t=${ts}`
        }
        axios.request(options).then(function (response) {
            try {
                let result = response.data
                //console.log(result)
                if (result.success == true ){
                    myNewCodeList = result.data.myNewCodeList
                    console.log("获得红包码："+result.data.myNewCodeList[0].code)
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

async function exchangeInfo(){
    console.log('\n==== 查询积分信息 ====\n')
    return new Promise((resolve)=>{
    let ts = Math.round(new Date().getTime() / 1000).toString();  
    let url = `https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/game/exchangeInfo.do?user_type=1&is_from_share=1&_t=${ts}`
    let host = (url.split('//')[1]).split('/')[0]
    let options = {
        url: url,
        headers: {
            'Host' : host,
            'Connection' : 'keep-alive',
            'Accept-Language' : 'zh-CN,zh-Hans;q=0.8',
            'Accept-Encoding' : 'gzip',
            'Referer': 'https://89420.activity-20.m.duiba.com.cn/projectx/p725daef0/index.html?appID=89420&from=login&spm=89420.1.1.1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'Cookie':Cookie,        
        }
    }
   axios.request(options).then(function (response) {
        try {
            //console.log(response)
            let result = response.data 
            //console.log(result)
            if (result.success == true) {
                 //console.log("成功了")
                 leftCredits = result.data.leftCredits
                 console.log("当前积分："+result.data.leftCredits)
                 haveExchangeCodeCount = result.data.haveExchangeCodeCount
                 console.log("当前红包码数量："+result.data.haveExchangeCodeCount)
                 if (haveExchangeCodeCount > 0){
                    code = myCodeList[0].code
                    console.log("我的红包码："+code)
                }
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

function s(e, t, a) {
    t || (t = "86109D696C9CC58A504EFE21662DF1B9");
    var n = e + t + l[a];
    return MD5_Encrypt(n)
}

function MD5_Encrypt(a) {
    function b(a, b) {
        return a << b | a >>> 32 - b
    }

    function c(a, b) {
        var c, d, e, f, g;
        return e = 2147483648 & a,
            f = 2147483648 & b,
            c = 1073741824 & a,
            d = 1073741824 & b,
            g = (1073741823 & a) + (1073741823 & b),
            c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f :
            g ^ e ^ f
    }

    function d(a, b, c) {
        return a & b | ~a & c
    }

    function e(a, b, c) {
        return a & c | b & ~c
    }

    function f(a, b, c) {
        return a ^ b ^ c
    }

    function g(a, b, c) {
        return b ^ (a | ~c)
    }

    function h(a, e, f, g, h, i, j) {
        return a = c(a, c(c(d(e, f, g), h), j)),
            c(b(a, i), e)
    }

    function i(a, d, f, g, h, i, j) {
        return a = c(a, c(c(e(d, f, g), h), j)),
            c(b(a, i), d)
    }

    function j(a, d, e, g, h, i, j) {
        return a = c(a, c(c(f(d, e, g), h), j)),
            c(b(a, i), d)
    }

    function k(a, d, e, f, h, i, j) {
        return a = c(a, c(c(g(d, e, f), h), j)),
            c(b(a, i), d)
    }

    function l(a) {
        for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i =
                0; c > i;)
            b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | a.charCodeAt(i) << h,
            i++;
        return b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | 128 << h,
            g[f - 2] = c << 3,
            g[f - 1] = c >>> 29,
            g
    }

    function m(a) {
        var b, c, d = "",
            e = "";
        for (c = 0; 3 >= c; c++)
            b = a >>> 8 * c & 255,
            e = "0" + b.toString(16),
            d += e.substr(e.length - 2, 2);
        return d
    }

    function n(a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
                b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
                b += String.fromCharCode(d >> 6 & 63 | 128),
                b += String.fromCharCode(63 & d | 128))
        }
        return b
    }

    var o, p, q, r, s, t, u, v, w, x = [],
        y = 7,
        z = 12,
        A = 17,
        B = 22,
        C = 5,
        D = 9,
        E = 14,
        F = 20,
        G = 4,
        H = 11,
        I = 16,
        J = 23,
        K = 6,
        L = 10,
        M = 15,
        N = 21;
    for (a = n(a),
        x = l(a),
        t = 1732584193,
        u = 4023233417,
        v = 2562383102,
        w = 271733878,
        o = 0; o < x.length; o += 16)
        p = t,
        q = u,
        r = v,
        s = w,
        t = h(t, u, v, w, x[o + 0], y, 3614090360),
        w = h(w, t, u, v, x[o + 1], z, 3905402710),
        v = h(v, w, t, u, x[o + 2], A, 606105819),
        u = h(u, v, w, t, x[o + 3], B, 3250441966),
        t = h(t, u, v, w, x[o + 4], y, 4118548399),
        w = h(w, t, u, v, x[o + 5], z, 1200080426),
        v = h(v, w, t, u, x[o + 6], A, 2821735955),
        u = h(u, v, w, t, x[o + 7], B, 4249261313),
        t = h(t, u, v, w, x[o + 8], y, 1770035416),
        w = h(w, t, u, v, x[o + 9], z, 2336552879),
        v = h(v, w, t, u, x[o + 10], A, 4294925233),
        u = h(u, v, w, t, x[o + 11], B, 2304563134),
        t = h(t, u, v, w, x[o + 12], y, 1804603682),
        w = h(w, t, u, v, x[o + 13], z, 4254626195),
        v = h(v, w, t, u, x[o + 14], A, 2792965006),
        u = h(u, v, w, t, x[o + 15], B, 1236535329),
        t = i(t, u, v, w, x[o + 1], C, 4129170786),
        w = i(w, t, u, v, x[o + 6], D, 3225465664),
        v = i(v, w, t, u, x[o + 11], E, 643717713),
        u = i(u, v, w, t, x[o + 0], F, 3921069994),
        t = i(t, u, v, w, x[o + 5], C, 3593408605),
        w = i(w, t, u, v, x[o + 10], D, 38016083),
        v = i(v, w, t, u, x[o + 15], E, 3634488961),
        u = i(u, v, w, t, x[o + 4], F, 3889429448),
        t = i(t, u, v, w, x[o + 9], C, 568446438),
        w = i(w, t, u, v, x[o + 14], D, 3275163606),
        v = i(v, w, t, u, x[o + 3], E, 4107603335),
        u = i(u, v, w, t, x[o + 8], F, 1163531501),
        t = i(t, u, v, w, x[o + 13], C, 2850285829),
        w = i(w, t, u, v, x[o + 2], D, 4243563512),
        v = i(v, w, t, u, x[o + 7], E, 1735328473),
        u = i(u, v, w, t, x[o + 12], F, 2368359562),
        t = j(t, u, v, w, x[o + 5], G, 4294588738),
        w = j(w, t, u, v, x[o + 8], H, 2272392833),
        v = j(v, w, t, u, x[o + 11], I, 1839030562),
        u = j(u, v, w, t, x[o + 14], J, 4259657740),
        t = j(t, u, v, w, x[o + 1], G, 2763975236),
        w = j(w, t, u, v, x[o + 4], H, 1272893353),
        v = j(v, w, t, u, x[o + 7], I, 4139469664),
        u = j(u, v, w, t, x[o + 10], J, 3200236656),
        t = j(t, u, v, w, x[o + 13], G, 681279174),
        w = j(w, t, u, v, x[o + 0], H, 3936430074),
        v = j(v, w, t, u, x[o + 3], I, 3572445317),
        u = j(u, v, w, t, x[o + 6], J, 76029189),
        t = j(t, u, v, w, x[o + 9], G, 3654602809),
        w = j(w, t, u, v, x[o + 12], H, 3873151461),
        v = j(v, w, t, u, x[o + 15], I, 530742520),
        u = j(u, v, w, t, x[o + 2], J, 3299628645),
        t = k(t, u, v, w, x[o + 0], K, 4096336452),
        w = k(w, t, u, v, x[o + 7], L, 1126891415),
        v = k(v, w, t, u, x[o + 14], M, 2878612391),
        u = k(u, v, w, t, x[o + 5], N, 4237533241),
        t = k(t, u, v, w, x[o + 12], K, 1700485571),
        w = k(w, t, u, v, x[o + 3], L, 2399980690),
        v = k(v, w, t, u, x[o + 10], M, 4293915773),
        u = k(u, v, w, t, x[o + 1], N, 2240044497),
        t = k(t, u, v, w, x[o + 8], K, 1873313359),
        w = k(w, t, u, v, x[o + 15], L, 4264355552),
        v = k(v, w, t, u, x[o + 6], M, 2734768916),
        u = k(u, v, w, t, x[o + 13], N, 1309151649),
        t = k(t, u, v, w, x[o + 4], K, 4149444226),
        w = k(w, t, u, v, x[o + 11], L, 3174756917),
        v = k(v, w, t, u, x[o + 2], M, 718787259),
        u = k(u, v, w, t, x[o + 9], N, 3951481745),
        t = c(t, p),
        u = c(u, q),
        v = c(v, r),
        w = c(w, s);
    var O = m(t) + m(u) + m(v) + m(w);
    return O.toLowerCase()
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