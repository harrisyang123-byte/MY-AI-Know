import sqlite3, json

conn = sqlite3.connect('/app/data/db.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# 查feeds表结构
cur.execute("PRAGMA table_info(feeds)")
print("feeds表字段:", [r['name'] for r in cur.fetchall()])

# 查feeds内容
cur.execute("SELECT * FROM feeds LIMIT 20")
feeds = cur.fetchall()
print("\n订阅的公众号:")
for f in feeds:
    print(dict(f))

# 查文章数量
cur.execute("SELECT COUNT(*) as cnt FROM articles")
print(f"\n总文章数: {cur.fetchone()['cnt']}")

# 查文章表结构
cur.execute("PRAGMA table_info(articles)")
print("\narticles表字段:", [r['name'] for r in cur.fetchall()])

conn.close()
