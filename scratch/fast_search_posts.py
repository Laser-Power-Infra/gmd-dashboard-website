import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
if not os.path.exists(sql_path):
    print("SQL backup file does not exist at:", sql_path)
    sys.exit(1)

print("Starting streaming search in wpzm_posts...")

def parse_row_fields(row_str):
    # A simple but correct parser for MySQL row fields
    # row_str looks like: 1, 2, 'content', 'title', ...
    fields = []
    curr = []
    in_str = False
    str_char = None
    esc = False
    
    for c in row_str:
        if esc:
            curr.append(c)
            esc = False
            continue
        if c == '\\':
            curr.append(c)
            esc = True
            continue
        if c in ("'", '"'):
            if not in_str:
                in_str = True
                str_char = c
            elif str_char == c:
                in_str = False
            else:
                curr.append(c)
        elif c == ',' and not in_str:
            fields.append("".join(curr).strip())
            curr = []
        else:
            curr.append(c)
    fields.append("".join(curr).strip())
    return fields

# Let's read the SQL file line-by-line
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line_num, line in enumerate(f, 1):
        if not line.strip():
            continue
        
        # Check if this line is an insert into wpzm_posts
        if 'INSERT INTO `wpzm_posts` VALUES' in line:
            print(f"Found wpzm_posts insert on line {line_num}")
            
            # Find the starting point of the values
            start_idx = line.find('VALUES') + 6
            # Extract the values part, strip the trailing semicolon/newline
            vals_part = line[start_idx:].strip()
            if vals_part.endswith(';'):
                vals_part = vals_part[:-1]
            
            # Now, we need to split by ),( but be careful of quotes.
            # Since a row is enclosed in (...) and rows are separated by ,
            # We can parse the string character by character to split into rows
            pos = 0
            bracket_level = 0
            in_string = False
            string_char = None
            esc = False
            curr_row = []
            
            while pos < len(vals_part):
                c = vals_part[pos]
                if esc:
                    curr_row.append(c)
                    esc = False
                    pos += 1
                    continue
                if c == '\\':
                    curr_row.append(c)
                    esc = True
                    pos += 1
                    continue
                if c in ("'", '"'):
                    curr_row.append(c)
                    if not in_string:
                        in_string = True
                        string_char = c
                    elif string_char == c:
                        in_string = False
                    pos += 1
                    continue
                
                if not in_string:
                    if c == '(':
                        bracket_level += 1
                        if bracket_level == 1:
                            # Start of a new row, clear list
                            curr_row = []
                        else:
                            curr_row.append(c)
                    elif c == ')':
                        bracket_level -= 1
                        if bracket_level == 0:
                            # End of a row
                            row_str = "".join(curr_row).strip()
                            # Process row
                            if 'warranty' in row_str.lower():
                                fields = parse_row_fields(row_str)
                                if len(fields) > 5:
                                    # Just print first 15 fields to inspect
                                    print(f"\n[ROW CONTAINS WARRANTY] len={len(fields)}")
                                    for idx, fld in enumerate(fields[:15]):
                                        val = fld[:100] # truncate long fields
                                        print(f"  {idx}: {val}")
                                    print("-" * 50)
                        else:
                            curr_row.append(c)
                    elif c == ',':
                        if bracket_level > 0:
                            curr_row.append(c)
                    else:
                        curr_row.append(c)
                else:
                    curr_row.append(c)
                pos += 1
print("Scan complete.")
