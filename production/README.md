# Fuentes de la presentación

Los 28 MP3 de assets/audio y sus marcas temporales están listos para reproducirse. No hacen falta modelos ni herramientas de síntesis para usar el aula.

El guion fuente está en build-presentation.js; presentation-script.json contiene su texto y presentation-timeline.json las marcas de la locución final. build-script-html.js genera la transcripción legible.

Para regenerar audio se requieren Python, kokoro-onnx, onnxruntime, NumPy, SoundFile, FFmpeg y FFprobe; también los modelos kokoro-v1.0.onnx y voices-v1.0.bin en una carpeta models/. Define KOKORO_WORK_DIR como la carpeta que contiene models/. generate_audio.py emplea exclusivamente la voz em_alex en español. Los modelos y la caché de síntesis no se distribuyen en este repositorio.

Regenerar el guion requiere regenerar audio y marcas temporales antes de publicar; build-presentation.js por sí solo no conserva los tiempos de reproducción. verify_audio.py comprueba decodificación, duración y niveles; no representa una audición humana completa.
