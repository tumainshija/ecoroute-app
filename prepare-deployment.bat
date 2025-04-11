@echo off
echo Preparing EcoRoute for deployment...

REM Create a directory for the deployment files
mkdir deployment 2>nul

REM Update or create .env.production file for the frontend
echo NEXT_PUBLIC_API_URL=https://ecoroute-api.onrender.com/api > frontend\.env.production
echo NEXT_PUBLIC_USE_PROXY=false >> frontend\.env.production

REM Create the deployment packages using PowerShell
echo Creating frontend deployment package...
powershell -Command "Add-Type -Assembly 'System.IO.Compression.FileSystem'; [System.IO.Compression.ZipFile]::CreateFromDirectory('frontend', 'deployment\frontend.zip')"

echo Creating backend deployment package...
powershell -Command "Add-Type -Assembly 'System.IO.Compression.FileSystem'; [System.IO.Compression.ZipFile]::CreateFromDirectory('backend', 'deployment\backend.zip')"

REM Copy the deployment guide
copy ONLINE_DEPLOYMENT.md deployment\DEPLOYMENT_INSTRUCTIONS.md

echo.
echo =====================================================
echo Deployment preparation complete!
echo.
echo Your deployment packages are in the 'deployment' folder:
echo - frontend.zip: Upload to Vercel
echo - backend.zip: Upload to Render
echo.
echo Follow the instructions in DEPLOYMENT_INSTRUCTIONS.md
echo to complete the online deployment.
echo ===================================================== 