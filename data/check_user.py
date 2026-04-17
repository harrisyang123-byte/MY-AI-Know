import sqlite3
conn = sqlite3.connect('/app/data/db.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("SELECT * FROM users")
for r in cur.fetchall():
    print(dict(r))
conn.close()
