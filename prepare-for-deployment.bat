@echo off
echo Preparing EcoRoute for deployment...

REM Create a directory for the deployment files
mkdir deployment

REM Update or create .env.production file for the frontend
echo NEXT_PUBLIC_API_URL=https://ecoroute-api.onrender.com/api > frontend\.env.production
echo NEXT_PUBLIC_USE_PROXY=false >> frontend\.env.production

REM Install dependencies and build frontend
cd frontend
echo Installing frontend dependencies...
call npm install
echo Building frontend...
call npm run build
cd ..

REM Install dependencies for backend
cd backend
echo Installing backend dependencies...
call npm install
cd ..

REM Create a ZIP file for the frontend
echo Creating frontend deployment package...
powershell Compress-Archive -Path frontend -DestinationPath deployment\frontend.zip -Force

REM Create a ZIP file for the backend
echo Creating backend deployment package...
powershell Compress-Archive -Path backend -DestinationPath deployment\backend.zip -Force

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