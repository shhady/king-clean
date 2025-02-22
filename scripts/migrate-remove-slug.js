import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the products collection
    const products = mongoose.connection.collection('products');

    // Drop the slug index if it exists
    try {
      await products.dropIndex('slug_1');
      console.log('Dropped slug index');
    } catch (error) {
      console.log('No slug index found');
    }

    // Update all documents to remove the slug field
    const result = await products.updateMany(
      {},
      { $unset: { slug: "" } }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrate(); 