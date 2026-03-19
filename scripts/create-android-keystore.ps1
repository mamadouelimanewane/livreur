param(
    [string]$OutputPath = "android-release.keystore",
    [string]$Alias = "livigo",
    [string]$StorePassword,
    [string]$KeyPassword,
    [string]$DName = "CN=LiviGo, OU=Mobile, O=LiviGo, L=Casablanca, S=Casablanca-Settat, C=MA",
    [int]$ValidityDays = 3650
)

if (-not $StorePassword) {
    throw "StorePassword is required."
}

if (-not $KeyPassword) {
    throw "KeyPassword is required."
}

$resolvedOutput = Resolve-Path -LiteralPath "." | ForEach-Object {
    Join-Path $_.Path $OutputPath
}

& keytool `
    -genkeypair `
    -v `
    -storetype PKCS12 `
    -keystore $resolvedOutput `
    -alias $Alias `
    -keyalg RSA `
    -keysize 2048 `
    -validity $ValidityDays `
    -storepass $StorePassword `
    -keypass $KeyPassword `
    -dname $DName

if ($LASTEXITCODE -ne 0) {
    throw "keytool failed with exit code $LASTEXITCODE."
}

Write-Host "Keystore created at: $resolvedOutput"
Write-Host "Alias: $Alias"
