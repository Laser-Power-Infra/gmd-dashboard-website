import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\Alok Das\.gemini\antigravity\brain\47c6052a-36fc-45ce-914b-1ad54976f6f2\.system_generated\logs\transcript.jsonl"

try:
    print("Reading conversation transcript...")
    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    print(f"Total steps logged: {len(lines)}")
    
    # Print the last 15 user messages
    user_msgs = []
    for line in lines:
        try:
            step = json.loads(line)
            if step.get("source") == "USER_EXPLICIT" or step.get("type") == "USER_INPUT":
                user_msgs.append(step)
        except Exception as e:
            pass
            
    print(f"\nLast {min(len(user_msgs), 15)} user messages:")
    for idx, msg in enumerate(user_msgs[-15:]):
        print(f"[{idx+1}] Content: {msg.get('content')}")
        
except Exception as e:
    print("Error:", e)
