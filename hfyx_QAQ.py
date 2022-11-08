# -*- coding: utf-8 -*-
## 需要安装依赖库 requests、pycrypto
import requests,json,time,uuid,hashlib,base64
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
from Crypto.PublicKey import RSA
notice_str = ''
userId = ''

## 汇丰优选 安卓app签到 
## 抓包后找到 X-HSBC-E2E-Trust-Token、X-HSBC-Pinnacle-DeviceNo 填入自己的信息
hfyx_token = ''
hfyx_deviceNo = ''

def get_user_info():
    url = 'https://m.prod.app.hsbcfts.com.cn/api/api/v1/user/userinfo/singleuser'
    headers = {
    'X-HSBC-Global-Channel-Id':'MOBILE_A',
    'X-HSBC-Pinnacle-DeviceNo':'{}'.format(hfyx_deviceNo),
    'charset':'utf-8',
    'Connection':'Keep-Alive',
    'Accept-Encoding':'gzip',
    'User-Agent':'okhttp/4.9.0',
    'X-HSBC-E2E-Trust-Token':'{}'.format(hfyx_token),
    }
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        if r.json()['retCode'] == 10000:
            #print(r.json()['message'])
            print('用户:',r.json()['data']['phone'])
            global userId
            global notice_str
            userId = r.json()['data']['userId']
            notice_str += '用户:'+r.json()['data']['phone']+'\n'
        else:
            print(r.json()['message'])
            
    else:
        print('请求失败')

def get_user_points():
    url = 'https://m.prod.app.hsbcfts.com.cn/api/sapp/biz/pointscenter/pointsindex/v1'
    headers = {
    'X-HSBC-Global-Channel-Id':'MOBILE_A',
    'X-HSBC-Pinnacle-DeviceNo':'{}'.format(hfyx_deviceNo),
    'charset':'utf-8',
    'Connection':'Keep-Alive',
    'Accept-Encoding':'gzip',
    'User-Agent':'okhttp/4.9.0',
    'X-HSBC-E2E-Trust-Token':'{}'.format(hfyx_token),
    }
    r = requests.get(url,headers=headers)

    if r.status_code == 200:
        if r.json()['retCode'] == 10000:
        #print(r.json()['message'])
            print('用户积分:',r.json()['data']['pointBalance'])
            print('今日签到状态:',r.json()['data']['todaySignInStatus'])
            global notice_str
            notice_str += '用户积分:'+r.json()['data']['pointBalance']+'\n'
            notice_str += '今日签到状态:'+str(r.json()['data']['todaySignInStatus'])+'\n'
            if(r.json()['data']['todaySignInStatus'] != True):
                print('开始签到')
                user_sign()
            else:
                print(r.json()['message'])
        else:
            print(r.json()['message'])
    else:
        print('请求失败')

def user_sign():
    #签到
    ts = str(int(time.time() * 1000))
    #print(ts)
    nonce = str(uuid.uuid4()).replace('-', '')[:16]
    #print(nonce)
    _sign = "nonce="+nonce+"&timestamp="+ts+"&userId="+str(userId)+"&version=1.0"
    #print('加密前数据：',_sign)
    sign1 = hashlib.sha256(_sign.encode('utf-8')).hexdigest()
    #print('SHA256结果：',sign1)
    public_key = '''-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDI4QzAHlp/T6mmYMFSRM/M7SNb
    s5PvjpyYNqlp3i7CF6dnYndA2zekm8yBccYHEWEEcgqJDjRm+/GGuPrfHLdgdHH3
    tx+XHTxouZk+MeCdxW+M6sxKXGfDs2y3gvmrsNdnKMywRjqO9QaRBw6fgenl73fY
    yS+S+5y+CbrcyULyYQIDAQAB
    -----END PUBLIC KEY-----
    '''
    cipher = Cipher_pkcs1_v1_5.new(RSA.importKey(public_key))
    cipher_text = base64.b64encode(cipher.encrypt(sign1.encode())).decode()
    #print("Sign数据：",cipher_text)
    data_body = {"nonce":"{}".format(nonce),"sign":"{}".format(cipher_text),"timestamp":"{}".format(ts),"userId":"{}".format(userId),"version":"1.0"}
    #print("body数据：",data_body)
    json_data_body = json.dumps(data_body)
    #print("json数据：",json_data_body)
    url = 'https://m.prod.app.hsbcfts.com.cn/api/sapp/biz/pointscenter/signin/v2'
    headers = {
    'Content-Type': 'application/json',
    'X-HSBC-Global-Channel-Id':'MOBILE_A',
    'X-HSBC-Pinnacle-DeviceNo':'{}'.format(hfyx_deviceNo),
    'charset':'utf-8',
    'Connection':'Keep-Alive',
    'Accept-Encoding':'gzip',
    'User-Agent':'okhttp/4.9.0',
    'X-HSBC-E2E-Trust-Token':'{}'.format(hfyx_token),
    }
    r = requests.post(url,headers=headers,data=json.dumps(data_body))

    if r.status_code == 200:
        if r.json()['retCode'] == 10091:
           print(r.json()['message'])
        elif r.json()['retCode'] == 20004:
           print(r.json()['message'])
        elif r.json()['retCode'] == 10000:
           print('签到结果:',r.json()['data']['signInSuccess'])
           print('获得积分:',r.json()['data']['pointAmount'])
           global notice_str
           notice_str += '签到结果:'+str(r.json()['data']['signInSuccess'])+'\n'
           notice_str += '获得积分:'+str(r.json()['data']['pointAmount'])
        else:
            print(r.json()['message'])
    else:
        print('请求失败')

if __name__ == "__main__":
    get_user_info()
    get_user_points()