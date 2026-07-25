# Legal Audit (genérico — cualquier producto)

Audit legal/compliance del producto. Primero leé el código y el landing para
entender: qué hace el producto, qué datos recolecta, qué genera como output,
y en qué mercado se vende. Luego auditá:

## 1. Documentos obligatorios
- ¿Existen páginas de Términos de Servicio y Política de Privacidad?
- ¿Están linkeadas desde el footer y desde el checkout?
- ¿Los términos limitan responsabilidad sobre el output del producto
  y sobre interrupciones del servicio?

## 2. Datos personales
- ¿Qué datos personales recolecta el producto (nombres, cédulas/IDs, emails,
  datos financieros)? Listalos leyendo el código, no los docs
- ¿La política de privacidad cubre TODOS esos datos, para qué se usan,
  cuánto se retienen y cómo pedir borrado?
- Si hay datos de terceros que el usuario ingresa (clientes, vecinos,
  empleados): ¿queda claro que el usuario es responsable de tener permiso?
- Si se mandan datos a APIs externas (LLMs, email, analytics): ¿está declarado?

## 3. Output del producto (crítico si genera documentos, cálculos o consejos)
- Si el output tiene consecuencias legales, financieras, fiscales o médicas:
  ¿hay disclaimer visible de que no constituye asesoría profesional?
- ¿El disclaimer aparece en el output mismo, no solo escondido en los términos?
- Buscá en el landing y la UI claims peligrosos: "garantizado", "100% legal",
  "válido ante cualquier autoridad". Deben decir "conforme a X" o "basado en X",
  nunca garantizar resultados

## 4. Regulación local (si aplica)
- Si el producto cita o implementa una ley/norma específica: ¿las referencias
  (artículos, requisitos) son correctas y están actualizadas? Verificá contra
  la fuente si tenés acceso, o marcalo como "verificar con humano"
- ¿El mercado objetivo tiene requisitos de protección de datos que apliquen
  (GDPR si hay usuarios en la UE, leyes locales de protección de datos)?

## 5. Pagos y facturación
- ¿Queda claro el modelo de cobro (único, recurrente, por uso) antes de pagar?
- ¿Hay política de reembolso declarada?
- Si se usa un Merchant of Record (Lemon Squeezy, Paddle): ¿los términos
  reflejan que ellos son el vendedor registrado?

## Output
Tabla: riesgo | severidad | dónde está | texto o fix sugerido.
Marcá explícitamente qué cosas requieren revisión de un humano/abogado
y no se pueden resolver solo con código.
