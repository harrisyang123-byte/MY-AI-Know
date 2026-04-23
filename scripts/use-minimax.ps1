# Switch to MiniMax configuration
Copy-Item ".claude\settings-minimax.json" ".claude\settings.json" -Force
Write-Host "Switched to MiniMax!" -ForegroundColor Green
Write-Host "Now run: claude" -ForegroundColor Cyan
