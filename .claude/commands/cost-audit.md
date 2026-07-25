# Cost Audit (genérico — cualquier stack)

Audit de costos operativos. El objetivo: que un usuario (o un bot) no pueda
quemarme la plata. Primero identificá TODO lo que cuesta dinero por uso:
llamadas a LLMs, APIs de terceros pagas, envío de emails/SMS, storage,
generación de archivos, bandwidth.

## 1. Superficie de gasto
- Listá cada punto del código que dispara un costo variable, con su
  costo unitario estimado
- Por cada uno: ¿quién puede dispararlo? ¿usuarios anónimos, autenticados,
  solo pagados?

## 2. Protecciones
- ¿Hay rate limiting por usuario/IP en cada endpoint costoso?
- ¿Endpoints costosos accesibles SIN autenticación? (crítico)
- ¿Hay caps duros? (ej. máx N generaciones por usuario/día, máx tokens
  por request)
- ¿Un retry automático o doble click puede duplicar el gasto? ¿Hay idempotencia?

## 3. Eficiencia (si hay LLMs)
- ¿El system prompt manda contexto gigante en cada llamada cuando podría
  usar prompt caching?
- ¿Se usa el modelo más caro donde uno más barato basta (clasificación,
  extracción simple)?
- ¿max_tokens está acotado o puede generar respuestas enormes?
- ¿Hay loops o cadenas de llamadas donde un fallo puede reintentarse
  infinitamente?

## 4. Modelo de negocio
- Calculá: costo variable estimado por unidad de uso vs precio de venta.
  ¿Cuál es el margen bruto por transacción?
- ¿Qué pasa en el peor caso (usuario que usa el máximo permitido)?
  ¿Sigo ganando plata o pierdo?
- ¿Hay alertas de gasto configuradas en los proveedores (Anthropic, Vercel,
  Supabase, email)? Si no, listá cuáles configurar y con qué umbral

## Output
1. Tabla de superficie de gasto: endpoint | costo unitario | quién accede | protección actual
2. Tabla de riesgos: hallazgo | severidad | escenario de pérdida | fix
3. Margen bruto estimado por transacción y veredicto: SOSTENIBLE ✅ / EN RIESGO ❌
Los fixes críticos (endpoints costosos sin auth ni límite), aplicalos ya.
