import express, { Request, Response } from 'express';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3004;
const PREVIEW_PORT = process.env.PREVIEW_PORT || 3005;
let previewProcess: any = null;

app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Create presentation file
app.post('/create-presentation', (req: Request, res: Response) => {
  const { filepath, presentation } = req.body;

  // Validate required fields
  if (!filepath || !presentation) {
    res.status(400).json({ error: 'Missing required fields: filepath, presentation' });
    return;
  }

  try {
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write presentation to file
    fs.writeFileSync(filepath, JSON.stringify(presentation, null, 2));

    res.json({
      success: true,
      filepath,
      message: 'Presentation file created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create presentation file',
    });
  }
});

// Preview endpoint
app.get('/preview', (req: Request, res: Response) => {
  if (!previewProcess) {
    try {
      previewProcess = spawn('npm', ['start'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        detached: true,
        shell: true,
      });

      previewProcess.unref();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start preview',
      });
      return;
    }
  }

  res.json({
    success: true,
    url: `http://localhost:${PREVIEW_PORT}`,
    message: 'Preview server started. Wait ~5s for it to boot.',
  });
});

// Stop preview endpoint
app.post('/preview/stop', (req: Request, res: Response) => {
  if (previewProcess) {
    previewProcess.kill();
    previewProcess = null;
    res.json({
      success: true,
      message: 'Preview server stopped',
    });
  } else {
    res.json({
      success: false,
      message: 'No preview server running',
    });
  }
});

// Render endpoint
app.post('/render', (req: Request, res: Response) => {
  const {
    input,
    output,
    language = 'en',
    width = 1920,
    height = 1080,
    fps = 30,
    codec = 'h264',
    audio = true,
  } = req.body;

  // Validate required fields
  if (!input || !output) {
    res.status(400).json({ error: 'Missing required fields: input, output' });
    return;
  }

  const args = [
    'src/cli.ts',
    'render',
    '-i', input,
    '-o', output,
    '-l', language,
    '--width', width.toString(),
    '--height', height.toString(),
    '--fps', fps.toString(),
    '--codec', codec,
  ];

  if (!audio) {
    args.push('--no-audio');
  }

  const child = spawn('npx', ['tsx', ...args], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  let stdout = '';
  let stderr = '';
  let responseSent = false;

  child.stdout?.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr?.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('close', (code) => {
    if (!responseSent) {
      responseSent = true;
      if (code === 0) {
        res.json({
          success: true,
          output,
          message: 'Render completed successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          error: stderr || 'Render failed',
          output,
        });
      }
    }
  });

  child.on('error', (error) => {
    if (!responseSent) {
      responseSent = true;
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 HTTP Server running at http://localhost:${PORT}`);
  console.log(`🏥 GET /health - Health check`);
  console.log(`📄 POST /create-presentation - Create presentation file`);
  console.log(`🎬 POST /render - Start rendering`);
  console.log(`👁️  GET /preview - Start preview server (port: ${PREVIEW_PORT})`);
  console.log(`🛑 POST /preview/stop - Stop preview server`);
});
