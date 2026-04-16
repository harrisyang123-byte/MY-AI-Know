import sqlite3, json
from datetime import datetime

conn = sqlite3.connect('/app/data/db.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("""
    SELECT title, description, publish_time, content
    FROM articles
    WHERE mp_id = 'MP_WXS_3710073544'
    ORDER BY publish_time DESC
""")

articles = []
for row in cur.fetchall():
    ts = row['publish_time']
    date = datetime.fromtimestamp(ts).strftime('%Y-%m-%d') if ts else ''
    # content可能是html，取description作摘要
    articles.append({
        'date': date,
        'title': row['title'],
        'summary': row['description'] or '',
        'has_content': bool(row['content'])
    })

conn.close()

with open('/app/data/articles_export.json', 'w', encoding='utf-8') as f:
    json.dump(articles, f, ensure_ascii=False, indent=2)

print(f"导出 {len(articles)} 篇文章")
for a in articles:
    print(f"[{a['date']}] {a['title']}")
