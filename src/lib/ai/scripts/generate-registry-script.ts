#!/usr/bin/env node
import { generateBlogRegistry } from '../registry-generator';

async function main() {
  try {
    console.log('📚 Generating blog registry...');
    await generateBlogRegistry();
    console.log('✅ Blog registry generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to generate blog registry:', error);
    process.exit(1);
  }
}

main();
