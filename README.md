# Alphyz (Monorepo)

Frontend (React) + Backend (Spring Boot + MongoDB). Pronto para desenvolvimento local e clonagem pela equipe.

## Estrutura
```
.
├─ alphyz-backend/        # API Spring Boot
│  ├─ mvnw, mvnw.cmd      # Maven Wrapper (commit esses arquivos!)
│  └─ .mvn/wrapper/       # Maven Wrapper (commit essa pasta!)
└─ alphyz-frontend/       # React App
```

> **Importante:** Não comite segredos. Use variáveis de ambiente (veja `.env.example`).

---

## Pré-requisitos

- **Java JDK 21+** (Temurin 21 ou 25 LTS funcionam)
- **Maven Wrapper** já incluso (`./mvnw` / `mvnw.cmd`) – não precisa ter Maven global
- **Node.js 18+** (LTS) e **npm**
- **MongoDB Atlas** (ou Mongo local) – use a `SPRING_DATA_MONGODB_URI`

---

## Backend (Spring Boot)

**Variáveis de ambiente necessárias**

- `SPRING_DATA_MONGODB_URI` – URI do Mongo Atlas (ou mongo local, ex. `mongodb://localhost:27017/alphyz`)
- `JWT_SECRET` – uma string longa e secreta (≥ 32 chars)
- `FRONTEND_ORIGINS` – origens permitidas no CORS (ex.: `http://localhost:3000,https://seu-front.vercel.app`)

Você pode exportar no terminal **(Windows PowerShell)**:
```powershell
$env:SPRING_DATA_MONGODB_URI = "mongodb+srv://USER:SENHA@CLUSTER/DB?retryWrites=true&w=majority"
$env:JWT_SECRET = "coloque-um-segredo-bem-grande-32+"
$env:FRONTEND_ORIGINS = "http://localhost:3000"
```

**Rodar localmente**
```powershell
cd alphyz-backend
.\mvnw.cmd clean spring-boot:run
```
A API sobe em `http://localhost:8080`.

**Build JAR (opcional)**
```powershell
cd alphyz-backend
.\mvnw.cmd -DskipTests package
java -jar target/*.jar
```

**Healthcheck & testes rápidos**
```powershell
# health
curl http://localhost:8080/api/health

# cadastro
curl -Method POST http://localhost:8080/api/cadastros `
  -Headers @{ "Content-Type"="application/json" } `
  -Body '{ "nome":"Teste", "telefone":"11999999999", "cep":"03673000", "rua":"Rua X", "numero":"123", "complemento":"", "cpf":"12345678901", "email":"teste@teste.com", "senha":"abc123" }'

# login
curl -Method POST http://localhost:8080/api/auth/login `
  -Headers @{ "Content-Type"="application/json" } `
  -Body '{ "email":"teste@teste.com", "senha":"abc123" }'
```

---

## Frontend (React)

**Variáveis de ambiente** (crie `alphyz-frontend/.env` baseado no exemplo):
```
REACT_APP_API_URL=http://localhost:8080
```

**Rodar localmente**
```powershell
cd alphyz-frontend
npm install
npm start
```

**Build de produção**
```powershell
cd alphyz-frontend
npm run build
```

**Fluxo configurado**
- **Cadastro** → redireciona para `/login`
- **Login** → redireciona para `/shopping`
- Página **Shopping**: topo com links **LOGIN** → `/login` e **CADASTRE-SE** → `/cadastro`

---

## Dicas de segurança & higiene

- **NÃO** comite `application.properties` com credenciais.
- Garanta que `mvnw`, `mvnw.cmd` e a pasta `.mvn/wrapper/` estejam **no commit** (evita exigir Maven global).
- Se a senha do Atlas apareceu nos logs/prints, **rotacione** no Atlas.

---

## Deploy (resumo)

**Backend (ex.: Render.com)**
- Build: `./mvnw -DskipTests package`
- Start: `java -jar target/*.jar`
- Env Vars: `SPRING_DATA_MONGODB_URI`, `JWT_SECRET`, `FRONTEND_ORIGINS`
- Liberar IP do provedor no Mongo Atlas (ou 0.0.0.0/0 para testes).

**Frontend (ex.: Vercel)**
- `REACT_APP_API_URL=https://SEU-BACK-END/render.app`

---

## Postman

Coleção básica em `alphyz-api.postman_collection.json` com:
- `POST /api/cadastros`
- `POST /api/auth/login`
- `GET  /api/health`
