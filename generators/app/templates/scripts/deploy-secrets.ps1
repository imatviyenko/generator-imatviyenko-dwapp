Set-StrictMode -Version latest;
$ErrorActionPreference = "Stop";

function SetSecretFromStringPrompt($secretName) {
    Read-Host "Please enter the value for secret $secretName" | docker secret create $secretName -
}

function SetSecretFromPasswordPrompt($secretName) {
    $secureString = Read-Host "Please enter the value for secret $secretName" -asSecureString;
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString);
    $plainString = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR);
    $plainString | docker secret create $secretName -
}

# Read config file
$config = Get-Content -Raw -Path scripts\deploy.json | ConvertFrom-Json;

$sslCertSecretName = $($config.sslCertSecretName);
$sslCertKeySecretName = $($config.sslCertKeySecretName);
$sslCertPemSecretName = $($config.sslCertPemSecretName);
$sessionIdHmacSecretSecretName = $($config.sessionIdHmacSecretSecretName);

Write-Output "`n---------------------------";
Write-Output "Checking if all required files sslcert.cert, sslcert.key, sslcert.pem are present in the config/PROD-SECRETS-SENSITIVE folder ...";
$secretSourceFileIsMissing =  
    ( `
        ! (test-Path -Path config\PROD-SECRETS-SENSITIVE\sslcert.cert) `
        -or `
        ! (test-Path -Path config\PROD-SECRETS-SENSITIVE\sslcert.key) `
        -or `
        ! (test-Path -Path config\PROD-SECRETS-SENSITIVE\sslcert.pem) `
    );
if ($secretSourceFileIsMissing) {
    Write-Output "Error: one of the required source files or Docker Swarm secrets is missing in config/prod-secrets folder";
    Exit -1;
}

Write-Output "`n---------------------------";
Write-Output "Generating random value for secret sessionIdHmacSecret";
$sessionIdHmacSecret = [system.web.security.membership]::GeneratePassword(20, 0);
Write-Output "Creating secret $sessionIdHmacSecretSecretName ...";
$sessionIdHmacSecret | docker secret create $sessionIdHmacSecretSecretName -;

Write-Output "`n---------------------------";
Write-Output "Creating secret $sslCertSecretName ...";
docker secret create $sslCertSecretName config\PROD-SECRETS-SENSITIVE\sslcert.cert;

Write-Output "`n---------------------------";
Write-Output "Creating secret $sslCertKeySecretName ...";
docker secret create $sslCertKeySecretName config\PROD-SECRETS-SENSITIVE\sslcert.key;

Write-Output "`n---------------------------";
Write-Output "Creating secret $sslCertPemSecretName ...";
docker secret create $sslCertPemSecretName config\PROD-SECRETS-SENSITIVE\sslcert.pem;

Write-Output "`n---------------------------";
Write-Output "Docker Swarm secrets have been created successfully`n";
Write-Output "**************************************************`n`n";
