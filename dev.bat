@echo off
start cmd.exe /K node test-server
start cmd.exe /K npm run build -- --watch
