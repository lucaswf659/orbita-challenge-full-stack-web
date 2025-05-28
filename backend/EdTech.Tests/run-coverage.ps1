Write-Host '🔍 Rodando testes com cobertura...'
dotnet test --collect:'XPlat Code Coverage'

Write-Host '🧪 Gerando relatório HTML...'
reportgenerator `
  -reports:'TestResults/**/*.xml' `
  -targetdir:'CoverageReport' `
  -reporttypes:Html `
  "-filefilters:-**/Program.cs;-**/Migrations/*;-**/*Snapshot.cs"

Write-Host '🌐 Abrindo no navegador...'
Invoke-Item 'CoverageReport\index.html'
