# -*- coding: utf-8 -*-



## 注意依赖变化，缺啥补啥

import requests,json,time,random,datetime,hashlib,base64,config
from urllib.parse import quote, quote_plus, unquote
from urllib import parse
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
from Crypto.PublicKey import RSA

## 微信小程序 
## 口味王 
## 天降好礼 小游戏
## 引入配置文件 config.py



memberId = config.kww['memberId']
redirect = ''
auto_login_url = ''
cookie = ''

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
            if row['title'] == '天降好礼':
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
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/superSurprise/getActivityInfo?_={}'.format(ts)+'&id=85'
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
        if r.json()['data']['remainFreeJoinTimes'] > 0:
            print('免费天降好礼')
            print('开始游戏')
            start()
            # if r.json()['data']['remainJoinTimes'] > 0:
            #     print('积分天降好礼')
            #     i = r.json()['data']['remainJoinTimes'] - r.json()['data']['remainFreeJoinTimes']
            #     while i > 0:
            #         print('开始游戏...')
            #         start()
            #         print('休息一下吧')                   
            #         time.sleep(5)
            #         i -= 1
        else:
            print('今日游戏次数已上限')
    else:
        print('请求失败')

def session_cookie(url):
    s = requests.Session()
    r= s.get(url)
    #print(s.cookies.get_dict())
    #print(r.text)
    cookie_value = ''
    for x,y in s.cookies.get_dict().items():
        cookie_value += x + '=' + y + ';'
    return cookie_value

def start():
    ts = str(time.time() * 1000)
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/superSurprise/doJoin?_={}'.format(ts)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    body = {
            'id':'85'
        }
    r = requests.post(url=url,headers=headers,data=parse.urlencode(body))
    if r.status_code == 200:
        #print(r.json()) 
        print(r.json()['success'])      
        print('等待11秒执行提交...')
        time.sleep(11)
        submit(r.json()['data']['recordId'])
        print('等待3秒执行领取...')
        time.sleep(3)
        join_record_status(r.json()['data']['recordId'])

    else:
        print('请求失败')

def submit(recordId):
    ts = int(time.time() * 1000)
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/superSurprise/submit?_={}'.format(ts)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie),
        'Content-Type': 'application/json;charset=UTF-8'
    }
    _score = '66'
    public_key = '''-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1JdBGmK6g6yj3w5YDNCv
    DL2SjnJMSUExcfYY9fOd2ZOTyzh6suMfR5vBAyBGsolKUmUqh6blqOeNApSKJhkE
    WMhxG3eERZZYwmtUCRkH1WDQkA/dSuBOnFHQ4sjoMdTuv80j5TNVMtV7qDVEp0XF
    +muYLuA3tXGgrYVQu8iLAH0kqr9T2u/a6We8qhgvE6ddKxMLyEz3sRnWShioTl/F
    mjaqCiU3NHNPL8DztEnpsGreq66vp4wPG8Q6UfGHdDiDx+/xJrYDkfnoX0u/OpSx
    qL8sCHvrmj8fHlptnwy2sgwhREyChWH1JZLV2RWJhOJ63PfnlH7BvqLke2qWLM9Y
    AwIDAQAB
    -----END PUBLIC KEY-----
    '''
    cipher = Cipher_pkcs1_v1_5.new(RSA.importKey(public_key))
    score = base64.b64encode(cipher.encrypt(_score.encode())).decode()
    #print('加密score:',score)
    #print('时间戳:',ts)
    _ts = hex(ts)[2:]
    _sign = '{}'.format(_score)+'{}'.format(ts)+'{}'.format(_ts)
    #print('加密前sign字符串:',_sign)
    sign = encript(_sign)
    #print('加密后sign:',sign)
    body = {
        'activityId': '85',
        'recordId': '{}'.format(recordId),
        'score': '{}'.format(score),
        'sign':'{}'.format(sign),
        'timestamp':'{}'.format(ts)

    }
    #print(body)
    r = requests.post(url,headers=headers,data=json.dumps(body))
    if r.status_code == 200:
        #print(r.json())
        print(r.json()['success'])
    else:
        print('请求失败')

def join_record_status(Id):
    ts = str(time.time() * 1000)
    url = 'https://89420.activity-20.m.duiba.com.cn/aaw/superSurprise/joinRecordStatus?_={}'.format(ts)+'&id={}'.format(Id)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie':'{}'.format(cookie),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    r = requests.get(url,headers=headers)
    #print(r.request.headers)
    if r.status_code == 200:
        #print(r.json())
        print(r.json()['success'])
        print(r.json()['data']['prizeInfo']['prizeName'])

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


