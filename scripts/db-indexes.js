import { createIndexes, verifyIndexes } from '../lib/db/indexes';

async function main() {
  try {
    console.log('Creating indexes...');
    await createIndexes();
    
    console.log('\nVerifying indexes...');
    await verifyIndexes();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 