# Transformer Explainer en español

Visualización interactiva de cómo funciona por dentro un modelo de lenguaje (LLM), adaptada al español para la **Tecnicatura Universitaria en Ciencia de Datos e Inteligencia Artificial** (IGTP, Universidad Provincial de Córdoba).

**Usarlo en línea:** https://diegohugobarrera.github.io/transformer-explainer-es/

Corre un GPT-2 (small, 124 millones de parámetros) **entrenado en español** directamente en el navegador, sin servidores: tokenización, embeddings, autoatención multi-cabeza, MLP, logits, temperatura y muestreo, todo con los números reales del modelo.

## Qué cambia respecto del original

- Interfaz, visita guiada, ayudas y artículo traducidos al español.
- Modelo reemplazado por [DeepESP/gpt2-spanish](https://huggingface.co/DeepESP/gpt2-spanish), exportado a ONNX con los scripts del proyecto (diferencia máxima de 0,02 en los logits frente al modelo de Hugging Face).
- Tokenizador en español: palabras como "inteligencia" o "universidad" son un único token.
- Ejemplos precalculados en español.
- Funciona sin internet: tokenizador, motor ONNX y KaTeX se sirven desde el propio sitio.

## Requisitos

Computadora con Chrome o Edge actualizado. La primera visita descarga unos 650 MB (el modelo) y quedan en la caché del navegador.

## Desarrollo

```bash
npm ci --legacy-peer-deps
npm run dev        # servidor de desarrollo
npx vite build     # sitio estático en build/
```

Para regenerar el modelo (requiere Python con torch, transformers y onnx):

```bash
MODEL_PATH=/ruta/a/gpt2-spanish OUT_NAME=gpt2-es PYTHONPATH=src/utils/model \
  python3 src/utils/model/export_to_onnx.py
```

y partir `src/utils/model/params_output/gpt2-es.onnx` en fragmentos de 10 MB dentro de `static/model-es/`.

## Créditos

- [Transformer Explainer](https://poloclub.github.io/transformer-explainer/), de Aeree Cho, Grace C. Kim, Alexander Karpekov, Alec Helbling, Jay Wang, Seongmin Lee, Benjamin Hoover y Polo Chau (Georgia Institute of Technology). Licencia MIT.
- Modelo [DeepESP/gpt2-spanish](https://huggingface.co/DeepESP/gpt2-spanish). Licencia MIT.
- Adaptación al español: Diego Barrera.
