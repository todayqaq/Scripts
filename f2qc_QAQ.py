# -*- coding: utf-8 -*-

import requests,json,notify
from urllib.parse import quote, unquote

## 非凡汽车 签到、转发
## 抓包后找到 token、watch-man-token 填入自己的信息
f2_token = ""
f2_watch_man_token = ""
notice_str = ''

def get_user_info():
    urlParam = quote(str({"token":"{}".format(f2_token),"brandCode":4}))
    url = 'https://apps.risingauto.com/app-mp/uais/1.1/fetchCcmUserInfoV2?data={}'.format(urlParam)
    headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
    }
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        global notice_str
        if ('err_resp' in r.json() and r.json()['err_resp']['code'] == '14101'):          
            print(r.json()['err_resp']['msg'])
            notice_str += r.json()['err_resp']['msg']+'\n'
        else:
            print('用户:',json.loads(r.json()['data'])['content']['username'])
            print('积分:',json.loads(r.json()['data'])['content']['points'])
            notice_str += '用户:'+json.loads(r.json()['data'])['content']['username']+'\n'
            notice_str += '积分:'+str(json.loads(r.json()['data'])['content']['points'])+'\n'
            share()
            signin()
            
    else:
        print('请求失败')

def share():
    print('开始分享任务')
    url = 'https://apps.risingauto.com/api/community/share/r/app/shareTaskTouch?brandCode=4'
    headers = {
    'Content-Type': 'application/json',
    'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
    'token':'{}'.format(f2_token),
    'watch-man-token':'{}'.format(f2_watch_man_token),
    'Referer':'https://servicewechat.com/wx14d31484a3b5aafd/4/page-frame.html',
    }
    data_body = {"businessType":4001}

    r = requests.post(url,headers=headers,data=json.dumps(data_body))
    if r.status_code == 200:
        global notice_str
        #print(r.json())        
        print('分享结果:',r.json()['success'])
        notice_str += '分享结果:'+str(r.json()['success'])+'\n'
    else:
        print('请求失败')

def signin():
    print('开始签到任务')
    url = 'https://apps.risingauto.com/api/energy/task/r/mini/dailySignIn?brandCode=4'
    headers = {
    'Content-Type': 'application/json',
    'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
    'token':'{}'.format(f2_token),
    'watch-man-token':'{}'.format(f2_watch_man_token),
    'Referer':'https://servicewechat.com/wx14d31484a3b5aafd/4/page-frame.html',
    }
    data_body = {"token":"{}".format(f2_token)}

    r = requests.post(url,headers=headers,data=json.dumps(data_body))
    if r.status_code == 200:
        global notice_str
        if r.json()['resultCode'] == 200:
            print('签到获得积分:',r.json()['data']['point'])
            print('已连续签到:',str(r.json()['data']['periodCheckInDays'])+'天')
            notice_str += '签到获得积分:'+str(r.json()['data']['point'])+'\n'
            notice_str += '已连续签到:'+str(r.json()['data']['periodCheckInDays'])+'天'+'\n'
        if r.json()['resultCode'] == 90050011:
            print(r.json()['errMsg'])
            notice_str += r.json()['errMsg']+'\n'
        if r.json()['resultCode'] == 21104:
            print(r.json()['errMsg'])               
            
    else:
        print('请求失败')


if __name__ == "__main__":
    get_user_info()
    notify.send('非凡汽车',notice_str)