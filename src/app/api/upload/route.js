// app/api/upload/route.js
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI
const vertex_ai = new VertexAI({ project: 'consume-wise-poc', location: 'us-central1' });
const model = 'gemini-1.5-pro-002';

async function generateContent(req) {
  const streamingResp = await vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
    },
    contents: req.contents,
  });

  // Handle the response
  const chunks = [];
  for await (const item of streamingResp.stream) {
    chunks.push(item);
  }
  return chunks;
}

// Define the API route
export async function POST(req) {
  const formData = await req.formData(); // Handle formData from client
  const images = formData.getAll('images'); // Get all images from the form data

  // Prepare the images to pass to Vertex AI
  const preparedImages = images.map(async (image) => {
    const buffer = Buffer.from(await image.arrayBuffer());
    return {
      fileData: {
        mimeType: image.type,
        data: buffer,
      },
    };
  });

  const requestPayload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: 'Provide nutritional analysis on the product based on its images.' },
          ...preparedImages,
        ],
      },
    ],
  };

  // Call the Vertex AI API
  const [response] = await vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
    },
    contents: requestPayload.contents,
  });


  return new Response(JSON.stringify({ success: true, response }), {
    headers: { 'Content-Type': 'application/json' },
  });
}


// app/api/upload/route.js
export async function GET() {
  return new Response(JSON.stringify({ message: 'API route works!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
