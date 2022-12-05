# -*- coding: utf-8 -*-

import requests,json,time,random,notify,datetime,config
from urllib.parse import quote, unquote

# 抓包 填写自己的 memberId
# 微信小程序 口味王 
# 完成查询积分、签到、收青果、阅读文章、完善信息、开启签到提醒、订阅活动通知
# 小游戏 天降好礼、海岛游乐场 [superSurprise_QAQ.py,underseaGame_QAQ.py]
# 其他任务待添加

memberId = config.kww['memberId']


# 不需要填写
memberName = ''
article_Title = []
article_total = 0
notice_str = ''
undone = []
completed = []
openId = ''
headUrl = ''
rowKey = ''
today = time.strftime('%Y-%m-%d',time.localtime(time.time()))


def get_user_info():
    url = 'https://member.kwwblcj.com/member/api/info/?userKeys=v1.0&pageName=member-info-index-search&formName=searchForm&kwwMember.memberId='+str(memberId)+'&kwwMember.unionid=undefined&memberId='+str(memberId)
    headers = {
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'Referer': 'https://servicewechat.com/wxfb0905b0787971ad/34/page-frame.html',
            'Accept-Encoding': 'gzip, deflate, '
    }
    r = requests.get(url,headers=headers)
    global memberName,openId,headUrl,rowKey
    if r.status_code == 200:
        print(r.json()['msg'])
        print('用户:',r.json()['ids']['memberInfo']['userCname'])
        memberName = r.json()['ids']['memberInfo']['userCname']
        openId = r.json()['ids']['memberInfo']['openid']
        headUrl = r.json()['ids']['memberInfo']['headUrl']
        rowKey = r.json()['ids']['memberInfo']['rowKey']
        global notice_str
        notice_str += '用户:'+str(r.json()['ids']['memberInfo']['userCname'])+'\n'
        #print(r.json())

    else:
        print('请求失败')

def get_signin_info():
    url = 'https://member.kwwblcj.com/member/api/list/?userKeys=v1.0&pageName=selectSignInfo&formName=searchForm&memberId={}'.format(memberId)
    headers = {
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'Accept-Encoding': 'gzip, deflate'
    }
    r = requests.get(url,headers=headers)
    global memberName,openId,headUrl,rowKey
    if r.status_code == 200:
        signinStatus = r.json()['rows']['data']
        #print(signinStatus)
        for row in signinStatus:
            if row['actionDate'] == today and row['flag'] == '0':
                print('开始签到')
                sign_in()                        
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

def task_flag():
    url = 'https://member.kwwblcj.com/member/api/list/?userKeys=v1.0&pageName=setOpenSubscribeTaskFlag&formName=addForm&memberId={}'.format(memberId)+'&userCname={}'.format(memberName)+'&openId={}'.format(openId)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
    }
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        print('订阅活动通知:',True)
        global notice_str
        notice_str += '订阅活动通知:'+str(True)+'\n'
    else:
        print('请求失败')

def sign_task_flag():
    url = 'https://member.kwwblcj.com/member/api/list/?userKeys=v1.0&pageName=setOpenSignTaskFlag&formName=addForm&memberId={}'.format(memberId)+'&userCname={}'.format(memberName)+'&openId={}'.format(openId)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
    }
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        print('开启签到提醒:',True)
        global notice_str
        notice_str += '开启签到提醒:'+str(True)+'\n'
    else:
        print('请求失败')

def submit_user_info():
    url = 'https://member.kwwblcj.com/member/api/submit/?userKeys=v1.0'
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
    }
    body = {"kwwMember.certNo": "","kwwMember.fullName": "李逍遥","kwwMember.sex": "0","kwwMember.phone": "18866668888","kwwMember.birthday": "1982-09-20","kwwMember.userCname": "{}".format(memberName),"kwwMember.headUrl": "{}".format(headUrl),"pageName": "kww-member-edit","formName": "editForm","kwwMember.memberId": "{}".format(memberId),"kwwMember.rowKey": "{}".format(rowKey),"memberId": "{}".format(memberId)}
    r = requests.post(url,headers=headers,data=json.dumps(body))
    if r.status_code == 200:
        print('完善信息:',r.json()['msg'])
        global notice_str
        notice_str += '完善信息:'+str(True)+'\n'
    else:
        print('请求失败')

def daily_task():
    task_list()
    article_list()
    do_task()

def task_list():
    url = 'https://member.kwwblcj.com/member/api/list/?userKeys=v1.0&pageName=select-task-list&formName=searchForm&memberId={}'.format(memberId)
    headers = {
        'Connection':'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Referer': 'https://servicewechat.com/wxfb0905b0787971ad/34/page-frame.html',
    }
    r = requests.get(url,headers=headers)
    global completed
    if r.status_code == 200:
        rows = r.json()['rows']
        for row in rows:
            if row['complete'] == '1':
                completed.append({
                    'infoId':row['infoId'],
                    'taskTitle':row['taskTitle']
                    
                    })
            else:
                undone.append({
                    'infoId':row['infoId'],
                    'taskTitle':row['taskTitle']
                    
                })
        
    else:
        print('请求失败')

def do_task():
    print('👉已完成任务...')
    for task in completed:
        print(task['taskTitle'])
    print('👉未完成任务...')
    for task in undone:
        print(task['taskTitle'])
        infoId = task['infoId']
        if infoId == '510595176314437632':
            submit_user_info()
        elif infoId == '510595324054601728':
            sign_task_flag()
        elif infoId == '510595522508095488':
            task_flag()
        elif infoId == '513868258026192896':
            green()
        elif infoId == '510595931184300032':
            read_task()

if __name__ == "__main__":
    get_user_info()
    get_score()
    get_signin_info()
    daily_task()
    notify.send('口味王',notice_str)