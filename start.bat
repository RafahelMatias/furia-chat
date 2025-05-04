@echo off
REM ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
REM  start.bat  — Inicia o ambiente de desenvolvimento do FURIA Chat
REM  Coloque este arquivo na pasta raiz do projeto (ao lado de package.json)
REM ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

REM Muda para o diretório onde este script está
cd /d "%~dp0"

REM Verifica se já instalou as dependências
if not exist node_modules (
    echo Instalando dependências...
    npm install
) else (
    echo Dependências já instaladas, pulando npm install.
)

echo.
echo Iniciando servidor de desenvolvimento Next.js...
npm run dev

pause
