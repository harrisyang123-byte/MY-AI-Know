import urllib.request
import urllib.parse
import json
import time

base_url = 'http://localhost:8001'
mp_id = 'MP_WXS_3710073544'

# 登录
form_data = urllib.parse.urlencode({'username': 'admin', 'password': 'admin@123'}).encode()
req = urllib.request.Request(
    f'{base_url}/api/v1/wx/auth/login',
    data=form_data,
    headers={'Content-Type': 'application/x-www-form-urlencoded'}
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
token = result.get('data', {}).get('access_token', '')
print("登录成功，Token:", token[:40])

headers = {'Authorization': f'Bearer {token}'}

# 触发更新（小眼睛对应的接口）
print(f"\n触发抓取公众号文章...")
req = urllib.request.Request(
    f'{base_url}/api/v1/wx/mps/update/{mp_id}',
    headers=headers
)
resp = urllib.request.urlopen(req, timeout=60)
result = json.loads(resp.read())
print("结果:", json.dumps(result, ensure_ascii=False)[:500])
