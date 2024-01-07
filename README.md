# Nombre del Proyecto

Proyecto Mutual para la validación de componentes técnicos.

## Descripción

Esta aplicación tiene por objetivo validar los componentes técnicos de la solución.

## Comandos para Ejecutar

Instrucciones sobre cómo instalar las dependencias y ejecutar tu aplicación:

```bash
npm install             # Instala las dependencias del proyecto
npm run start-azurite   # Ejecuta un emulador de storage para azure functions
npm start               # Ejecuta la aplicación en modo de desarrollo
```


## Variables de entorno

A continuación se describen las variables de entorno a definir:

```bash
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "APP_serverAddress": "[DATABASE-URL]",
    "APP_DB_USER": "[USER-NAME]",
    "APP_DB_PASS": "[PASSWORD]",
    "APP_DB_NAME": "[DATABASE-NAME]",
    "emailFromNotify": "[EMAIL-ADDRESS-ORIGIN]",
    "emailToNotify": "[EMAIL-ADDRESS-TO]",
    "enviarCorreo": "false",
    "emailProvider": "azure",
    "email_azure_tenantId": "[TENANT-ID]",
    "email_azure_applicationId": "[APP REGISTRATION]",
    "email_azure_secret": "[APP REGISTRATION SECRET]",
    "appWebVersion": "0.0.1",
    "environment": "[DEV|PROD]",
    "rowsForGets": 50,
    "maxRowsForGets": 1000,
    "databaseType": "sql-server",
    "cloudProvider": "azure"
```