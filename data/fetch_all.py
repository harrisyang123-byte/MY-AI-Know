import sqlite3
import urllib.request
import urllib.parse
import json
import time

base_url = 'http://localhost:8001'

# 登录
login_data = json.dumps({'username': 'admin', 'password': 'we-mp-rss'}).encode()
req = urllib.request.Request(f'{base_url}/api/v1/wx/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
print("登录结果:", json.dumps(result, ensure_ascii=False)[:300])

token = result.get('data', {}).get('token', '')
if not token:
    print("登录失败")
    exit()

headers = {'Authorization': f'Bearer {token}'}

# 获取所有无内容的文章
conn = sqlite3.connect('/app/data/db.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("SELECT id, title, content FROM articles WHERE mp_id='MP_WXS_3710073544' ORDER BY publish_time DESC")
articles = cur.fetchall()
conn.close()

print(f"\n共 {len(articles)} 篇，开始批量抓取正文...")

for i, art in enumerate(articles):
    if art['content']:
        print(f"[{i+1}] 跳过(已有): {art['title'][:25]}")
        continue
    
    try:
        req = urllib.request.Request(
            f'{base_url}/api/v1/wx/article/{art["id"]}/content',
            headers=headers
        )
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read())
        print(f"[{i+1}] OK {art['title'][:25]}")
    except Exception as e:
        print(f"[{i+1}] 失败: {e} | {art['title'][:25]}")
    
    time.sleep(2)

print("\n全部完成！")
