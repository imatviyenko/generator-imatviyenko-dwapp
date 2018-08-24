#!/bin/sh
chmod 744 scripts/bin/jq

getConfigValue() {
    echo $(cat scripts/deploy.json | scripts/bin/jq --raw-output $1)
}



localImageName=$(getConfigValue '.dockerImageName')
sslCertSecretName=$(getConfigValue '.sslCertSecretName')
sslCertKeySecretName=$(getConfigValue '.sslCertKeySecretName')
sslCertPemSecretName=$(getConfigValue '.sslCertPemSecretName')
sessionIdHmacSecretSecretName=$(getConfigValue '.sessionIdHmacSecretSecretName')

echo "\n\n**************************************************\n";

echo 'localImageName: ' $localImageName
echo 'sslCertSecretName: ' $sslCertSecretName
echo 'sslCertKeySecretName: ' $sslCertKeySecretName
echo 'sslCertPemSecretName: ' $sslCertPemSecretName
echo 'sessionIdHmacSecretSecretName: ' $sessionIdHmacSecretSecretName


echo "\nChecking if all required files sslcert.cert, sslcert.key and sslcert.pem are present in the config/PROD-SECRETS-SENSITIVE folder ..."
if ! test -f config/PROD-SECRETS-SENSITIVE/sslcert.cert || ! test -f config/PROD-SECRETS-SENSITIVE/sslcert.key || ! test -f config/PROD-SECRETS-SENSITIVE/sslcert.pem; then
    echo "Error: one of the required source files or Docker Swarm secrets is missing in config/prod-secrets folder"
    exit 1
fi

echo "\nGenerating random value for secret sessionIdEncryptionPassword ..."
sessionIdHmacSecret=$(/dev/urandom tr -dc _A-Z-a-z-0-9 | head -c6)
echo "\Creating secret $sessionIdHmacSecretSecretName ..."
echo $sessionIdHmacSecret | docker secret create $sessionIdHmacSecretSecretName -

echo "\nCreating secret $sslCertSecretName ..."
docker secret create $sslCertSecretName config/PROD-SECRETS-SENSITIVE/sslcert.cert

echo "\nCreating secret $sslCertKeySecretName ..."
docker secret create $sslCertKeySecretName config/PROD-SECRETS-SENSITIVE/sslcert.key

echo "\nCreating secret $sslCertPemSecretName ..."
docker secret create $sslCertPemSecretName config/PROD-SECRETS-SENSITIVE/sslcert.pem

echo "Docker Swarm secrets have been created successfully\n";
echo "**************************************************\n\n";
