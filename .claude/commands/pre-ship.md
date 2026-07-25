# Pre-Ship (orquestador — correr el día del launch)

Checklist final antes de producción. Ejecutá EN ORDEN. Si un paso crítico
falla, detenete, arreglalo, y volvé a empezar desde ese paso.

## 0. Detectar stack
Identificá el proyecto: framework, comandos de build/test, proveedor de deploy,
proveedor de pagos. Adaptá los pasos siguientes.

## 1. Build limpio
Corré el build de producción (npm run build, dotnet publish -c Release,
o el que aplique). Cero errores. Warnings: listalos y decidí cuáles importan.

## 2. Tests
Si hay tests, corrélos todos. Si NO hay tests, escribí al menos smoke tests
del flujo crítico (el camino que genera plata: signup → uso → pago) y corrélos.

## 3. Audits
Ejecutá las instrucciones de estos comandos en orden:
1. security-audit.md — cero críticos para avanzar
2. cost-audit.md — cero críticos para avanzar
3. prod-audit.md — cero críticos para avanzar
4. legal-audit.md — documentos y disclaimers en su lugar

## 4. Flujo de pago end-to-end
En modo test/sandbox del proveedor de pagos: compra completa, webhook recibido,
estado actualizado en DB, acceso otorgado. Y el camino triste: pago fallido,
webhook duplicado, usuario que paga dos veces.

## 5. Revisión manual mínima
- Abrí la app como usuario nuevo en incógnito: ¿el flujo principal funciona
  de punta a punta?
- ¿404 y 500 se ven decentes?
- ¿Meta tags / OG image para cuando se comparta el link en redes?
- ¿Analytics instalado y funcionando? (sin datos no hay building in public)

## 6. Rollback
- ¿Sé cómo revertir el deploy en menos de 5 minutos?
- ¿Hay backup reciente de la DB o snapshot antes del launch?

## Output final
Reporte con cada paso: ✅ / ❌ / ⚠️. Veredicto final:
LISTO PARA SHIP 🚀 o BLOQUEADO ❌ con la lista exacta de pendientes ordenada
por severidad.
