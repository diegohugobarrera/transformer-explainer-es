import { get } from 'svelte/store';
import {
	expandedBlock,
	weightPopover,
	isBoundingBoxActive,
	textbookCurrentPageId,
	isExpandOrCollapseRunning,
	isFetchingModel,
	userId
} from '~/store';
import {
	highlightElements,
	removeHighlightFromElements,
	applyTransformerBoundingHeight,
	resetElementsHeight,
	highlightAttentionPath,
	removeAttentionPathHighlight,
	removeFingerFromElements
} from '~/utils/textbook';
import { drawResidualLine } from './animation';

export interface TextbookPage {
	id: string;
	title: string;
	content?: string;
	component?: any;
	timeoutId?: number;
	on: () => void;
	out: () => void;
	complete?: () => void;
}

const { drawLine, removeLine } = drawResidualLine();

export const textPages: TextbookPage[] = [
	{
		id: 'what-is-transformer',
		title: '¿Qué es un Transformer?',
		content: `<p>El <strong>Transformer</strong> es la arquitectura central de la IA moderna: es la base de modelos como ChatGPT, Claude y Gemini. Se presentó en 2017 y cambió la forma en que la IA procesa información. La misma arquitectura sirve para entrenar con enormes cantidades de datos y para generar respuestas. Acá usamos un GPT-2 (small) entrenado en español: más simple que los modelos actuales, pero ideal para entender los fundamentos.</p>
`,
		on: () => {},
		out: () => {}
	},
	{
		id: 'how-transformers-work',
		title: '¿Cómo funciona?',
		content: `<p>Un Transformer no es magia: arma el texto paso a paso preguntándose:</p>
	<blockquote class="question">
		"¿Cuál es la palabra más probable que sigue a este texto?"
	</blockquote>
	<p>Acá vamos a ver cómo un modelo ya entrenado genera texto. Escribí tu propia frase o elegí un ejemplo, y hacé clic en <strong>Generar</strong> para verlo en acción. Si el modelo todavía está cargando, probá con otro <strong>Ejemplo</strong>.</p>`,
		on: () => {
			highlightElements(['.input-form']);
			if (get(isFetchingModel)) {
				highlightElements(['.input-form .select-button']);
			} else {
				highlightElements(['.input-form .generate-button']);
			}
		},
		out: () => {
			removeHighlightFromElements([
				'.input-form',
				'.input-form .select-button',
				'.input-form .generate-button'
			]);
		},
		complete: () => {
			removeFingerFromElements(['.input-form .select-button', '.input-form .generate-button']);
			if (get(textbookCurrentPageId) === 'how-transformers-work') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'how-transformers-work'
				});
			}
		}
	},
	{
		id: 'transformer-architecture',
		title: 'Arquitectura del Transformer',
		content:
			'<p>Un Transformer tiene tres partes principales:</p><div class="numbered-list"><div class="numbered-item"><span class="number-circle">1</span><div class="item-content">Los <strong>embeddings</strong> convierten el texto en números.</div></div><div class="numbered-item"><span class="number-circle">2</span><div class="item-content">Los <strong>bloques Transformer</strong> mezclan información con autoatención (self-attention) y la refinan con un MLP.</div></div><div class="numbered-item"><span class="number-circle">3</span><div class="item-content">Las <strong>probabilidades</strong> indican qué tan probable es cada próximo token.</div></div></div>',
		on: () => {
			const selectors = [
				'.step.embedding',
				'.step.softmax',
				'.transformer-bounding',
				'.transformer-bounding-title'
			];
			highlightElements(selectors);
			applyTransformerBoundingHeight(['.softmax-bounding', '.embedding-bounding']);
		},
		out: () => {
			const selectors = [
				'.step.embedding',
				'.step.softmax',
				'.transformer-bounding',
				'.transformer-bounding-title'
			];
			removeHighlightFromElements(selectors);
			resetElementsHeight(['.softmax-bounding', '.embedding-bounding']);
		}
	},
	{
		id: 'embedding',
		title: 'Embedding',
		content: `<p>Antes de poder usar un texto, el Transformer lo parte en unidades pequeñas y representa cada una como una lista de números (un vector). Ese proceso se llama <strong>embedding</strong>, y la palabra se usa tanto para el proceso como para el vector resultante.</p><p>En esta herramienta cada vector aparece como un rectángulo; si pasás el mouse por encima, ves su tamaño.</p>`,
		on: () => {
			highlightElements(['.step.embedding .title']);
		},
		out: () => {
			removeHighlightFromElements(['.step.embedding .title']);
		},
		complete: () => {
			removeFingerFromElements(['.step.embedding .title']);
			if (get(textbookCurrentPageId) === 'embedding') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'embedding'
				});
			}
		}
	},
	{
		id: 'token-embedding',
		title: 'Embedding de tokens',
		content: `<p>La <strong>tokenización</strong> divide el texto en tokens: unidades pequeñas como palabras o partes de palabras. Este GPT-2 en español tiene un vocabulario de 50.257 tokens, cada uno con un número de identificación (ID).</p><p>En el paso de <strong>embedding de tokens</strong>, cada token se busca en una gran tabla y se reemplaza por un vector de 768 números. Esos vectores se aprenden durante el entrenamiento para representar lo mejor posible el significado de cada token.</p>`,
		on: function () {
			const selectors = [
				'.token-column .column.token-string',
				'.token-column .column.token-embedding'
			];
			if (get(expandedBlock).id !== 'embedding') {
				expandedBlock.set({ id: 'embedding' });
				this.timeoutId = setTimeout(() => {
					highlightElements(selectors);
				}, 500);
			} else {
				highlightElements(selectors);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			const selectors = [
				'.token-column .column.token-string',
				'.token-column .column.token-embedding'
			];
			removeHighlightFromElements(selectors);
			if (get(textbookCurrentPageId) !== 'positional-encoding') expandedBlock.set({ id: null });
		}
	},
	{
		id: 'positional-encoding',
		title: 'Codificación posicional',
		content: `<p>En el lenguaje, el orden de las palabras importa. La <strong>codificación posicional</strong> le da a cada token información sobre su lugar en la secuencia.</p><p>GPT-2 lo hace sumando al embedding del token un embedding de posición aprendido. Los modelos más nuevos usan otros métodos, como RoPE, que codifica la posición rotando ciertos vectores. Todos buscan que el modelo entienda el orden del texto.</p>`,
		on: function () {
			const selectors = [
				'.token-column .column.position-embedding',
				'.token-column .column.symbol'
			];
			if (get(expandedBlock).id !== 'embedding') {
				expandedBlock.set({ id: 'embedding' });
				this.timeoutId = setTimeout(() => {
					highlightElements(selectors);
				}, 500);
			} else {
				highlightElements(selectors);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			const selectors = [
				'.token-column .column.position-embedding',
				'.token-column .column.symbol'
			];
			removeHighlightFromElements(selectors);
			if (get(textbookCurrentPageId) !== 'token-embedding') expandedBlock.set({ id: null });
		}
	},
	{
		id: 'blocks',
		title: 'Bloques Transformer repetidos',
		content: `<p>El <strong>bloque Transformer</strong> es la unidad principal de procesamiento del modelo. Tiene dos partes:</p><ul><li><strong>Autoatención multi-cabeza</strong>: permite que los tokens compartan información.</li><li><strong>MLP</strong>: refina los detalles de cada token.</li></ul><p>Los modelos apilan muchos bloques, y la representación de cada token se enriquece a medida que los atraviesa. GPT-2 (small) tiene 12.</p>`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements([
						'.transformer-bounding',
						'.step.transformer-blocks .guide',
						'.attention > .title',
						'.mlp > .title'
					]);
					highlightElements(['.transformer-bounding-title'], 'textbook-button-highlight');
					isBoundingBoxActive.set(true);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.transformer-bounding',
				'.step.transformer-blocks .guide',
				'.attention > .title',
				'.mlp > .title'
			]);
			removeHighlightFromElements(['.transformer-bounding-title'], 'textbook-button-highlight');
			isBoundingBoxActive.set(false);
		},
		complete: () => {
			removeFingerFromElements(['.transformer-bounding-title']);
			if (get(textbookCurrentPageId) === 'blocks') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'blocks'
				});
			}
		}
	},
	{
		id: 'self-attention',
		title: 'Autoatención multi-cabeza',
		content:
			'<p>La <strong>autoatención</strong> (self-attention) le permite al modelo decidir qué partes del texto son más relevantes para cada token. Así captura significados y relaciones, incluso entre palabras alejadas.</p><p>En su forma <strong>multi-cabeza</strong>, el modelo ejecuta varios procesos de atención en paralelo, y cada uno se enfoca en patrones distintos del texto.</p>',
		on: () => {
			highlightElements(['.step.attention']);
		},
		out: () => {
			removeHighlightFromElements(['.step.attention']);
		}
	},
	{
		id: 'qkv',
		title: 'Consulta, Clave, Valor (Q, K, V)',
		content: `
	<p>Para calcular la autoatención, el embedding de cada token se transforma en 
  <span class="highlight">tres nuevos embeddings</span>: 
  <span class="blue">Query</span> (consulta),  
  <span class="red">Key</span> (clave) y  
  <span class="green">Value</span> (valor).
  Esta transformación se hace aplicando distintos pesos y sesgos (bias) a cada embedding. Esos parámetros se ajustan durante el entrenamiento.</p>

<p>Una vez creados, las <span class="blue">Queries</span> se comparan con las <span class="red">Keys</span> para medir relevancia, y esa relevancia se usa para ponderar los <span class="green">Values</span>.</p>
`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['g.path-group.qkv', '.step.qkv .qkv-column']);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['g.path-group.qkv', '.step.qkv .qkv-column']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.step.qkv .qkv-column']);
			if (get(textbookCurrentPageId) === 'qkv') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'qkv'
				});
			}
		}
	},

	{
		id: 'multi-head',
		title: 'Multi-cabeza',
		content:
			'<p>Después de crear los embeddings <span class="blue">Q</span>, <span class="red">K</span> y <span class="green">V</span>, el modelo los divide en varias <strong>cabezas</strong> (12 en GPT-2 small). Cada cabeza trabaja con su propio juego más chico de <span class="blue">Q</span>/<span class="red">K</span>/<span class="green">V</span> y se enfoca en patrones distintos: gramática, significado o relaciones a distancia.</p><p>Tener varias cabezas le permite al modelo aprender muchos tipos de relaciones en paralelo.</p>',
		on: () => {
			highlightAttentionPath();
			highlightElements(['.multi-head .head-title']);
		},
		out: () => {
			removeAttentionPathHighlight();
			removeHighlightFromElements(['.multi-head .head-title']);
		},
		complete: () => {
			removeFingerFromElements(['.multi-head .head-title']);
			if (get(textbookCurrentPageId) === 'multi-head') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'multi-head'
				});
			}
		}
	},
	{
		id: 'masked-self-attention',
		title: 'Autoatención enmascarada',
		content: `<p>En cada cabeza, el modelo decide cuánto se fija cada token en los demás:</p><ul><li><strong>Producto escalar</strong>: se multiplican los números correspondientes de los vectores <span class="blue">Query</span> y <span class="red">Key</span> y se suman, para obtener los <span class="purple">puntajes de atención</span>.</li><li><strong>Máscara</strong>: se ocultan los tokens futuros para que el modelo no pueda espiar lo que viene.</li><li><strong>Softmax</strong>: los puntajes se convierten en probabilidades; cada fila suma 1 y muestra en qué tokens anteriores se enfoca.</li></ul>`,
		on: () => {
			highlightAttentionPath();
			highlightElements(['.attention-matrix.attention-result']);
		},
		out: () => {
			removeAttentionPathHighlight();
			removeHighlightFromElements(['.attention-matrix.attention-result']);
			expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.attention-matrix.attention-result']);
			if (get(textbookCurrentPageId) === 'masked-self-attention') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'masked-self-attention'
				});
			}
		}
	},
	{
		id: 'output-concatenation',
		title: 'Salida de la atención y concatenación',
		content:
			'<p>Cada cabeza <span class="highlight">multiplica sus <span class="purple">puntajes de atención</span> por los embeddings <span class="green">Value</span> para producir su salida</span>: una representación de cada token refinada con el contexto.</p><p>GPT-2 (small) tiene 12 de estas salidas, que se concatenan para formar un único vector del tamaño original (768 números).</p>',
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['path.to-attention-out.value-to-out', '.attention .column.out']);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['path.to-attention-out.value-to-out', '.attention .column.out']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.attention .column.out']);
			if (get(textbookCurrentPageId) === 'output-concatenation') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-concatenation'
				});
			}
		}
	},
	{
		id: 'mlp',
		title: 'MLP (perceptrón multicapa)',
		content:
			'<p>La salida de la atención pasa por un <strong>MLP</strong> que refina la representación de cada token. Una capa lineal cambia los valores y el tamaño del embedding con pesos y sesgos aprendidos, y luego una activación no lineal decide cuánto deja pasar de cada valor.</p><p>Hay muchos tipos de activación; GPT-2 usa <strong>GELU</strong>, que deja pasar parcialmente los valores chicos y por completo los grandes, para captar tanto patrones sutiles como fuertes.</p>',
		on: () => {
			highlightElements(['.step.mlp', '.operation-col.activation']);
		},
		out: () => {
			removeHighlightFromElements(['.step.mlp', '.operation-col.activation']);
		}
	},

	{
		id: 'output-logit',
		title: 'Logits de salida',
		content: `<p>Después de todos los bloques, el embedding de salida del último token, enriquecido con el contexto de todos los anteriores, se multiplica por los pesos aprendidos de una capa final.</p><p>Así se obtienen los <strong>logits</strong>: 50.257 números, uno por cada token del vocabulario, que indican qué tan probable es que cada token sea el siguiente.</p>`,
		on: () => {
			highlightElements(['g.path-group.softmax', '.column.final']);
		},
		out: () => {
			removeHighlightFromElements(['g.path-group.softmax', '.column.final']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.column.final']);
			if (get(textbookCurrentPageId) === 'output-logit') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-logit'
				});
			}
		}
	},
	{
		id: 'output-probabilities',
		title: 'Probabilidades',
		content:
			'<p>Los logits son puntajes en bruto. Para interpretarlos mejor, se convierten en <strong>probabilidades</strong> entre 0 y 1 que suman 1 en total. Así sabemos qué tan probable es cada token como próxima palabra.</p><p>En lugar de elegir siempre el token más probable, se pueden usar distintas estrategias de selección para equilibrar previsibilidad y creatividad.</p>',
		on: () => {
			highlightElements(['.step.softmax .title']);
		},
		out: () => {
			removeHighlightFromElements(['.step.softmax .title']);
		},
		complete: () => {
			removeFingerFromElements(['.step.softmax .title']);
			if (get(textbookCurrentPageId) === 'output-probabilities') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-probabilities'
				});
			}
		}
	},
	{
		id: 'temperature',
		title: 'Temperatura',
		content:
			'<p>La <strong>temperatura</strong> escala los logits antes de convertirlos en probabilidades. Con una <strong>temperatura baja</strong> (por ejemplo, 0,2) las diferencias se agrandan, se favorecen los tokens con mayor puntaje y las elecciones son más <strong>previsibles</strong>. Con una <strong>temperatura alta</strong> (1,0 o más) las diferencias se achatan, los tokens menos probables ganan chances y el resultado es más <strong>creativo</strong>.</p>',
		on: function () {
			if (get(expandedBlock).id !== 'softmax') {
				expandedBlock.set({ id: 'softmax' });
				this.timeoutId = setTimeout(() => {
					highlightElements([
						'.formula-step.scaled',
						'.title-box.scaled',
						'.content-box.scaled',
						'.temperature-input'
					]);
				}, 500);
			} else {
				highlightElements([
					'.formula-step.scaled',
					'.title-box.scaled',
					'.content-box.scaled',
					'.temperature-input'
				]);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.formula-step.scaled',
				'.title-box.scaled',
				'.temperature-input',
				'.content-box.scaled'
			]);
			if (!['temperature', 'sampling'].includes(get(textbookCurrentPageId)))
				expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.temperature-input']);
			if (get(textbookCurrentPageId) === 'temperature') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'temperature'
				});
			}
		}
	},
	{
		id: 'sampling',
		title: 'Estrategia de muestreo',
		content:
			'<p>Por último, hace falta una estrategia para elegir el próximo token. Hay muchas; las más comunes son: la búsqueda voraz (greedy), que elige siempre el primero; <strong>top-k</strong>, que conserva solo los k tokens más probables; y <strong>top-p</strong>, que conserva el conjunto más chico cuya probabilidad total llega a p, descartando los improbables.</p><p>Después, softmax convierte los logits que quedan en probabilidades y se elige un token al azar entre los permitidos.</p>',
		on: function () {
			if (get(expandedBlock).id !== 'softmax') {
				expandedBlock.set({ id: 'softmax' });
				this.timeoutId = setTimeout(() => {
					highlightElements([
						'.formula-step.sampling',
						'.title-box.sampling',
						'.sampling-input',
						'.content-box.sampling'
					]);
				}, 500);
			} else {
				highlightElements([
					'.formula-step.sampling',
					'.title-box.sampling',
					'.sampling-input',
					'.content-box.sampling'
				]);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.formula-step.sampling',
				'.title-box.sampling',
				'.sampling-input',
				'.content-box.sampling'
			]);
			if (!['temperature', 'sampling'].includes(get(textbookCurrentPageId)))
				expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.sampling-input']);
			if (get(textbookCurrentPageId) === 'sampling') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'sampling'
				});
			}
		}
	},
	{
		id: 'residual',
		title: 'Conexión residual',
		content: `<p>Los Transformers tienen componentes auxiliares que mejoran su desempeño. Por ejemplo, la <strong>conexión residual</strong> suma la entrada de una capa a su salida, para que la información no se pierda al atravesar muchos bloques. GPT-2 la usa dos veces por bloque, lo que permite entrenar pilas más profundas.</p>`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['.operation-col.residual', '.residual-start']);
					drawLine();
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['.operation-col.residual', '.residual-start']);
			removeLine();
		}
	},
	{
		id: 'layer-normalization',
		title: 'Normalización de capa',
		content: `<p>La <strong>normalización de capa</strong> estabiliza el entrenamiento y la inferencia ajustando los números de entrada para que su media y su varianza se mantengan estables. Así el modelo depende menos de sus pesos iniciales y aprende mejor. En GPT-2 se aplica antes de la autoatención, antes del MLP y una vez más antes de la salida final.</p>`,
		on: () => {
			highlightElements(['.operation-col.ln']);
		},
		out: () => {
			removeHighlightFromElements(['.operation-col.ln']);
		}
	},
	{
		id: 'dropout',
		title: 'Dropout',
		content: `<p>Durante el entrenamiento, el <strong>dropout</strong> apaga al azar algunas conexiones para que el modelo no se sobreajuste a patrones específicos y generalice mejor. GPT-2 lo usa, pero muchos LLM actuales lo omiten porque entrenan con tantos datos que el sobreajuste es un problema menor. Al generar texto (inferencia), el dropout está desactivado.</p>`,
		on: () => {
			highlightElements(['.operation-col.dropout']);
		},
		out: () => {
			removeHighlightFromElements(['.operation-col.dropout']);
		}
	}
	// {
	// 	id: 'final',
	// 	title: `Let's explore!`,
	// 	content: '',
	// 	on: () => {},
	// 	out: () => {}
	// }
];
