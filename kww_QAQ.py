# -*- coding: utf-8 -*-

import requests,json,time,random,notify
from urllib.parse import quote, unquote

# 抓包 填写自己的 memberId
# 微信小程序 口味王 
# 完成签到、收青果、阅读文章
# 其他任务待添加

memberId = ''
memberName = ''
article_Title = []
article_total = 0
notice_str = ''

def get_user_info():
    url = 'https://member.kwwblcj.com/member/api/info/?userKeys=v1.0&pageName=member-info-index-search&formName=searchForm&kwwMember.memberId='+str(memberId)+'&kwwMember.unionid=undefined&memberId='+str(memberId)
    headers = {
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'Referer': 'https://servicewechat.com/wxfb0905b0787971ad/34/page-frame.html',
            'Accept-Encoding': 'gzip, deflate, '
    }
    r = requests.get(url,headers=headers)
    global memberName
    if r.status_code == 200:
        print(r.json()['msg'])
        print('用户:',r.json()['ids']['memberInfo']['userCname'])
        memberName = r.json()['ids']['memberInfo']['userCname']
        global notice_str
        notice_str += '用户:'+str(r.json()['ids']['memberInfo']['userCname'])+'\n'
        #print(r.json())

    else:
        print('请求失败')

def sign_in():
    url = 'https://member.kwwblcj.com/member/api/submit/?userKeys=v1.0'
    body = {"pageName": "AddSignSvmInfo","formName": "addForm","orderNo": "1","paramNo": "10","cateId": "510595814817529856","memberId": "{}".format(memberId),"memberName": "{}".format(memberName)}
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Referer': 'https://servicewechat.com/wxfb0905b0787971ad/34/page-frame.html',
        'Accept-Encoding': 'gzip, deflate'
    }

    r = requests.post(url,headers=headers,data=json.dumps(body))
    if r.status_code == 200:
        print('签到:',r.json()['msg'])
        #print(r.json())
        global notice_str
        notice_str += '签到:'+str(r.json()['msg'])+'\n'
    else:
        print('请求失败')

def get_score():
    url= 'https://member.kwwblcj.com/member/api/list/?userKeys=v1.0&pageName=select-member-score&formName=searchForm&memberId={}'.format(memberId)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate' 
    }
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        print('积分:',r.json()['rows'][0])
        global notice_str
        notice_str += '积分:'+str(r.json()['rows'][0])+'\n'
    else:
        print('请求失败')

def article_list():
    ts = str(int(time.time() * 1000))
    url = 'https://cms.kwwblcj.com/data/xxsbanner2.json?T={}'.format(ts)+'&memberId={}'.format(memberId)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
    }
    r =requests.get(url,headers=headers)
    if r.status_code == 200:
        global article_total
        article_total = r.json()['total']
        #print(r.json())
        for row in r.json()['rows']:
         for key in row:
            global article_List
            if key == 'title':
                #print(row[key])
                article_Title.append(row[key])
        #print(article_List)
    else:
        print('请求失败')

def read_task():
    articleTitle = article_Title[random.randrange(0,int(article_total))]
    title = quote(articleTitle)
    url = 'https://member.kwwblcj.com/member/api/list/?userKeys=v1.0&pageName=setNewsReadTaskFlag&formName=addForm&memberId={}'.format(memberId)+'&userCname={}'.format(memberName)+'&articleTitle={}'.format(title)

    headers ={
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
    }
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        if r.json()['flag'] == 'T':
            print('每日阅读:',True)
            global notice_str
            notice_str += '每日阅读:'+str(True)+'\n'
        

    else:
        print('请求失败')

def green():
    url = 'https://member.kwwblcj.com/member/api/list/?userKeys=v1.0&pageName=activeTaskFlag&formName=editForm&memberId={}'.format(memberId)+'&userCname={}'.format(memberName)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
    }
    r =requests.get(url,headers)
    if r.status_code == 200:
        if r.json()['flag'] == 'T':
            print('访问青果',True)
            global notice_str
            notice_str += '访问青果:'+str(True)+'\n'
        
    else:
        print('请求失败')

def daily_task():
    article_list()
    read_task()
    green()

if __name__ == "__main__":
    get_user_info()
    get_score()
    sign_in()
    daily_task()
    notify.send('口味王',notice_str)