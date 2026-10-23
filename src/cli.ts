#!/usr/bin/env node

import { Command } from 'commander';
import { loadPresentation } from './utils/loadPresentation';
import { renderPresentation, exportSlideImages, Codec } from './pipeline';

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
  .option('-l, --language <lang>', 'Language tag used in narration file names', 'hi')
  .option('--codec <codec>', 'Video codec (h264, h265, vp8, vp9)', 'h264')
  .option('--no-audio', 'Render without audio (skip narration)')
  .action(async (options) => {
    try {
      console.log('🎬 Starting presentation rendering...');
      const presentationData = loadPresentation(options.input);
      console.log(`✅ Loaded presentation: ${presentationData.title}`);
      console.log(`   Slides: ${presentationData.slides.length}`);
      console.log(options.audio ? '🎵 Generating narration...' : '🔇 Audio disabled - rendering silent video');

      const output = await renderPresentation(presentationData, options.output, {
        language: options.language,
        codec: options.codec as Codec,
        audio: options.audio,
        onProgress: ({ progress, renderedFrames, encodedFrames }) => {
          const percentage = (progress * 100).toFixed(1);
          process.stdout.write(`\r   Progress: ${percentage}% (${renderedFrames} frames rendered, ${encodedFrames} encoded)`);
        },
      });

      console.log('\n\n✅ Video rendered successfully!');
      console.log(`📹 Output: ${output}`);
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
  .option('--format <format>', 'Image format: png or jpeg', 'png')
  .option('--quality <quality>', 'JPEG quality (1-100, only for jpeg format)', '90')
  .action(async (options) => {
    try {
      console.log('🖼️  Starting slide image export...');
      const presentationData = loadPresentation(options.input);
      console.log(`✅ Loaded: ${presentationData.title}`);

      const images = await exportSlideImages(presentationData, options.output, {
        format: options.format,
        jpegQuality: parseInt(options.quality),
      });

      images.forEach((image) => console.log(`   ${image}`));
      console.log(`\n✅ Exported ${images.length} images!`);
    } catch (error) {
      console.error('\n❌ Error exporting images:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
