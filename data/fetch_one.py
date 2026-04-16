import urllib.request
import urllib.parse
import json
import sqlite3

base_url = 'http://localhost:8001'
mp_id = 'MP_WXS_3710073544'

# 登录
form_data = urllib.parse.urlencode({'username': 'admin', 'password': 'admin@123'}).encode()
req = urllib.request.Request(
    f'{base_url}/api/v1/wx/auth/login',
    data=form_data,
    headers={'Content-Type': 'application/x-www-form-urlencoded'}
)
token = json.loads(urllib.request.urlopen(req).read())['data']['access_token']
headers = {'Authorization': f'Bearer {token}'}

# 取第一篇文章ID
conn = sqlite3.connect('/app/data/db.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("SELECT id, title FROM articles WHERE mp_id=? ORDER BY publish_time DESC LIMIT 1", (mp_id,))
art = cur.fetchone()
conn.close()

print(f"文章: {art['title']}")
print(f"ID: {art['id']}")

# 调用接口抓正文
req = urllib.request.Request(
    f'{base_url}/api/v1/wx/articles/{art["id"]}?content=true',
    headers=headers
)
resp = urllib.request.urlopen(req, timeout=30)
data = json.loads(resp.read())
content = data.get('data', {}).get('content', '')
print(f"\n正文长度: {len(content)} 字符")
print(f"\n正文预览:\n{content[:1000]}")
