import sys
sys.path.insert(0, '/app')

from core.database import get_db
from core.models.article import Article
from core.models.feed import Feed
from core.article_content import get_article_content
import sqlite3

mp_id = 'MP_WXS_3710073544'

# 直接读数据库，找没有内容的文章
conn = sqlite3.connect('/app/data/db.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("SELECT id, title, url FROM articles WHERE mp_id=? AND (content IS NULL OR content='') ORDER BY publish_time DESC", (mp_id,))
articles = cur.fetchall()
conn.close()

print(f"需要抓取正文的文章: {len(articles)} 篇")
for a in articles[:5]:
    print(f"  {a['id']} | {a['title'][:30]}")
