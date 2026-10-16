<script>
	import tailwindConfig from '../../../tailwind.config';
	import resolveConfig from 'tailwindcss/resolveConfig';
	import Katex from '~/utils/Katex.svelte';
</script>

<div id="description">
	<div class="article-section" data-click="article-intro">
		<h1>¿Qué es un Transformer?</h1>

		<p>
			El Transformer es una arquitectura de red neuronal que cambió de raíz la forma de hacer
			inteligencia artificial. Se presentó en 2017 en el artículo
			<a
				href="https://dl.acm.org/doi/10.5555/3295222.3295349"
				title="ACM Digital Library"
				target="_blank">"Attention is All You Need"</a
			>
			y desde entonces es la arquitectura de referencia del aprendizaje profundo: es la base de
			modelos generadores de texto como <strong>GPT</strong> de OpenAI, <strong>Claude</strong> de
			Anthropic, <strong>Llama</strong> de Meta y <strong>Gemini</strong> de Google. Más allá del
			texto, también se usa para generar audio, reconocer imágenes, predecir la estructura de
			proteínas y hasta jugar videojuegos.
		</p>
		<p>
			En esencia, un Transformer que genera texto funciona con un único principio: la
			<strong>predicción del próximo token</strong>. Dado un texto, ¿cuál es el
			<em>token más probable (una palabra o parte de una palabra)</em> que sigue? Su gran innovación
			es el mecanismo de <strong>autoatención</strong>, que le permite procesar la secuencia completa
			y captar relaciones entre palabras lejanas mucho mejor que las arquitecturas anteriores.
		</p>
		<p>
			Esta versión usa
			<a href="https://huggingface.co/DeepESP/gpt2-spanish" title="Hugging Face" target="_blank"
				>GPT-2 en español</a
			>
			(small), un modelo de 124 millones de parámetros entrenado con libros en castellano. No es un
			modelo de última generación, pero comparte la arquitectura y los principios de los modelos
			actuales, lo que lo convierte en un punto de partida ideal para entender lo básico.
		</p>
	</div>

	<div class="article-section" data-click="article-overview">
		<h1>Arquitectura del Transformer</h1>

		<p>
			Todo Transformer que genera texto tiene <strong>tres componentes clave</strong>:
		</p>
		<ol>
			<li>
				<strong class="bold-purple">Embedding</strong>: el texto se divide en unidades pequeñas
				llamadas tokens, que pueden ser palabras o partes de palabras. Cada token se convierte en un
				vector numérico (embedding) que captura su significado.
			</li>
			<li>
				<strong class="bold-purple">Bloque Transformer</strong>: la unidad fundamental que procesa y
				transforma los datos. Cada bloque incluye:
				<ul class="">
					<li>
						<strong>Mecanismo de atención</strong>, el corazón del bloque. Permite que los tokens se
						comuniquen entre sí y capten el contexto y las relaciones entre palabras.
					</li>
					<li>
						<strong>Capa MLP (perceptrón multicapa)</strong>, una red que procesa cada token por
						separado. Mientras la atención mueve información entre tokens, el MLP refina la
						representación de cada uno.
					</li>
				</ul>
			</li>
			<li>
				<strong class="bold-purple">Probabilidades de salida</strong>: una capa lineal final y la
				función softmax transforman los embeddings procesados en probabilidades, con las que el
				modelo predice el próximo token.
			</li>
		</ol>
	</div>

	<div class="article-section" id="embedding" data-click="article-embedding">
		<h2>Embedding</h2>
		<p>
			Supongamos que querés generar texto a partir de la frase
			<code>“La inteligencia artificial está transformando la”</code>. Primero hay que convertirla
			en algo que el modelo pueda procesar: números. De eso se encarga el embedding, en cuatro
			pasos: 1) tokenizar el texto, 2) obtener el embedding de cada token, 3) agregar información de
			posición y 4) sumar ambos para obtener el embedding final.
		</p>
		<div class="figure">
			<img src="./article_assets/embedding.png" width="65%" />
		</div>
		<div class="figure-caption">
			Figura <span class="attention">1</span>. Vista ampliada de la capa de embedding: cómo el texto
			se convierte en vectores. El proceso incluye
			<span class="fig-numbering">(1)</span> tokenización, (2) embedding de tokens, (3) codificación
			posicional y (4) embedding final. (Imagen del proyecto original, con el ejemplo en inglés).
		</div>
		<div class="article-subsection">
			<h3>Paso 1: Tokenización</h3>
			<p>
				La tokenización parte el texto en piezas más chicas llamadas tokens, que pueden ser palabras
				enteras o fragmentos. Como este modelo se entrenó en español, palabras frecuentes como
				<code>"inteligencia"</code> o <code>"universidad"</code> son un único token, mientras que
				palabras raras se parten en varios. El vocabulario se fija antes del entrenamiento: este GPT-2
				tiene <code>50.257</code> tokens distintos, cada uno con su número de identificación.
			</p>
		</div>
		<div class="article-subsection" id="article-token-embedding">
			<h3>Paso 2: Embedding de tokens</h3>
			<p>
				GPT-2 (small) representa cada token del vocabulario con un vector de 768 números. Esos
				vectores se guardan en una matriz de <code>(50.257, 768)</code>: ¡unos 39 millones de
				parámetros! Gracias a ella, los tokens con usos o significados parecidos quedan cerca en ese
				espacio de muchas dimensiones, y los distintos quedan lejos.
			</p>
		</div>
		<div class="article-subsection" id="article-positional-embedding">
			<h3>Paso 3: Codificación posicional</h3>
			<p>
				La capa de embedding también codifica la posición de cada token en la frase. Cada modelo usa
				un método distinto; GPT-2 aprende su propia matriz de posiciones durante el entrenamiento.
			</p>
		</div>
		<div class="article-subsection">
			<h3>Paso 4: Embedding final</h3>
			<p>
				Por último, se suman el embedding del token y el de su posición. El resultado captura a la
				vez el significado del token y su lugar en la secuencia.
			</p>
		</div>
	</div>

	<div class="article-section" data-click="article-transformer-block">
		<h2>Bloque Transformer</h2>

		<p>
			El procesamiento central ocurre en el bloque Transformer, formado por la autoatención
			multi-cabeza y una capa MLP. Los modelos apilan muchos bloques, uno detrás de otro, y la
			representación de cada token evoluciona de capa en capa hasta construir una comprensión cada
			vez más rica. El GPT-2 (small) que estamos viendo tiene <code>12</code> bloques.
		</p>
	</div>

	<div class="article-section" id="self-attention" data-click="article-attention">
		<h3>Autoatención multi-cabeza</h3>
		<p>
			La autoatención permite captar relaciones entre los tokens de una secuencia, de modo que la
			representación de cada token se vea influida por los demás. Las distintas cabezas miran esas
			relaciones desde perspectivas diferentes: una puede captar vínculos gramaticales cercanos y
			otra seguir el contexto general. Veamos el cálculo paso a paso.
		</p>
		<div class="article-subsection-l2">
			<h4>Paso 1: Matrices Query, Key y Value</h4>

			<div class="figure pt-10">
				<img src="./article_assets/QKV.png" width="80%" />
				<div class="text-xs">
					<Katex
						displayMode
						math={`
		QKV_{ij} = ( \\sum_{d=1}^{768} \\text{Embedding}_{i,d} \\cdot \\text{Pesos}_{d,j}) + \\text{Sesgo}_j
		`}
					/>
				</div>
			</div>
			<div class="figure-caption">
				Figura <span class="attention">2</span>. Cálculo de las matrices Query, Key y Value a partir
				del embedding original.
			</div>

			<p>
				El embedding de cada token se transforma en tres vectores:
				<span class="q-color">Query (Q)</span>,
				<span class="k-color">Key (K)</span> y
				<span class="v-color">Value (V)</span>, multiplicándolo por matrices de pesos aprendidas.
				Una analogía con un buscador web ayuda a entenderlo:
			</p>
			<ul>
				<li>
					<strong class="q-color font-medium">Query (Q)</strong> es lo que escribís en la barra del
					buscador: el token que quiere <em>"averiguar más"</em>.
				</li>
				<li>
					<strong class="k-color font-medium">Key (K)</strong> es el título de cada página en los
					resultados: los tokens a los que la consulta podría prestar atención.
				</li>
				<li>
					<strong class="v-color font-medium">Value (V)</strong> es el contenido de esas páginas. Una
					vez que la consulta encontró los resultados relevantes, se toma su contenido.
				</li>
			</ul>
			<p>
				Con estos valores, el modelo calcula puntajes de atención que determinan cuánto debe
				enfocarse cada token en los demás.
			</p>
		</div>
		<div class="article-subsection-l2">
			<h4>Paso 2: División en cabezas</h4>
			<p>
				Los vectores <span class="q-color">Query</span>, <span class="k-color">Key</span> y
				<span class="v-color">Value</span>
				se dividen en varias cabezas; en GPT-2 (small), <code>12</code>. Cada cabeza procesa su
				porción de forma independiente y capta relaciones distintas, lo que permite aprender en
				paralelo muchos rasgos del lenguaje.
			</p>
		</div>
		<div class="article-subsection-l2">
			<h4>Paso 3: Autoatención enmascarada</h4>
			<p>
				En cada cabeza se calcula la autoatención enmascarada: el modelo se enfoca en las partes
				relevantes del texto, pero no puede ver los tokens futuros.
			</p>

			<div class="figure">
				<img src="./article_assets/attention.png" width="80%" align="middle" />
			</div>
			<div class="figure-caption">
				Figura <span class="attention">3</span>. Uso de Query, Key y Value para calcular la
				autoatención enmascarada.
			</div>

			<ul>
				<li>
					<strong>Producto escalar</strong>: el producto entre las matrices
					<span class="q-color">Query</span>
					y <span class="k-color">Key</span> da el <strong>puntaje de atención</strong>, una matriz
					cuadrada con la relación entre todos los tokens.
				</li>
				<li>
					<strong>Escalado · Máscara</strong>: los puntajes se escalan y se tapa el triángulo
					superior de la matriz (se pone en menos infinito) para que el modelo no “espíe” el futuro.
				</li>
				<li>
					<strong>Softmax · Dropout</strong>: softmax convierte los puntajes en probabilidades. Cada
					fila suma 1 e indica cuánto importa cada token anterior.
				</li>
			</ul>
		</div>
		<div class="article-subsection-l2">
			<h4>Paso 4: Salida y concatenación</h4>
			<p>
				Los puntajes de atención se multiplican por la matriz
				<span class="v-color">Value</span> para obtener la
				<span class="purple-color">salida</span>
				de cada cabeza. Las <code>12</code> salidas se concatenan y pasan por una proyección
				lineal.
			</p>
		</div>
	</div>

	<div class="article-section" id="article-activation" data-click="article-mlp">
		<h3>MLP: perceptrón multicapa</h3>

		<div class="figure">
			<img src="./article_assets/mlp.png" width="70%" align="middle" />
		</div>
		<div class="figure-caption">
			Figura <span class="attention">4</span>. La capa MLP proyecta las representaciones a más
			dimensiones para aumentar la capacidad del modelo.
		</div>

		<p>
			Después de la atención, las salidas pasan por el MLP: dos transformaciones lineales con una
			función de activación
			<a
				href="https://en.wikipedia.org/wiki/Rectified_linear_unit#Gaussian-error_linear_unit_(GELU)"
				>GELU</a
			>
			en el medio.
		</p>
		<p>
			La primera transformación expande la dimensión de <code>768</code> a <code>3072</code>, para
			captar patrones más complejos. La segunda la vuelve a comprimir a <code>768</code>,
			conservando lo útil de la expansión.
		</p>
		<p>
			A diferencia de la atención, que mezcla información entre tokens, el MLP procesa cada token
			por separado.
		</p>
	</div>

	<div class="article-section" id="article-prob" data-click="article-prob">
		<h2>Probabilidades de salida</h2>
		<p>
			Al salir del último bloque, una capa lineal final proyecta la representación a un espacio de
			<code>50.257</code>
			dimensiones: un valor, llamado <code>logit</code>, por cada token del vocabulario. Cualquier
			token podría ser el siguiente; los logits permiten ordenarlos. Luego la función softmax los
			convierte en una distribución de probabilidad que suma 1, de la que se elige el próximo token.
		</p>

		<div class="figure py-5">
			<img src="./article_assets/softmax.png" width="70%" />
		</div>
		<div class="figure-caption">
			Figura <span class="attention">5</span>. Cada token del vocabulario recibe una probabilidad
			calculada a partir de los logits.
		</div>

		<p id="article-temperature" data-click="article-temperature">
			El último paso es elegir el próximo token. Acá juega la <code>temperatura</code>, una
			operación muy simple: se dividen los logits por la temperatura.
		</p>

		<ul>
			<li>
				<code>temperatura = 1</code>: dividir por uno no cambia nada.
			</li>
			<li>
				<code>temperatura &lt; 1</code>: la distribución se vuelve más puntiaguda; el modelo es más
				seguro y previsible.
			</li>
			<li>
				<code>temperatura &gt; 1</code>: la distribución se aplana; hay más azar, lo que a veces se
				llama la <em>“creatividad”</em> del modelo.
			</li>
		</ul>

		<p id="article-sampling" data-click="article-sampling">
			Además, el muestreo se puede ajustar con <code>top-k</code> y <code>top-p</code>:
		</p>
		<ul>
			<li>
				<code>top-k</code>: solo se consideran los k tokens más probables.
			</li>
			<li>
				<code>top-p</code>: se considera el conjunto más chico de tokens cuya probabilidad acumulada
				supera p.
			</li>
		</ul>
		<p>
			Combinando temperatura, top-k y top-p se equilibra un texto previsible con uno variado.
		</p>
	</div>

	<div class="article-section" data-click="article-advanced-features">
		<h2>Componentes auxiliares</h2>

		<p>
			Hay componentes que mejoran el desempeño del Transformer aunque no son centrales para
			entender la idea: la normalización de capa estabiliza el entrenamiento, el dropout evita el
			sobreajuste y las conexiones residuales permiten que el gradiente fluya por toda la red.
		</p>
		<div class="article-subsection" id="article-ln">
			<h3>Normalización de capa</h3>
			<p>
				Normaliza las entradas para que su media y su varianza sean estables, lo que hace el
				entrenamiento más estable y menos sensible a los pesos iniciales. En GPT-2 se aplica dos
				veces por bloque: antes de la atención y antes del MLP.
			</p>
		</div>
		<div class="article-subsection" id="article-dropout">
			<h3>Dropout</h3>
			<p>
				Durante el entrenamiento, pone en cero al azar una fracción de las activaciones para que la
				red no dependa de neuronas específicas y generalice mejor. Al generar texto está desactivado.
			</p>
		</div>
		<div class="article-subsection" id="article-residual">
			<h3>Conexiones residuales</h3>
			<p>
				Se introdujeron en la red ResNet en 2015: son atajos que suman la entrada de una capa a su
				salida. Evitan que el gradiente se desvanezca y permiten entrenar redes muy profundas. GPT-2
				las usa dos veces por bloque.
			</p>
		</div>
	</div>

	<div class="article-section" data-click="article-interactive-features">
		<h1>Para explorar</h1>
		<ul>
			<li>
				<strong>Escribí tu propia frase</strong> y mirá cómo el modelo la procesa y predice la
				próxima palabra.
			</li>
			<li>
				<strong>Mové la temperatura</strong> para ver cómo el modelo pasa de previsible a
				“creativo”.
			</li>
			<li>
				<strong>Probá top-k y top-p</strong> y observá cómo cambia la distribución de
				probabilidad.
			</li>
			<li>
				<strong>Pasá el mouse por los mapas de atención</strong> para ver en qué tokens se fija
				cada palabra.
			</li>
		</ul>
	</div>

	<div class="article-section" data-click="article-implementation">
		<h2>¿Cómo está hecho?</h2>
		<p>
			El modelo corre completo dentro del navegador. Se basa en la implementación de GPT de
			<a href="https://github.com/karpathy/nanoGPT" title="Github" target="_blank">nanoGPT</a>
			(Andrej Karpathy), convertida a
			<a href="https://onnxruntime.ai/" title="ONNX" target="_blank">ONNX Runtime</a>. La interfaz
			está hecha con
			<a href="https://kit.svelte.dev/" title="Svelte" target="_blank">Svelte</a> y
			<a href="https://d3js.org/" title="D3" target="_blank">D3.js</a>.
		</p>
	</div>

	<div class="article-section" data-click="article-credit">
		<h2>Créditos</h2>
		<p>
			<a href="https://poloclub.github.io/transformer-explainer/" target="_blank"
				>Transformer Explainer</a
			>
			fue creado por
			<a href="https://aereeeee.github.io/" target="_blank">Aeree Cho</a>,
			<a href="https://www.linkedin.com/in/chaeyeonggracekim/" target="_blank">Grace C. Kim</a>,
			<a href="https://alexkarpekov.com/" target="_blank">Alexander Karpekov</a>,
			<a href="https://alechelbling.com/" target="_blank">Alec Helbling</a>,
			<a href="https://zijie.wang/" target="_blank">Jay Wang</a>,
			<a href="https://seongmin.xyz/" target="_blank">Seongmin Lee</a>,
			<a href="https://bhoov.com/" target="_blank">Benjamin Hoover</a> y
			<a href="https://poloclub.github.io/polochau/" target="_blank">Polo Chau</a>
			en el Georgia Institute of Technology, con licencia MIT.
		</p>
		<p>
			Adaptación al español: traducción de la interfaz y reemplazo del modelo por
			<a href="https://huggingface.co/DeepESP/gpt2-spanish" target="_blank">DeepESP/gpt2-spanish</a>
			(licencia MIT), para la Tecnicatura Universitaria en Ciencia de Datos e Inteligencia
			Artificial (IGTP, Universidad Provincial de Córdoba).
		</p>
	</div>
</div>

<style lang="scss">
	a {
		color: theme('colors.blue.500');

		&:hover {
			color: theme('colors.blue.700');
		}
	}

	.bold-purple {
		color: theme('colors.purple.700');
		font-weight: bold;
	}

	code {
		color: theme('colors.gray.500');
		background-color: theme('colors.gray.50');
		font-family: theme('fontFamily.mono');
	}

	.q-color {
		color: theme('colors.blue.400');
	}

	.k-color {
		color: theme('colors.red.400');
	}

	.v-color {
		color: theme('colors.green.400');
	}

	.purple-color {
		color: theme('colors.purple.500');
	}

	.article-section {
		padding-bottom: 2rem;
	}
	.architecture-section {
		padding-top: 1rem;
	}
	.video-container {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 aspect ratio */
		height: 0;
		overflow: hidden;
		max-width: 100%;
		background: #000;
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	#description {
		padding-bottom: 3rem;
		margin-left: auto;
		margin-right: auto;
		max-width: 78ch;
	}

	#description h1 {
		color: theme('colors.purple.700');
		font-size: 2.2rem;
		font-weight: 300;
		padding-top: 1rem;
	}

	#description h2 {
		// color: #444;
		color: theme('colors.purple.700');
		font-size: 2rem;
		font-weight: 300;
		padding-top: 1rem;
	}

	#description h3 {
		color: theme('colors.gray.700');
		font-size: 1.6rem;
		font-weight: 200;
		padding-top: 1rem;
	}

	#description h4 {
		color: theme('colors.gray.700');
		font-size: 1.6rem;
		font-weight: 200;
		padding-top: 1rem;
	}

	#description p {
		margin: 1rem 0;
	}

	#description p img {
		vertical-align: middle;
	}

	#description .figure-caption {
		font-size: 0.8rem;
		margin-top: 0.5rem;
		text-align: center;
		margin-bottom: 2rem;
	}

	#description ol {
		margin-left: 3rem;
		list-style-type: decimal;
	}

	#description li {
		margin: 0.6rem 0;
	}

	#description p,
	#description div,
	#description li {
		color: theme('colors.gray.600');
		line-height: 1.6;
	}

	#description small {
		font-size: 0.8rem;
	}

	#description ol li img {
		vertical-align: middle;
	}

	#description .video-link {
		color: theme('colors.blue.600');
		cursor: pointer;
		font-weight: normal;
		text-decoration: none;
	}

	#description ul {
		list-style-type: disc;
		margin-left: 2.5rem;
		margin-bottom: 1rem;
	}

	#description a:hover,
	#description .video-link:hover {
		text-decoration: underline;
	}

	.figure,
	.video {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
