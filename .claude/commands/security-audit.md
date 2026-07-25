# Security Audit (genérico — cualquier stack)

Hacé un audit de seguridad completo de este proyecto.

## Paso 0 — Detectar el stack
Antes de auditar, identificá qué usa el proyecto (leé package.json, .csproj,
requirements.txt, docker-compose, etc.): framework, base de datos, proveedor
de auth, proveedor de pagos, APIs externas. Adaptá el audit a lo que encontrés.

## 1. Secrets y credenciales
- Buscá API keys, tokens, connection strings o passwords hardcodeados
  en código, configs, scripts y archivos de CI
- Verificá que los archivos de entorno (.env*, appsettings.*.json, secrets.*)
  estén en .gitignore
- Revisá el historial reciente de git por secrets commiteados por accidente
- Confirmá que ninguna key privada/server-side se use en código que corre
  en el cliente (browser, app móvil)

## 2. Base de datos
- Si hay Supabase/Postgres con RLS: verificá que TODAS las tablas tengan
  RLS habilitado y que las policies no permitan leer/escribir datos de otro usuario
- Si hay SQL directo: buscá concatenación de strings en queries (SQL injection);
  todo debe ser parametrizado
- Verificá que las credenciales de DB con más privilegios no se usen
  donde basta un rol restringido

## 3. Endpoints / API
- Cada endpoint que muta datos o cuesta plata: ¿valida auth ANTES de ejecutar?
- ¿Valida y sanitiza inputs (zod, FluentValidation, o equivalente)?
- ¿Hay rate limiting en endpoints costosos (LLM, email, generación de archivos)?
- ¿Los errores devuelven mensajes genéricos al cliente (sin stack traces
  ni detalles internos)?

## 4. Pagos (si aplica)
- Webhooks de pago: ¿verifican la firma del proveedor?
- El estado "pagado"/"activo": ¿solo se puede setear desde el webhook
  verificado, nunca desde el cliente?
- ¿Los precios/montos se definen server-side, nunca vienen del cliente?

## 5. Dependencias
- Corré el audit de dependencias del ecosistema (npm audit, dotnet list
  package --vulnerable, pip-audit) y reportá vulnerabilidades altas/críticas

## Output
Tabla: hallazgo | severidad (crítico / alto / medio / bajo) | archivo:línea | fix propuesto.
Los CRÍTICOS arreglalos de inmediato y mostrame el diff. No avances a otra
cosa hasta que no quede ningún crítico.
