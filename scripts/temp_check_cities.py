import requests
api = 'https://cxegaqhwexiidezycbyg.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8'
h = {'apikey': key, 'Authorization': f'Bearer {key}'}
cities = requests.get(f'{api}/rest/v1/cities?select=id,name,heroImage', headers=h).json()
if isinstance(cities, list):
    ok = sum(1 for c in cities if c.get('heroImage') and 'static.tripcngo.com' in str(c.get('heroImage','')))
    bad = [c for c in cities if not (c.get('heroImage') and 'static.tripcngo.com' in str(c.get('heroImage','')))]
    print(f'城市封面: 共{len(cities)}个, R2:{ok}, 未迁移:{len(bad)}')
    for c in bad:
        print(f'  {c["name"]:8s} | {(c.get("heroImage") or "无图")[:60]}')
else:
    print('API error:', cities)
