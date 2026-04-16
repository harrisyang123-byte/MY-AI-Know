import urllib.request
import urllib.parse
import json
import time
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
resp = urllib.request.urlopen(req)
token = json.loads(resp.read())['data']['access_token']
headers = {'Authorization': f'Bearer {token}'}

# 获取所有无正文的文章ID
conn = sqlite3.connect('/app/data/db.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("SELECT id, title FROM articles WHERE mp_id=? AND (content IS NULL OR content='') ORDER BY publish_time DESC", (mp_id,))
articles = cur.fetchall()
conn.close()

print(f"需要抓取正文: {len(articles)} 篇\n")

for i, art in enumerate(articles):
    try:
        req = urllib.request.Request(
            f'{base_url}/api/v1/wx/articles/{art["id"]}?content=true',
            headers=headers
        )
        resp = urllib.request.urlopen(req, timeout=20)
        data = json.loads(resp.read())
        has = bool(data.get('data', {}).get('content'))
        print(f"[{i+1}/{len(articles)}] {'✓' if has else '?'} {art['title'][:35]}")
    except Exception as e:
        print(f"[{i+1}/{len(articles)}] ✗ {art['title'][:35]} | {e}")
    time.sleep(1.5)

print("\n完成！")
