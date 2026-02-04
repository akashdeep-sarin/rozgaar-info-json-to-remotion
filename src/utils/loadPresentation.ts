import * as fs from 'fs';
import * as path from 'path';
import { merge } from 'lodash';
import { PresentationSchema, Presentation } from '../zod-presentation-schema';

/**
 * Load and validate a presentation JSON file
 * 
 * @param filePath - Path to the JSON file
 * @returns Validated presentation data
 */
export function loadPresentation(filePath: string): Presentation {
  try {
    // Read the file
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    
    // Parse JSON
    let jsonData = JSON.parse(fileContent);
    
    // Check for override.json in the same directory
    const dirName = path.dirname(absolutePath);
    const overridePath = path.join(dirName, 'override.json');
    
    if (fs.existsSync(overridePath)) {
      const overrideContent = fs.readFileSync(overridePath, 'utf-8');
      const overrideData = JSON.parse(overrideContent);
      
      // Deep merge: override.json takes precedence
      jsonData = merge({}, jsonData, overrideData);
      
      console.log('✓ Applied overrides from override.json');
    }
    
    // Validate against Zod schema
    const validatedData = PresentationSchema.parse(jsonData);
    
    return validatedData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load presentation: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Save presentation JSON to a file
 * 
 * @param presentation - Presentation data
 * @param filePath - Output file path
 */
export function savePresentation(presentation: Presentation, filePath: string): void {
  try {
    const absolutePath = path.resolve(filePath);
    const jsonContent = JSON.stringify(presentation, null, 2);
    fs.writeFileSync(absolutePath, jsonContent, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save presentation: ${error.message}`);
    }
    throw error;
  }
}
