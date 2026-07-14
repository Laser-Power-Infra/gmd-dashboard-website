import sqlite3

try:
    conn = sqlite3.connect('c:/Users/Alok Das/Desktop/db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    print("Tables found:", tables)
    
    for table in tables:
        # Search all columns in this table for the word "warranty"
        cursor.execute(f"PRAGMA table_info({table})")
        cols = [c[1] for c in cursor.fetchall()]
        
        # Let's run a query for each text column
        for col in cols:
            try:
                cursor.execute(f"SELECT * FROM {table} WHERE CAST({col} AS TEXT) LIKE '%warranty%' LIMIT 5")
                res = cursor.fetchall()
                if res:
                    print(f"\n--- Matches in table '{table}', column '{col}': ---")
                    for row in res:
                        print(row[:5]) # print first few columns
            except Exception as e:
                pass
except Exception as ex:
    print("Error:", ex)
