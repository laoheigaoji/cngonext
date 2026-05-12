# 城市数据批量生成 - 状态报告

## 启动时间: 2026-05-12 01:28
## 报告时间: 2026-05-12 01:42

## 4路并行运行情况

| 实例 | 城市范围 | 已完成 | 失败 | 最后城市 | 日志文件 |
|------|---------|--------|------|---------|---------|
| 1 | 石家庄~莆田 (76个) | 1 | 0 | 石家庄 | scripts/gen_1.log |
| 2 | 景德镇~株洲 (76个) | 1 | 0 | 湖州 | scripts/gen_2.log |
| 3 | 湘潭~绵阳 (76个) | 1 | 0 | 荆州 | scripts/gen_3.log |
| 4 | 广元~阿勒泰 (74个) | 1 | 0 | 铜仁 | scripts/gen_4.log |

## 查看方式

### 查看总进度
打开各实例进度文件查看已完成城市数量:
- scripts/generate_cities_progress_1.json
- scripts/generate_cities_progress_2.json
- scripts/generate_cities_progress_3.json
- scripts/generate_cities_progress_4.json

### 查看实时日志
```powershell
# 查看所有实例完成数
Get-ChildItem scripts/generate_cities_progress_*.json | ForEach-Object { 
  $p = Get-Content $_ -Raw | ConvertFrom-Json
  Write-Host "$($_.Name): $($p.completed.Count)个完成, $($p.failed.Count)个失败"
}

# 查看某实例日志尾部
Get-Content scripts/gen_1.log -Tail 5

# 查看是否有错误
Get-ChildItem scripts/gen_*_err.log | Where-Object { $_.Length -gt 0 } | ForEach-Object { Write-Host "$($_.Name) 有错误!" }
```

## 生成完成后
所有4个进程结束运行后，可以用以下命令合并进度：
```powershell
$total = 0
$failedCities = @()
for ($i=1; $i -le 4; $i++) {
  $p = Get-Content "scripts/generate_cities_progress_$i.json" -Raw | ConvertFrom-Json
  $total += $p.completed.Count
  $failedCities += $p.failed.name
}
Write-Host "总计完成: $total 个城市"
if ($failedCities.Count -gt 0) { Write-Host "失败城市: $failedCities" }
```
