import * as fs from 'fs';
import * as path from 'path';
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
    const jsonData = JSON.parse(fileContent);
    
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
