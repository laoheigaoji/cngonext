# 监控所有生成实例的进度
param([int]$Interval = 120)

$scriptsDir = "c:\迅雷下载\2222\scripts"
$startTime = Get-Date

Write-Output "=============================================="
Write-Output "城市数据生成监控 - 启动时间: $($startTime.ToString('HH:mm:ss'))"
Write-Output "检查间隔: ${Interval}秒"
Write-Output "=============================================="

while ($true) {
  $now = Get-Date
  $elapsed = [math]::Round(($now - $startTime).TotalMinutes, 1)
  
  # 检查node进程
  $nodeCount = (Get-Process node -ErrorAction SilentlyContinue).Count
  
  # 收集所有实例进度
  $totalCompleted = 0
  $totalFailed = 0
  $instanceInfo = @()
  
  for ($i=1; $i -le 4; $i++) {
    $pf = "$scriptsDir\generate_cities_progress_$i.json"
    if (Test-Path $pf) {
      try {
        $content = Get-Content $pf -Raw -Encoding UTF8 | ConvertFrom-Json
        $c = $content.completed.Count
        $f = $content.failed.Count
        $totalCompleted += $c
        $totalFailed += $f
        $instanceInfo += "实例$i: ${c}成功/${f}失败"
      } catch { $instanceInfo += "实例$i: 读取失败" }
    } else {
      $instanceInfo += "实例$i: 加载中..."
    }
  }
  
  $statusColor = if ($totalCompleted -gt 0) { "✅" } elseif ($nodeCount -eq 0) { "❌" } else { "⏳" }
  
  Write-Output "`n[$($now.ToString('HH:mm:ss'))] 已运行${elapsed}分钟 | Node进程: $nodeCount | 总计: ${totalCompleted}成功/${totalFailed}失败"
  $instanceInfo | ForEach-Object { Write-Output "  $_" }
  
  # 检查是否全部完成
  if ($nodeCount -eq 0 -and $totalCompleted + $totalFailed -gt 0) {
    Write-Output "`n🎉 所有实例已完成！总计: ${totalCompleted}个城市成功, ${totalFailed}个失败"
    break
  }
  
  if ($nodeCount -eq 0) {
    Write-Output "`n⚠️ 无运行中的Node进程，检查日志..."
    break
  }
  
  Start-Sleep -Seconds $Interval
}
