'use strict';
const fs=require('fs'),path=require('path'),E=require('../assets/engine.js');const root=path.resolve(__dirname,'..');
function words(n,dec=2){const small=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];function int(x){if(x<30)return small[x];if(x<100)return ['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'][Math.floor(x/10)]+(x%10?' y '+small[x%10]:'');if(x===100)return 'cien';if(x<1000)return ['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'][Math.floor(x/100)]+(x%100?' '+int(x%100):'');return (Math.floor(x/1000)===1?'mil':int(Math.floor(x/1000))+' mil')+(x%1000?' '+int(x%1000):'');}let s=Math.abs(n).toFixed(dec).replace(/0+$/,'').replace(/\.$/,'');if(dec===0)s=Math.round(Math.abs(n)).toString();const [a,b]=s.split('.');return (n<0?'menos ':'')+int(+a)+(b?' coma '+(b[0]==='0'||b.length>2?b.split('').map(x=>small[+x]).join(' '):int(+b)):'');}
const py=E.base(),mi=E.base('minera'),pyT=E.base('pyme','proportional'),miT=E.base('minera','proportional'),F=E.compare(py,E.shock(py,'G',60)),FT=E.compare(pyT,E.shock(pyT,'G',60)),FM=E.compare(mi,E.shock(mi,'G',60)),FMT=E.compare(miT,E.shock(miT,'G',60)),MON=E.compare(py,E.shock(py,'m',40));
const chapters=[['base','Cómo estudiar y desde dónde partimos','inicio'],['lm','Cómo nace LM','lm'],['is','Cómo nace IS','is'],['impuestos','Impuestos y estabilización','impuestos'],['equilibrio','Resolver y cerrar las cuentas','equilibrio'],['politicas','Instrumentos y multiplicadores','politicas'],['inversion','Desplazamiento e inversión','inversion'],['sintesis','Comparar y discutir','sintesis']];
const scenes=[];function add(chapter,key,title,subtitle,paragraphs,options={}){scenes.push({id:scenes.length+1,chapter,key,title,subtitle,paragraphs,...options});}
add(0,'welcome','Dos mercados, una cadena de ejercicios','Predice, construye y comprueba antes de recomendar.',[
'Bienvenidas y bienvenidos. Esta clase conserva la forma de trabajo de las aulas anteriores. Puedes escuchar por capítulos, adelantar o retroceder diapositivas, cambiar la velocidad y detenerte para explorar. La reproducción comienza solo cuando pulses Escuchar.',
'La presentación es el hilo principal. Los ejercicios desarrollados y el laboratorio la complementan. Al salir para practicar, el audio se pausa. Cuando regreses, conservarás la diapositiva y el instante. El glosario también pausa la narración.',
'La pregunta que nos acompañará es esta: ¿puede subir la tasa de interés y también la inversión? Responderemos construyendo un modelo y contrastando dos economías alternativas. Las cifras son calibraciones didácticas; no son estimaciones de Chile.'
]);
add(0,'map','Las decisiones se conectan en Y e i','Bienes y dinero deben compartir el mismo producto y la misma tasa.',[
'Los hogares reciben ingreso, pagan impuestos y eligen consumo y ahorro privado. Las empresas deciden inversión considerando el nivel de actividad y la tasa de interés. El gobierno compra bienes y recauda impuestos.',
'En el mercado de bienes buscamos que el gasto planeado coincida con la producción. Esa condición construye la curva i ese. Quienes mantienen dinero demandan liquidez para transacciones y la comparan con el rendimiento de otros activos. La igualdad entre oferta y demanda real de dinero construye ele eme.',
'Las curvas se encuentran en un mismo producto, ye, y una misma tasa, i. Las flechas del mapa expresan relaciones del modelo. No establecen por sí solas una trayectoria temporal de ajuste.'
]);
add(0,'units','Cinco significa cinco por ciento','Un punto porcentual no es lo mismo que un aumento relativo de 1 %.',[
'Fijemos las unidades antes de operar. Producto, consumo, inversión, gasto público, impuestos y ahorro son flujos reales por período. La oferta nominal de dinero es un stock. El precio es la cantidad de dinero nominal que cuesta una unidad real. Dividir dinero por precios entrega saldos reales.',
'En todas las ecuaciones, i igual a cinco significa cinco por ciento. Pasar de cinco a seis representa un punto porcentual adicional. No escribimos cero coma cero cinco. Los coeficientes de tasa están calibrados con esta convención.',
'El modelo supone economía cerrada, precios fijos y capacidad ociosa. Conservamos constantes las expectativas de inflación y las brechas entre tasas relevantes. Todavía no podemos concluir nada sobre inflación, bienestar, empleo o sostenibilidad de deuda.'
]);
add(0,'calibration','Cuatro casos comparten el mismo equilibrio inicial','Los interceptos permiten comparar sensibilidades desde una base común.',[
'La base está comprobada. El producto es mil doscientos y la tasa es cinco por ciento. Los impuestos son doscientos cuarenta, tanto con impuestos fijos como con una tasa proporcional de veinte por ciento. El ingreso disponible es novecientos sesenta.',
'El consumo es sesenta más cero coma sesenta y cinco por novecientos sesenta: seiscientos ochenta y cuatro. Cada perfil tiene inversión de doscientos setenta y seis. Al sumar doscientos cuarenta de gasto público obtenemos mil doscientos.',
'El dinero nominal es ochocientos y el precio es dos: la oferta real es cuatrocientos. La demanda real, eme superíndice de, es cero coma cuarenta por mil doscientos, menos dieciséis por cinco. También da cuatrocientos. Los interceptos de inversión, doscientos setenta y treinta y dos, fueron elegidos para conservar esta referencia. No sumamos ambos perfiles como si fueran sectores de una economía.'
]);
add(1,'money','Más ingreso aumenta la demanda de dinero','La tasa mayor compensa ese aumento cuando M/P permanece fijo.',[
'Partimos del mercado de dinero. La oferta real se escribe eme dividido por pe: eme es la oferta nominal y pe es el precio por unidad real. La demanda real se escribe eme superíndice de, donde de significa demanda. Es igual a de sub uno por ye menos de sub dos por i; de manera equivalente, ka por ye menos hache por i. Ye es el ingreso e i es la tasa de interés. De sub uno y ka nombran el mismo coeficiente positivo: cuánto aumenta la demanda real al subir el ingreso en una unidad. De sub dos y hache nombran el mismo coeficiente positivo: cuánto cae esa demanda al aumentar la tasa en un punto porcentual. Usaremos ka y hache en los cálculos. El equilibrio exige que eme dividido por pe sea igual a la demanda real.',
'Mantengamos los saldos reales en cuatrocientos. Si aumenta el ingreso, las personas desean más dinero para transacciones. A la tasa inicial aparece exceso de demanda de dinero. Una tasa mayor aumenta el costo de oportunidad de mantener liquidez y reduce su demanda hasta igualar la oferta.',
'No confundas este dinero con gasto del período. Estamos igualando dos stocks reales: la cantidad ofrecida y la cantidad deseada.'
]);
add(1,'lm-build','Tres equilibrios monetarios construyen una LM','Los puntos conservan su tasa al pasar de un gráfico al otro.',[
'Despejemos la tasa. Hache por i es igual a ka por ye menos eme dividido por pe. Al dividir por hache queda i igual a menos saldos reales, dividido por hache, más ka dividido por hache, por ye.',
'Con nuestra calibración, i es igual a menos veinticinco más cero coma cero dos cinco por ye. Para un ingreso de mil cuarenta, la tasa es uno por ciento. Para mil doscientos, es cinco. Para mil trescientos sesenta, es nueve.',
'En el panel de dinero hay una demanda distinta para cada ingreso y una misma oferta vertical. Trasladamos los pares de ingreso y tasa al segundo panel. Los tres puntos recorren una sola ele eme. La pendiente positiva es ka dividido por hache. No hemos desplazado la oferta monetaria.'
]);
add(1,'lm-shift','Cambiar la oferta real desplaza LM','Cambiar Y recorre la curva; cambiar parámetros modifica su posición o pendiente.',[
'Ahora conserva los demás parámetros y aumenta el dinero nominal de ochocientos a ochocientos ochenta. Con el precio en dos, los saldos reales aumentan de cuatrocientos a cuatrocientos cuarenta. A cada ingreso, la tasa compatible con dinero es menor: ele eme se desplaza hacia abajo y a la derecha.',
'Un aumento del precio con dinero nominal fijo reduce los saldos reales y tiene el efecto opuesto. Aumentar ka la hace más inclinada. Aumentar hache cambia la pendiente y el intercepto; no es un desplazamiento paralelo.',
'La comparación de precios es entre escenarios de precios dados. No representa una trayectoria de inflación. En el laboratorio puedes reproducir cada cambio de manera aislada.'
]);
add(2,'goods','El gasto planeado debe coincidir con la producción','La inversión permanece completa: responde a Y y a i.',[
'Pasamos al mercado de bienes. Con impuestos netos fijos, el consumo es ce sub cero más ce sub uno por ye menos te mayúscula, entre paréntesis. Te mayúscula es el monto fijo de impuestos netos. Con impuestos proporcionales, el consumo es ce sub cero más ce sub uno por ye menos te minúscula por ye, entre paréntesis. Te minúscula es la tasa tributaria y te por ye es la recaudación. Ce sub cero es consumo autónomo y es positivo; ce sub uno es la propensión marginal a consumir y está entre cero y uno. La inversión es be sub cero más be sub uno por ye, menos be sub dos por i. Todos sus coeficientes son mayores que cero.',
'Be sub cero es la inversión autónoma. Be sub uno representa inversión inducida por una unidad adicional del nivel de ingreso. Be sub dos mide cuánto se reduce la inversión por cada punto porcentual adicional de la tasa. Los tres coeficientes son positivos en ambos perfiles. El signo negativo del canal de tasa aparece en la función, delante de be sub dos.',
'En equilibrio, ye es igual a consumo más inversión planeada más gasto público. La contabilidad realizada incluye inventarios, pero aquí buscamos que no se acumulen inventarios involuntarios. Esa distinción permite pasar de una identidad contable a una condición de equilibrio de los planes.'
]);
add(2,'is-algebra','Reunir los términos de Y permite despejar IS','A reúne gasto autónomo; a recoge la parte no inducida de cada ronda.',[
'Sustituye las funciones en la condición de bienes. Esta diapositiva usa impuestos fijos: el consumo queda ce sub cero más ce sub uno por ye menos te mayúscula, entre paréntesis. Añadimos la inversión completa y el gasto público. Te se mantiene en doscientos cuarenta.',
'Distribuye la propensión a consumir y agrupa. Con impuestos fijos, a mayúscula es ce sub cero menos ce sub uno por te mayúscula, más be sub cero, más ge. A minúscula es uno menos ce sub uno menos be sub uno. Con impuestos proporcionales, a mayúscula es ce sub cero más be sub cero más ge; a minúscula es uno menos ce sub uno por uno menos te minúscula, menos be sub uno. Cada régimen conserva su propia función de consumo.',
'La ecuación se reduce a a minúscula por ye igual a a mayúscula menos be sub dos por i. Para despejar la tasa, divide a mayúscula por be sub dos y resta a minúscula dividido por be sub dos, por ye. Con financiamiento interno e impuestos fijos, a mayúscula es cuatrocientos catorce y a minúscula es cero coma veintisiete.'
]);
add(2,'is-build','A menor tasa, mayor producto de equilibrio de bienes','Cada cruce keynesiano entrega un punto de la misma IS.',[
'En el cruce keynesiano, la recta de cuarenta y cinco grados indica gasto igual a producción. El gasto planeado aumenta con el producto porque crecen consumo e inversión inducida. Una menor tasa eleva la inversión y desplaza hacia arriba ese gasto.',
`Con el perfil de financiamiento interno e impuestos fijos, a una tasa de tres por ciento el producto de equilibrio de bienes es ${words(E.goodsY(py,3))}. A cinco por ciento vuelve a mil doscientos. A siete por ciento es ${words(E.goodsY(py,7))}.`,
'Los puntos numerados trasladan esos pares al plano de producto y tasa. Así construimos la i ese, de pendiente negativa. Variar la tasa recorre una misma curva. Variar gasto público, impuestos autónomos o interceptos de gasto cambia su posición. No todos estos puntos equilibran dinero: todavía falta la otra condición.'
]);
add(2,'convergence','a > 0 sostiene la pendiente usual y las rondas de gasto','No demuestra la estabilidad dinámica del sistema completo.',[
'Con impuestos fijos y financiamiento interno, cada ronda de ingreso genera cero coma sesenta y cinco de consumo y cero coma cero ocho de inversión inducida. En total, cero coma setenta y tres vuelve como gasto. Como es menor que uno, las rondas sucesivas disminuyen y su suma converge.',
'La parte restante es a minúscula, cero coma veintisiete. Su inverso es el multiplicador del mercado de bienes con tasa constante. La pendiente de i ese es menos a minúscula dividido por be sub dos. En este caso es menos cero coma cero uno cinco.',
'Si a minúscula deja de ser positiva, perdemos esta interpretación habitual. Pero tener a positiva no basta para demostrar estabilidad dinámica de todo i ese ele eme. Para eso se necesitan reglas explícitas de ajuste de producción, inventarios y tasa.'
]);
add(3,'tax-question','Predice antes de comparar impuestos','¿Con qué régimen responderá más Y al mismo G + 60?',[
'Dos economías comparten producto de mil doscientos, tasa de cinco por ciento e impuestos de doscientos cuarenta. Una mantiene fijo el impuesto autónomo. La otra recauda veinte por ciento del ingreso, sin componente autónomo.',
'En ambas aumenta el gasto público en sesenta y el dinero real permanece constante. Antes de mirar la solución, predice: ¿el producto aumentará más con impuestos fijos o con impuestos proporcionales? ¿Qué pasará con la recaudación cuando crezca el ingreso?',
'Usa la pausa para escribir una explicación. El mismo equilibrio inicial no implica la misma respuesta fuera de ese punto.'
],{pause:8,pausePurpose:'Predice el cambio de Y y de la recaudación. La solución está en la diapositiva siguiente.'});
add(3,'tax-compare','La recaudación proporcional amortigua la expansión','Mismo perfil, misma base y mismo aumento de G; t no cambia.',[
`Con financiamiento interno e impuestos fijos, el gasto adicional eleva el producto en ${words(F.delta.Y)}. Con impuestos proporcionales, el incremento es ${words(FT.delta.Y)}. Las escalas de ambos gráficos son iguales.`,
`En el régimen fijo, los impuestos siguen en doscientos cuarenta. En el proporcional, aumentan en ${words(FT.delta.T)} porque la recaudación adicional es cero coma veinte por el cambio del producto. El ingreso disponible aumenta solo en el ochenta por ciento del aumento de ye.`,
'La respuesta del consumo se amortigua: cada unidad adicional de producto genera cero coma cincuenta y dos de consumo, frente a cero coma sesenta y cinco con impuesto fijo. Por eso a minúscula aumenta, la i ese se hace más inclinada y el multiplicador fiscal conjunto disminuye.'
]);
add(3,'automatic','Más recaudación no implica una nueva subida de impuestos','Ahorro público, consumo y producto responden con significados distintos.',[
'El estabilizador es automático porque cambia la recaudación al cambiar el ingreso, manteniendo constante la tasa tributaria. Una decisión discrecional sería modificar el impuesto autónomo o la tasa marginal. No hicimos ninguna de esas dos cosas en esta comparación.',
`Con impuesto fijo, el ahorro público pasa de cero a menos sesenta: el nuevo gasto supera la recaudación en sesenta. Con el régimen proporcional, el ahorro público final es ${words(FT.s1.Sg)}. La recaudación adicional cubre parte del gasto.`,
'En una contracción, el mecanismo opera al revés: cae la recaudación y amortigua la caída del ingreso disponible. Este resultado no permite elegir por sí solo un régimen tributario superior. No evaluamos distribución, servicios públicos ni bienestar.'
]);
add(4,'joint','Un mismo par debe satisfacer IS y LM','Sustituimos la tasa monetaria en el equilibrio de bienes.',[
'La i ese exige a minúscula por ye igual a a mayúscula menos be sub dos por i. La ele eme exige i igual a ka por ye menos saldos reales, dividido por hache. Sustituye esta segunda expresión en la primera.',
'El término de producto que proviene de la tasa pasa al lado izquierdo. Definimos de mayúscula como a minúscula más be sub dos por ka dividido por hache. El producto conjunto es a mayúscula más be sub dos dividido por hache por los saldos reales, todo dividido por de mayúscula.',
`Después de gasto público más sesenta, con financiamiento interno e impuesto fijo, a mayúscula es cuatrocientos setenta y cuatro y de mayúscula es cero coma setenta y dos. El producto final es ${words(F.s1.Y)} y la tasa es ${words(F.s1.i)} por ciento. Ahora debemos reconstruir y comprobar todas las cuentas.`
]);
add(4,'accounts','El ahorro privado no es el ahorro público','El ahorro nacional suma ambos flujos.',[
`Con el producto final de ${words(F.s1.Y)}, los impuestos siguen en doscientos cuarenta. El ingreso disponible es ${words(F.s1.Yd)} y el consumo es ${words(F.s1.C)}. La inversión completa da ${words(F.s1.I)}.`,
`El ahorro privado es ingreso menos impuestos menos consumo: ${words(F.s1.Sp)}. El ahorro público es impuestos menos gasto público: menos sesenta. Su suma, el ahorro nacional, es ${words(F.s1.S)}.`,
'El ahorro público puede ser negativo aunque el ahorro privado sea positivo. Son cuentas distintas. El ahorro es un flujo del período; la deuda es un stock. Tampoco debes identificar esta cuenta pública simplificada con un balance fiscal empírico que incluya transferencias, intereses u otras partidas.'
]);
add(4,'checks','Tres sustituciones cierran las cuentas','Bienes, dinero y ahorro deben usar exactamente el mismo Y e i.',[
'Primera comprobación: suma consumo, inversión y gasto público. El resultado debe ser el producto que resolviste. Segunda comprobación: sustituye el mismo producto y la misma tasa en la demanda de dinero. Debe coincidir con cuatrocientos de saldos reales.',
'Tercera comprobación: suma ahorro privado y ahorro público. En esta economía cerrada, en equilibrio de bienes, el ahorro nacional coincide con la inversión. Al sumar las definiciones de ahorro, los impuestos se cancelan; queda ingreso menos consumo menos gasto público.',
'Las tablas conservan precisión interna y redondean solo al mostrar. Un residuo prácticamente nulo confirma consistencia algebraica. No demuestra que los parámetros representen a una economía real ni establece por sí solo una dirección causal entre ahorro e inversión.'
]);
add(5,'multipliers','Cada multiplicador responde una pregunta diferente','No confundas gasto, dinero real y dinero nominal.',[
'Con la tasa constante, el multiplicador de gasto del mercado de bienes es uno dividido por a minúscula. En equilibrio conjunto con dinero real fijo, el multiplicador fiscal es uno dividido por de mayúscula. La diferencia proviene de la respuesta de la tasa.',
'El efecto del dinero real sobre el producto es be sub dos dividido por hache, todo dividido por de mayúscula. Para dinero nominal con precios fijos, añade uno dividido por pe. Las unidades cambian: una unidad de stock real no es una unidad de dinero nominal.',
`En financiamiento interno e impuesto fijo, el multiplicador de bienes es ${words(F.s0.alpha)}, el fiscal conjunto es ${words(F.s0.fiscal)}, la respuesta a dinero real es ${words(F.s0.realMoney)} y a dinero nominal es ${words(F.s0.nominalMoney)}. Son respuestas locales por unidad del instrumento, no el tamaño del shock.`
]);
add(5,'fiscal','La respuesta a tasa fija supera la expansión conjunta','La diferencia de producto no es el cambio neto de inversión.',[
`Con gasto público más sesenta, el cálculo a tasa fija da un aumento de producto de ${words(60*F.s0.alpha)}. Al imponer el equilibrio monetario, el aumento es ${words(F.delta.Y)}. La diferencia es ${words(F.gap)}.`,
'En el segundo experimento, el mayor producto eleva la demanda de dinero y la tasa debe subir a lo largo de ele eme. Esa tasa más alta reduce un componente de la inversión y modera las rondas de gasto.',
'Para que la primera expansión mantuviera la tasa y equilibrara también dinero, la oferta real tendría que acomodarse. Ese es otro cierre del modelo. Nombrar las condiciones que permanecen fijas evita presentar ambos cálculos como si fueran el mismo experimento.'
]);
add(5,'monetary','Más dinero real eleva Y y reduce i','M/P + 40 equivale a M + 80 cuando P = 2.',[
'Ahora partimos otra vez de la base. No acumulamos el aumento de gasto público. Conservamos política fiscal y precios, y elevamos los saldos reales en cuarenta. El dinero nominal aumenta de ochocientos a ochocientos ochenta.',
`Ele eme se desplaza hacia abajo y a la derecha. El nuevo equilibrio recorre la misma i ese. En financiamiento interno e impuesto fijo, el producto aumenta ${words(MON.delta.Y)} y la tasa final es ${words(MON.s1.i)} por ciento. La inversión aumenta ${words(MON.delta.I)}.`,
'Aumentar dinero nominal en cuarenta tendría la mitad de la respuesta porque el precio es dos. El dinero no entra directamente en a mayúscula: opera a través de la tasa y la inversión. La expansión del producto recupera parte de la demanda transaccional de dinero.'
]);
add(5,'autonomous-tax','Una rebaja tributaria no equivale al mismo aumento de G','Solo una parte de la rebaja se transforma inicialmente en consumo.',[
'Una rebaja de impuesto autónomo de sesenta aumenta el ingreso disponible inicial en sesenta. Con propensión a consumir de cero coma sesenta y cinco, la primera ronda de consumo aumenta treinta y nueve. Los veintiuno restantes son ahorro privado adicional a ingreso dado.',
`El efecto conjunto sobre el producto es menos ce sub uno dividido por de mayúscula, multiplicado por el cambio del impuesto. En esta calibración, el aumento de producto es ${words(-60*F.s0.tax)}. Es menor que con gasto público más sesenta porque el impulso inicial a la demanda es menor.`,
'Cambiar la tasa proporcional es distinto: modifica a minúscula y el efecto local depende del nivel de producto. Para un cambio finito hay que recalcular el equilibrio. Y si el régimen proporcional puro introduce un impuesto autónomo negativo, ya no es la misma regla pura de la comparación inicial.'
]);
add(5,'bank','La relación entre base y oferta monetaria es otra cápsula','El multiplicador bancario no es la respuesta de Y al dinero.',[
'La expresión multiplicador monetario también se usa para la relación entre oferta monetaria y base monetaria. En esta cápsula, eme es igual a mu por be. Mu es uno más teta, dividido por teta más ro más e.',
'Teta es efectivo sobre depósitos. Ro es reservas requeridas sobre depósitos. E es reservas excedentes sobre depósitos. La oferta monetaria suma efectivo y depósitos; la base suma efectivo y reservas. Al dividir ambas relaciones obtenemos la fórmula.',
'Con cocientes dados de cero coma veinte, cero coma diez y cero coma cero cinco, mu es aproximadamente tres coma cuarenta y tres. Esta relación bajo supuestos no describe de forma mecánica toda la política monetaria contemporánea. Crédito, demanda de préstamos, regulación y decisiones de tasa también importan. No la confundimos con el efecto del dinero sobre el producto.'
]);
add(6,'investment-question','¿Puede subir i y aumentar también I?','Predice el resultado en cada perfil antes de separar sus componentes.',[
'Volvemos al aumento de gasto público de sesenta desde la base, con dinero real fijo. El producto aumenta y la tasa también. Si solo miras la tasa, podrías concluir que la inversión total necesariamente disminuye.',
'Pero la función de inversión permanece completa. La inversión cambia por el ingreso y por la tasa. ¿Qué resultado esperas en el perfil de financiamiento interno, con baja sensibilidad al producto y mayor exposición a la tasa? ¿Y en el perfil de mayor sensibilidad al producto y menor exposición efectiva a la tasa interna?',
'Escribe ambos signos antes de avanzar. La existencia de un canal negativo por tasa no responde por sí sola la pregunta sobre la inversión total.'
],{pause:8,pausePurpose:'Predice el signo de ΔI en ambas economías alternativas.'});
add(6,'decomposition','Ingreso y tasa pueden empujar en sentidos opuestos','ΔI = b₁ΔY − b₂Δi; se mantienen los coeficientes de inversión.',[
`En el perfil de financiamiento interno, el efecto del ingreso es ${words(F.income)}. El de la tasa es ${words(F.rate)}. La suma es ${words(F.delta.I)}: la inversión total disminuye.`,
`En el perfil de mayor sensibilidad al producto, el efecto del ingreso es ${words(FM.income)} y el de la tasa es ${words(FM.rate)}. El cambio neto es ${words(FM.delta.I)}: la inversión aumenta, a pesar de que el canal de la tasa sigue siendo negativo.`,
'Estas economías son analogías didácticas de pymes y gran minería. El modelo cerrado no incorpora automáticamente crédito global, rentas, precio del cobre, tipo de cambio ni demanda externa. Tampoco sumamos ambas inversiones: estamos comparando dos economías alternativas.'
]);
add(6,'neutral','Una condición separa tres signos posibles','Con M/P constante: ΔI = (b₁ − b₂k/h)ΔY.',[
'En una expansión fiscal con dinero real constante, el cambio de tasa es ka dividido por hache, por el cambio del producto. Sustituye esa relación en la inversión. El coeficiente neto es be sub uno menos be sub dos por ka dividido por hache.',
'Para un aumento del producto, la inversión cae si el coeficiente es negativo, aumenta si es positivo y no cambia si es cero. Los perfiles principales tienen coeficientes menos cero coma treinta y siete y más cero coma doce.',
'Podemos construir el caso neutral con be sub uno igual a cero coma diez, be sub dos igual a cuatro y be sub cero igual a ciento setenta y seis. Comparte el equilibrio inicial y conserva a positiva. No confundas el efecto por tasa, el cambio neto de inversión y la diferencia de producto respecto de la tasa fija. Son magnitudes distintas.'
]);
add(6,'accelerator','El acelerador dinámico responde al cambio de Y','El término estático b₁Y responde al nivel: no son la misma relación.',[
'En la extensión dinámica, el capital deseado es ve por el producto del período. Si se ajusta completamente y no hay depreciación, la inversión neta es ve por la diferencia entre el producto actual y el anterior.',
'Con ve igual a dos, un producto que pasa de mil doscientos a mil doscientos sesenta genera inversión neta de ciento veinte. Si luego el producto se estabiliza en mil doscientos sesenta, la inversión neta cae a cero. Si después baja a mil doscientos treinta, la inversión neta es menos sesenta.',
'La reposición por depreciación añadiría compras brutas. Las expectativas modificarían la meta de capital, y el ajuste parcial haría más lenta su consecución. Esta secuencia declara un modelo dinámico distinto. No es una trayectoria temporal deducida de las ecuaciones estáticas de i ese ele eme.'
]);
add(7,'matrix','Ocho comparaciones parten de bases explícitas','Dos perfiles × dos regímenes × dos políticas independientes.',[
'La matriz cruza dos perfiles de inversión, dos regímenes tributarios y dos políticas: gasto público más sesenta o dinero real más cuarenta. Cada intervención parte de la base correspondiente. No acumulamos las políticas de filas distintas.',
'Para cada caso puedes consultar producto y tasa iniciales y finales, variaciones, consumo, impuestos, inversión y cuentas de ahorro. También aparecen los multiplicadores, la descomposición de inversión y las tres comprobaciones.',
'La tabla muestra que el estabilizador proporcional modera la expansión fiscal en ambos perfiles. También muestra que el signo de inversión ante política fiscal cambia entre perfiles. Esos resultados dependen de la calibración. Para reproducirlos, abre los ejercicios; para poner a prueba otra hipótesis, usa el laboratorio.'
]);
add(7,'judgment','Una cuenta consistente permite discutir mejor sus límites','Identidades, resultados paramétricos y preguntas fuera del modelo.',[
'Antes de recomendar una política, explica cuatro cosas. Desde qué equilibrio comparaste. Qué variable exógena cambió. Qué curva se desplazó y sobre cuál se movió el equilibrio. Y qué límite tiene tu conclusión.',
'Que el ahorro nacional coincida con la inversión proviene de las definiciones y del equilibrio cerrado de bienes. Que la inversión aumente o disminuya después de una expansión fiscal depende de los parámetros. Que una política sea mejor para el bienestar no puede decidirse con este modelo.',
'Has recorrido una cadena desde decisiones de hogares, empresas, gobierno y tenedores de dinero hasta dos mercados y un equilibrio común. Ahora reproduce el cálculo sin la narración, corrige tu predicción si hace falta y redacta un juicio que distinga el resultado de sus supuestos.'
]);
const data={title:'IS–LM · Del mecanismo al resultado',voice:'em_alex',language:'es',chapters:chapters.map(([id,title,exercise],index)=>({id,index,title,exercise})),scenes};fs.writeFileSync(path.join(root,'production/presentation-script.json'),JSON.stringify(data,null,2));
fs.writeFileSync(path.join(root,'assets/presentation-data.js'),'window.PresentationData = '+JSON.stringify(data)+';\n');console.log(scenes.length+' diapositivas; '+scenes.reduce((n,s)=>n+s.paragraphs.join(' ').split(/\s+/).length,0)+' palabras.');
