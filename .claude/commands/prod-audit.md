# Prod Audit (genérico — cualquier stack)

Audit de preparación para producción. Primero detectá el stack del proyecto
y adaptá cada punto a lo que exista.

## 1. Configuración
- Listá todas las variables de entorno que el código usa realmente
  y compará contra .env.example (o equivalente). Reportá faltantes y sobrantes
- ¿Hay valores default peligrosos si falta una variable (ej. modo debug on,
  URL de test, key vacía)? El código debe fallar ruidosamente, no degradar en silencio
- ¿Configs de dev/test hardcodeadas que llegarían a prod (URLs localhost,
  modo sandbox de pagos, feature flags de prueba)?

## 2. Manejo de errores
- ¿Toda llamada a servicios externos (APIs, DB, pagos, email) tiene manejo
  de error y timeout?
- ¿Hay páginas/respuestas de error decentes (404, 500) sin stack traces?
- ¿Errores críticos quedan registrados en algún lado donde los pueda ver
  (logging, Sentry, o al menos logs del host)?

## 3. Operación
- ¿Qué pasa si el proceso se reinicia a mitad de una operación (pago,
  generación de documento, job)? ¿Queda estado corrupto o a medias?
- Operaciones que cuestan plata o mandan cosas (LLM, emails, webhooks):
  ¿son idempotentes o pueden dispararse doble con un retry/doble click?
- ¿Hay algún job/cron/queue que asuma que el proceso vive para siempre?

## 4. Performance mínima
- ¿Queries N+1 o sin índice en las rutas calientes?
- ¿Assets pesados sin optimizar (imágenes, bundles) en las páginas principales?
- ¿Alguna operación síncrona lenta bloqueando requests (generación de PDF,
  llamadas a LLM sin streaming) donde debería haber async/cola?

## 5. Higiene
- console.log / print / Console.WriteLine con data sensible o de debug
- TODOs y FIXMEs marcados como críticos
- Código muerto o rutas de prueba expuestas (/test, /debug, seeds)

## Output
Tabla: hallazgo | severidad | archivo | fix. Los críticos, arreglalos ya
y mostrame el diff. Cerrá con veredicto: LISTO PARA PROD ✅ o NO ❌ con la lista
de bloqueantes.
