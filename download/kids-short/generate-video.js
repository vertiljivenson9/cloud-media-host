import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  try {
    console.log('🎬 Iniciando generación de video...');
    
    const zai = await ZAI.create();
    
    // Read image and convert to base64
    const imageBuffer = fs.readFileSync('/home/z/my-project/download/kids-short/scene-base.png');
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    
    console.log('🖼️ Imagen cargada, creando tarea de video...');
    
    // Create video generation task
    const task = await zai.video.generations.create({
      image_url: base64Image,
      prompt: 'Animate this scene: the baby elephant waves its trunk happily, the puppy jumps playfully, the kitten chases a butterfly, rainbow shimmers, flowers sway gently, magical sparkles appear, colorful and cheerful children animation',
      quality: 'quality',
      size: '768x1344',
      fps: 30,
      duration: 5,
      with_audio: true
    });
    
    console.log(`✅ Tarea creada - ID: ${task.id}`);
    console.log(`📊 Estado: ${task.task_status}`);
    
    // Poll for results
    let result = await zai.async.result.query(task.id);
    let pollCount = 0;
    const maxPolls = 60;
    const pollInterval = 10000; // 10 seconds
    
    while (result.task_status === 'PROCESSING' && pollCount < maxPolls) {
      pollCount++;
      console.log(`⏳ Encuesta ${pollCount}/${maxPolls}: Estado ${result.task_status}...`);
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      result = await zai.async.result.query(task.id);
    }
    
    if (result.task_status === 'SUCCESS') {
      const videoUrl = result.video_result?.[0]?.url ||
                      result.video_url ||
                      result.url ||
                      result.video;
      
      console.log('🎉 ¡Video generado con éxito!');
      console.log(`🔗 URL del video: ${videoUrl}`);
      
      // Save result
      const resultData = {
        taskId: task.id,
        status: result.task_status,
        videoUrl: videoUrl,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(
        '/home/z/my-project/download/kids-short/video-result.json',
        JSON.stringify(resultData, null, 2)
      );
      
      // Try to download the video
      if (videoUrl) {
        try {
          console.log('📥 Descargando video...');
          const videoResponse = await fetch(videoUrl);
          const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
          const videoPath = '/home/z/my-project/download/kids-short/kids-short-video.mp4';
          fs.writeFileSync(videoPath, videoBuffer);
          console.log(`💾 Video guardado en: ${videoPath}`);
          console.log(`📏 Tamaño: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);
        } catch (downloadError) {
          console.log(`⚠️ No se pudo descargar automáticamente: ${downloadError.message}`);
          console.log('🔗 Puedes descargarlo manualmente desde la URL proporcionada.');
        }
      }
    } else {
      console.log(`❌ La tarea falló. Estado final: ${result.task_status}`);
      console.log('Respuesta:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
