# -*- coding: utf-8 -*-

import json,time,hashlib,base64,requests,notify
from urllib.parse import quote, unquote

## Hipc 小程序签到
## 抓包后找到 Token 填入自己的信息

HipcToken = ''

## 留空即可
userId = ''
notice_str = ''

## 获取用户id
def get_user_info():
    data_body = []
    url = 'https://api.hipcapi.com/api/vip/home'
    headers = {
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'token': '{}'.format(HipcToken),
        'Referer': 'https://servicewechat.com/wx6265a35adb332603/116/page-frame.html',
        'Accept-Encoding': 'gzip, deflate, b',
    }
    r = requests.post(url,headers=headers,data=json.dumps(data_body))
    if r.status_code == 200:        
        if r.json()['code'] == 100:
            global userId
            userId = r.json()['data']['count']['user_id']
        else:
            print(r.json()[message])
    else:
        print('请求失败')

## 获取签到状态
def get_sign_info():
    data_body = {}
    url = 'https://api.hipcapi.com/v1/signin/get'
    headers = {
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'token': '{}'.format(HipcToken),
        'Referer': 'https://servicewechat.com/wx6265a35adb332603/116/page-frame.html',
        'Accept-Encoding': 'gzip, deflate, b',
    }
    r = requests.post(url,headers=headers,data=json.dumps(data_body))
    if r.status_code == 200:
        global notice_str
        if r.json()['code'] == 100:
            if (r.json()['data']['today_is_signin'] != True ):
                print('开始签到...')
                signin()
            else:
                print('签到结果：',r.json()['data']['today_is_signin'])
                notice_str += '签到结果:'+str(r.json()['data']['today_is_signin'])+'\n'
        else:
            print(r.json()[message])
    else:
        print('请求失败')

## 获取容量
def get_user_score():
    data_body = {}
    url = 'https://api.hipcapi.com/v1/userscore/detail'
    headers = {
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'token': '{}'.format(HipcToken),
        'Referer': 'https://servicewechat.com/wx6265a35adb332603/116/page-frame.html',
        'Accept-Encoding': 'gzip, deflate, b',
    }
    r = requests.post(url,headers=headers,data=json.dumps(data_body))
    if r.status_code == 200:
        global notice_str
        if r.json()['code'] == 100:
            print('可使用容量：',r.json()['data']['can_use_score'])
            notice_str += '可使用容量:'+str(r.json()['data']['can_use_score'])+' MB'
        else:
            print(r.json()[message])
    else:
        print('请求失败')

## 签到
def signin():
    ## 13位时间戳
    ts = str(int(time.time() * 1000))
    ## body数据
    data_opt = {
        "unixtime":"{}".format(ts)
    }
    sign = en(data_opt)
    data_body = {"unixtime":"{}".format(ts),"sign":"{}".format(sign)}
    url = 'https://api.hipcapi.com/v1/userscoreadd/signin'
    headers = {
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'token': '{}'.format(HipcToken),
        'Referer': 'https://servicewechat.com/wx6265a35adb332603/116/page-frame.html',
        'Accept-Encoding': 'gzip, deflate, b',
    }
    r = requests.post(url,headers=headers,data=json.dumps(data_body))
    #print(r.json())
    if r.status_code == 200:
        global notice_str
        if r.json()['code'] == 100:
            print('签到结果：',r.json()['message'])
            notice_str += '签到结果:'+str(r.json()['message'])+'\n'
        elif r.json()['code'] == 1002:
            print('签到结果：',r.json()['message'])
            notice_str += '签到结果:'+str(r.json()['message'])+'\n'
        else:
            print(r.json()['message'])
    else:
        print('请求失败')

## sign
def en(data):
    obj = data
    arr = []
    for i in obj:
        arr.append(i)
    arr.sort()
    sortObj = {}
    url = ""
    for i in arr:
        x = arr.index(i)
        url =  '' + arr[x] + "=" + quote(obj[arr[x]])
    global userId            
    mdata = url + "xuyaoxiangXUYAOXIANG" + str(userId)
    return encript(mdata)

## MD5
def encript(str):
    md5 = hashlib.md5()
    md5.update(str.encode('utf-8'))
    res = md5.hexdigest()
    return res

if __name__ == "__main__":
    get_user_info()   
    get_sign_info()
    get_user_score()
    notify.send('Hipc',notice_str)
