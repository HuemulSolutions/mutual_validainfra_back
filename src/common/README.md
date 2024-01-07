# Huemul BackEnd common
Codigo común para todos los backend.

1. entrar en /functions/src/
2. ejecutar: git submodule add https://github.com/HuemulSolutions/HuemulBackEnd.git common
3. hacer commit
4. para obtener nuevas versiones: git submodule update --remote
5. modificar parametros en global.ts
6. cambiar url de testconnection
7. reemplazar archivos /functions/backend-service-account 
8. reemplazar archivos /functions/google-services
9. ejecutar firebase init (sobre directorio raiz)
10. ejecutar functions/npm install (si falla x internet, npm cache verify y luego npm cache clear --force
11. npm run build
12. firebase emulators:start
13. abrir otra ventana de terminal y ejecutar npm run test
14. firebase deploy --only "functions"
15. firebase deploy --only "firestore:indexes"


git reset --hard
git pull --recurse-submodules


npm run build --> para compilar:
npm run lint -- --fix --quiet   
firebase emulators:start -->  para iniciar emulador


firebase deploy --only "functions"

