# Switch to DeepSeek configuration
Copy-Item ".claude\settings-deepseek.json" ".claude\settings.json" -Force
Write-Host "Switched to DeepSeek!" -ForegroundColor Green
Write-Host "Now run: claude" -ForegroundColor Cyan
