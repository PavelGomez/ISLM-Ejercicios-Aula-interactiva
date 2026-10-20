# IS–LM · Del mecanismo al resultado

**[Abrir el aula interactiva](https://pavelgomez.github.io/ISLM-Ejercicios-Aula-interactiva/)** · **[Descargar para usar sin conexión](https://github.com/PavelGomez/ISLM-Ejercicios-Aula-interactiva/releases/latest/download/ISLM_Ejercicios_Aula_alumnos.zip)**

Tercera plataforma de Macroeconomía I del profesor Pável Gómez Valera, Universidad Finis Terrae. Presentación narrada de ocho capítulos y 28 diapositivas, siete ejercicios conectados y laboratorio complementario. Voz sintética en español: Kokoro-82M, em_alex; 25 minutos y 26 segundos. Sin cuenta de ChatGPT ni registro.

## Para estudiar

1. Abre el aula y pulsa «Escuchar». Elige un capítulo y ajusta la velocidad si lo necesitas.
2. Predice antes de revelar el resultado. Puedes retroceder o adelantar diez segundos y cambiar de diapositiva.
3. Consulta figuras, glosario o ejercicios: el audio se pausa y conserva el instante.
4. Explora el laboratorio después del desarrollo. Cada shock se compara con su base; la acumulación requiere selección explícita.
5. Para trabajar sin internet, descarga el ZIP, descomprímelo y abre `index.html`. Conserva todas las carpetas.

- [Guía de uso](docs/guia_estudiante.html).
- [Guion y transcripción](docs/guion_presentacion.html).
- [Ocho escenarios: tablas](data/escenarios.html), [CSV](data/escenarios.csv) y [JSON](data/escenarios.json).
- [Memoria docente: calibración, derivaciones, soluciones y límites](docs/memoria_docente.html).
- [Verificaciones y alcance](docs/verificacion.html).

## Modelo y alcance

Oferta real de dinero: M/P. Demanda real: Md = d1Y − d2i = kY − hi, con d1 = k > 0 y d2 = h > 0. Equilibrio: M/P = Md.

Consumo: C = c0 + c1(Y − T) con impuestos netos fijos, o C = c0 + c1(Y − tY) con proporcionales. Inversión: I = b0 + b1Y − b2i, con los tres coeficientes mayores que cero. i = 5 significa 5 %.

Economía cerrada, precios fijos y capacidad ociosa. Son calibraciones didácticas, no estimaciones de Chile. Los perfiles de inversión son economías alternativas y no se agregan como sectores. Los ahorros, identidades y límites del modelo se explican en cada ejercicio.

## Continuidad del curso

- [IS–LM: dos mercados, dos velocidades](https://pavelgomez.github.io/ISLM-Aula-interactiva/).
- [IS–LM frente a Chile: 2016–2026](https://pavelgomez.github.io/ISLM-Chile-Aula-interactiva/).
- [Esta cadena de ejercicios](https://pavelgomez.github.io/ISLM-Ejercicios-Aula-interactiva/).

## Verificación y mantenimiento

El sitio usa HTML, CSS, JavaScript y MP3 locales, sin recursos remotos necesarios para aprender. `assets/engine.js` es el único motor para resultados, gráficos y cuentas. `SHA256SUMS.txt` permite comprobar los archivos de esta versión.

Con Node.js y Python 3:

```sh
npm test
python3 tests/serve.py
```

Las pruebas de navegador son opcionales: instala las dependencias de desarrollo con `npm install`, instala Chromium con `npx playwright install chromium` y, con la vista previa en otro terminal, ejecuta `npm run test:browser`. También puedes indicar `ISLM_SITE_URL` para comprobar el sitio alojado. No necesitas estas herramientas para usar el aula.

GitHub Pages publica la raíz de la rama `main`. Las actualizaciones se verifican antes de subirlas. El audio ya está incluido; su regeneración utiliza dependencias y modelos separados, descritos en [production/README.md](production/README.md).

Conceptualización y dirección: profesor Pável Gómez Valera. Desarrollo con asistencia de IA bajo su dirección conceptual y editorial. Las pruebas automáticas y visuales no sustituyen una evaluación de aprendizaje ni pruebas en teléfonos físicos.
