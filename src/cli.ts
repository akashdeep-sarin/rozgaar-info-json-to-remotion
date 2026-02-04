#!/usr/bin/env node

import { Command } from 'commander';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition, renderStill } from '@remotion/renderer';
import * as path from 'path';
import * as fs from 'fs';
import { loadPresentation } from './utils/loadPresentation';
import { fetchAudioForSlides } from './services/audioService';
import { getVideoConfig, VideoConfig } from './utils/videoConfig';

const program = new Command();

program
  .name('remotion-ppt-cli')
  .description('Convert JSON presentations to Remotion videos')
  .version('1.0.0');

program
  .command('render')
  .description('Render a presentation JSON file to video')
  .requiredOption('-i, --input <path>', 'Path to input JSON file')
  .requiredOption('-o, --output <path>', 'Path to output video file')
  .option('-l, --language <lang>', 'Language for narration (en or hi)', 'en')
  .option('--width <width>', 'Video width', '1920')
  .option('--height <height>', 'Video height', '1080')
  .option('--fps <fps>', 'Frames per second', '30')
  .option('--codec <codec>', 'Video codec (h264, h265, vp8, vp9)', 'h264')
  .option('--no-audio', 'Render without audio (skip audio fetching)')
  .action(async (options) => {
    try {
      console.log('🎬 Starting presentation rendering...');
      console.log(`📄 Input: ${options.input}`);
      console.log(`🎥 Output: ${options.output}`);
      console.log(`🗣️  Language: ${options.language}`);

      // Load and validate presentation
      console.log('\n📖 Loading presentation...');
      const presentationData = loadPresentation(options.input);
      console.log(`✅ Loaded presentation: ${presentationData.title}`);
      console.log(`   Slides: ${presentationData.slides.length}`);

      // Fetch audio metadata (if enabled)
      let audioMetadata: any[] = [];
      if (options.audio !== false) {
        console.log('\n🎵 Fetching audio metadata...');
        const slideIds = presentationData.slides.map(s => s.id || '').filter(Boolean);
        const narrationMetadata = {language: null,  narration: [] };
        narrationMetadata.narration = presentationData.slides.map(s => ({
          audioNarrationInEnglish: s.audioNarrationInEnglish,
          audioNarrationInHindi: s.audioNarrationInHindi
        }));
        narrationMetadata.language = options.language;
        audioMetadata = await fetchAudioForSlides(slideIds, narrationMetadata);
        console.log(`✅ Audio metadata fetched for ${audioMetadata.length} slides`);
      } else {
        console.log('\n🔇 Audio disabled - rendering silent video');
      }

      // Video configuration
      const videoConfig: VideoConfig = {
        width: parseInt(options.width),
        height: parseInt(options.height),
        fps: parseInt(options.fps),
        codec: options.codec as any,
      };

      // Bundle the Remotion project
      console.log('\n📦 Bundling Remotion project...');
      const bundleLocation = await bundle({
        entryPoint: path.resolve(__dirname, './index.ts'),
        webpackOverride: (config) => config,
      });
      console.log(`✅ Bundle created at: ${bundleLocation}`);

      // Select composition
      console.log('\n🎬 Selecting composition...');
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'Presentation',
        inputProps: {
          presentationData,
          language: options.language,
          audioMetadata,
        },
      });
      console.log(`✅ Composition selected: ${composition.id}`);

      // Ensure output directory exists
      const outputDir = path.dirname(path.resolve(options.output));
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Render video
      console.log('\n🎥 Rendering video...');
      console.log(`   Resolution: ${videoConfig.width}x${videoConfig.height}`);
      console.log(`   FPS: ${videoConfig.fps}`);
      console.log(`   Codec: ${videoConfig.codec}`);

      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: videoConfig.codec || 'h264',
        outputLocation: path.resolve(options.output),
        inputProps: {
          presentationData,
          language: options.language,
          audioMetadata,
        },
        onProgress: ({ progress, renderedFrames, encodedFrames }) => {
          const percentage = (progress * 100).toFixed(1);
          process.stdout.write(`\r   Progress: ${percentage}% (${renderedFrames} frames rendered, ${encodedFrames} encoded)`);
        },
      });

      console.log('\n\n✅ Video rendered successfully!');
      console.log(`📹 Output: ${path.resolve(options.output)}`);
    } catch (error) {
      console.error('\n❌ Error rendering presentation:', error);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate a presentation JSON file')
  .requiredOption('-i, --input <path>', 'Path to input JSON file')
  .action((options) => {
    try {
      console.log('🔍 Validating presentation...');
      const presentationData = loadPresentation(options.input);
      console.log('✅ Presentation is valid!');
      console.log(`   Title: ${presentationData.title}`);
      console.log(`   Slides: ${presentationData.slides.length}`);
      console.log(`   Theme: ${presentationData.theme}`);
    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  });

program
  .command('export-images')
  .description('Export each slide as an image (PNG/JPEG)')
  .requiredOption('-i, --input <path>', 'Path to input JSON file')
  .requiredOption('-o, --output <dir>', 'Output directory for images')
  .option('-l, --language <lang>', 'Language for slide selection (en or hi)', 'en')
  .option('--format <format>', 'Image format: png or jpeg', 'png')
  .option('--width <width>', 'Image width', '1920')
  .option('--height <height>', 'Image height', '1080')
  .option('--quality <quality>', 'JPEG quality (1-100, only for jpeg format)', '90')
  .action(async (options) => {
    try {
      console.log('🖼️  Starting slide image export...');
      console.log(`📄 Input: ${options.input}`);
      console.log(`📁 Output directory: ${options.output}`);

      // Load presentation
      console.log('\n📖 Loading presentation...');
      const presentationData = loadPresentation(options.input);
      console.log(`✅ Loaded: ${presentationData.title}`);
      console.log(`   Slides: ${presentationData.slides.length}`);

      // Ensure output directory exists
      const outputDir = path.resolve(options.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Bundle the project
      console.log('\n📦 Bundling Remotion project...');
      const bundleLocation = await bundle({
        entryPoint: path.resolve(__dirname, './index.ts'),
        webpackOverride: (config) => config,
      });
      console.log(`✅ Bundle created`);

      // Calculate frame positions for each slide
      console.log('\n🖼️  Exporting slides as images...');
      
      const frontPageDuration = 60; // Same as in Presentation.tsx
      const slideDuration = 300; // 10 seconds per slide at 30fps
      
      let currentFrame = 0;

      // Export front page if it exists
      if (presentationData.frontPage) {
        const outputPath = path.join(outputDir, `00-front-page.${options.format}`);
        console.log(`   Exporting: 00-front-page.${options.format}`);
        
        await renderStill({
          composition: await selectComposition({
            serveUrl: bundleLocation,
            id: 'Presentation',
            inputProps: {
              presentationData,
              language: options.language,
              audioMetadata: [],
            },
          }),
          serveUrl: bundleLocation,
          output: outputPath,
          frame: currentFrame, // First frame of front page
          imageFormat: options.format as 'png' | 'jpeg',
          jpegQuality: options.format === 'jpeg' ? parseInt(options.quality) : undefined,
        });

        currentFrame += frontPageDuration;
      }

      // Export each slide
      for (let i = 0; i < presentationData.slides.length; i++) {
        const slide = presentationData.slides[i];
        const slideNumber = String(i + 1).padStart(2, '0');
        const slideId = slide.id || `slide-${slideNumber}`;
        const outputPath = path.join(outputDir, `${slideNumber}-${slideId}.${options.format}`);
        
        console.log(`   Exporting: ${slideNumber}-${slideId}.${options.format}`);

        await renderStill({
          composition: await selectComposition({
            serveUrl: bundleLocation,
            id: 'Presentation',
            inputProps: {
              presentationData,
              language: options.language,
              audioMetadata: [],
            },
          }),
          serveUrl: bundleLocation,
          output: outputPath,
          frame: currentFrame, // First frame of this slide
          imageFormat: options.format as 'png' | 'jpeg',
          jpegQuality: options.format === 'jpeg' ? parseInt(options.quality) : undefined,
        });

        currentFrame += slideDuration;
      }

      console.log(`\n✅ Exported ${presentationData.slides.length + (presentationData.frontPage ? 1 : 0)} images!`);
      console.log(`📁 Output directory: ${outputDir}`);
    } catch (error) {
      console.error('\n❌ Error exporting images:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
