# Start LiteLLM proxy
Write-Host "Starting LiteLLM Proxy on http://localhost:4000" -ForegroundColor Cyan
Write-Host "Available models:" -ForegroundColor Green
Write-Host "  - /model deepseek-chat"
Write-Host "  - /model deepseek-reasoner (default)"
Write-Host "  - /model minimax"
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor DarkGray
Write-Host ""

# Start proxy
litellm --config litellm-config.yaml --port 4000
