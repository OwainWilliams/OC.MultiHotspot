@ECHO OFF
:: This file can now be deleted!
:: It was used when setting up the package solution (using https://github.com/LottePitcher/opinionated-package-starter)

:: set up git
git init
git branch -M main
git remote add origin https://github.com/OwainWilliams/OC.HiddenDashboard.git

:: ensure latest Umbraco templates used
dotnet new install Umbraco.Templates --force

:: use the umbraco-extension dotnet template to add the package project
cd src
dotnet new umbraco-extension -n "OC.HiddenDashboard" --site-domain "https://localhost:44307" --include-example

:: replace package .csproj with the one from the template so has nuget info
cd OC.HiddenDashboard
del OC.HiddenDashboard.csproj
ren OC.HiddenDashboard_nuget.csproj OC.HiddenDashboard.csproj

:: add project to solution
cd..
dotnet sln add "OC.HiddenDashboard"

:: add reference to project from test site
dotnet add "OC.HiddenDashboard.TestSite/OC.HiddenDashboard.TestSite.csproj" reference "OC.HiddenDashboard/OC.HiddenDashboard.csproj"
