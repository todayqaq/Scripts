# -*- coding: utf-8 -*-


## 注意依赖变化，缺啥补啥

import requests,json,time,random,datetime,hashlib,re,config
from urllib.parse import quote, quote_plus, unquote
from urllib import parse
from bs4 import BeautifulSoup

## 微信小程序 
## 口味王 
## 海岛游乐场 小游戏
## 引入配置文件 config.py


memberId = config.kww['memberId']
redirect = ''
auto_login_url = ''
cookie = ''
key = ''

def activity_url():
    global redirect
    ts = str(int(time.time() * 1000))
    url = 'https://cms.kwwblcj.com/data/c05.json?T={}'.format(ts)+'&memberId={}'.format(memberId)
    #print(url)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
    }
    r = requests.get(url=url,headers=headers)
    #print(r.json())
    if r.status_code == 200:
        rows = r.json()['rows']
        for row in rows:
            if row['title'] == '海岛游乐场':
                redirect = row['url']
                #print(redirect)
    else:
        print('请求失败')

def login_free_plugin():
    global auto_login_url,cookie
    url_redirect = quote(redirect)
    url = 'https://member.kwwblcj.com/member/api/info/?userKeys=v1.0&pageName=loginFreePlugin&formName=searchForm&uid={}'.format(memberId)+'&levelCode=1&redirect={}'.format(url_redirect)
    #print(url)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
    }
    r = requests.get(url=url,headers=headers)
    if r.status_code == 200:
        #print(r.json())
        if r.json()['msg'] == '信息获取成功！':
           auto_login_url = r.json()['result'] 
           #print(auto_login_url)
           #print(session_cookie(auto_login_url))
           cookie= session_cookie(auto_login_url)
    else:
        print('请求失败')

def game_info():
    ts = str(int(time.time() * 1000))
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/underseaGame/getInfo?__ts__={}'.format(ts)+'&opId=202214587511596'
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie)
    }
    r = requests.get(url=url,headers=headers)
    if r.status_code == 200:
        #print(r.json())
        if r.json()['data']['remainingLimitTimes'] > 0:
            print('开始海岛游戏')
            start()
        else:
            print('今日游戏次数已上限')
    else:
        print('请求失败')

def session_cookie(url):
    global key
    s = requests.Session()
    r= s.get(url)
    #print(s.cookies.get_dict())
    #print(r.text)
    cookie_value = ''
    for x,y in s.cookies.get_dict().items():
        cookie_value += x + '=' + y + ';'
    #print(r.text)   
    soup = BeautifulSoup(r.text,'html.parser') 
    _key = soup.find_all(string=re.compile('key:'))
    #print(_key)
    str_key = str(_key).replace('\\n','').replace(' ','').replace('"','').replace(';','').replace('[varCFG=','').replace(']','')[43:-2]   
    #str_opId = str(_key).replace('\\n','').replace(' ','').replace('"','').replace(';','').replace('[varCFG=','').replace(']','')[7:22]
    #print(str_opId)
    print('key:',str_key)
    key = str_key
    return cookie_value

def start():
    ts = str(time.time() * 1000)
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/underseaGame/start?__ts__={}'.format(ts)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    body = {
            'opId':'202214587511596'
        }
    r = requests.post(url=url,headers=headers,data=parse.urlencode(body))
    if r.status_code == 200:
        #print(r.json())
        #print(r.json()['data']['startId'])
        #print(str(r.json()['data']['orderNum']))
        round = 1
        score = 5 
        total_score = 5
        while round < 4:
            print('开始游戏',round)
            get_order_status(r.json()['data']['startId'],str(r.json()['data']['orderNum']))
            start_round(r.json()['data']['startId'],round)
            print('等待15秒执行提交...')
            time.sleep(15)
            submit(r.json()['data']['startId'],round,score,total_score)
            print('领取奖励')
            time.sleep(2)
            draw(r.json()['data']['startId'],round)
            round += 1
            score += 5
            total_score += score                               
    else:
        print('请求失败')

def get_order_status(startId,orderNum):
    ts = str(time.time() * 1000)
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/underseaGame/getOrderStatus?__ts__={}'.format(ts)+'&opId=202214587511596&startId={}'.format(startId)+'&orderNum={}'.format(orderNum)+'&type=1'
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    r = requests.get(url=url,headers=headers)
    if r.status_code == 200:
        print(r.json()['success'])

    else:
        print('请求失败')

def submit(startId,roundIndex,score,totalScore):
    ts = str(time.time() * 1000)
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/underseaGame/submit?__ts__={}'.format(ts)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    _sign = 'opId=202214587511596&roundIndex={}'.format(roundIndex)+'&score={}'.format(score)+'&startId={}'.format(startId)+'&totalScore={}'.format(totalScore)+'&key={}'.format(key)
    #print(_sign)
    sign = encript(_sign)
    body = {
        'opId':'202214587511596',
        'startId':'{}'.format(startId),
        'roundIndex':'{}'.format(roundIndex),
        'score':'{}'.format(score),
        'totalScore':'{}'.format(totalScore),
        'sign':'{}'.format(sign),
    }
    data = parse.urlencode(body)
    #print(data)
    r = requests.post(url,headers=headers,data=data)
    #print(r.request.headers)
    #print(r.request.body)
    if r.status_code == 200:
        print(r.json()['success'])

def start_round(startId,roundIndex):
    ts = str(time.time() * 1000)
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/underseaGame/startRound?__ts__={}'.format(ts)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    body = {
        'opId':'202214587511596',
        'startId':'{}'.format(startId),
        'roundIndex':'{}'.format(roundIndex),
    }
    r = requests.post(url,headers=headers,data=parse.urlencode(body))
    #print(r.request.headers)
    if r.status_code == 200:
        print(r.json()['success'])

def draw(startId,roundIndex):
    ts = str(time.time() * 1000)
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/underseaGame/draw?__ts__={}'.format(ts)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    body = {
        'opId':'202214587511596',
        'startId':'{}'.format(startId),
        'roundIndex':'{}'.format(roundIndex),
    }
    r = requests.post(url,headers=headers,data=parse.urlencode(body))
    #print(r.request.headers)
    if r.status_code == 200:
        print(r.json()['data']['name'])

## MD5
def encript(str):
    md5 = hashlib.md5()
    md5.update(str.encode('utf-8'))
    res = md5.hexdigest()
    return res


if __name__ == "__main__":
    activity_url()
    login_free_plugin()
    game_info()

