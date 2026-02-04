import fs from 'fs';
import path from 'path';
import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';

// Set GOOGLE_APPLICATION_CREDENTIALS in your environment before running.
// PowerShell example:
//   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\akash\AppData\Roaming\gcloud\application_default_credentials.json"

const main = async (text: string, filePath: string): Promise<string> => {
  console.log(`Text to synthesize: "${text}"`);
  console.log(`Output file path: "${filePath}"`);

  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new TypeError('`text` must be a non-empty string');
  }
  if (typeof filePath !== 'string' || filePath.trim().length === 0) {
    throw new TypeError('`filePath` must be a non-empty string');
  }

  const client = new TextToSpeechClient();

  const outPath = path.resolve(filePath);

  try {
    if (fs.existsSync(outPath)) {
      console.log(`File already exists, skipping synthesis: "${outPath}"`);
      return outPath;
    }

    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: 'hi-IN',
        name: 'hi-IN-Chirp3-HD-Achernar',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.92,
      },
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;
    if (!audioContent) {
      throw new Error('No audio content returned from Text-to-Speech API');
    }

    let buffer: Buffer;
    if (typeof audioContent === 'string') {
      buffer = Buffer.from(audioContent, 'base64');
    } else {
      buffer = Buffer.from(audioContent as Uint8Array);
    }

    // Ensure directory exists before writing
    const dir = path.dirname(outPath);
    fs.mkdirSync(dir, { recursive: true });

    // Write file with explicit error handling
    try {
      fs.writeFileSync(outPath, buffer);
      console.log(`Audio content written to file "${outPath}"`);
      return outPath;
    } catch (fsErr) {
      const e = new Error(`Failed to write audio file "${outPath}": ${(fsErr as Error).message}`);
      (e as any).cause = fsErr;
      throw e;
    }
  } catch (err) {
    console.error('google_sound: synthesis failed', err);
    throw err;
  }
};

export default main;
