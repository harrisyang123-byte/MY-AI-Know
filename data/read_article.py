import sqlite3

conn = sqlite3.connect('/app/data/db.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("""
    SELECT title, publish_time, description, content, content_html
    FROM articles
    WHERE title LIKE '%帮相亲对象贬低自家孩子%'
    LIMIT 1
""")

row = cur.fetchone()
if row:
    print("标题:", row['title'])
    print("摘要:", row['description'])
    print("\n--- content字段 ---")
    print(row['content'][:3000] if row['content'] else '空')
    print("\n--- content_html字段 ---")
    print(row['content_html'][:3000] if row['content_html'] else '空')
else:
    print("未找到")

conn.close()
