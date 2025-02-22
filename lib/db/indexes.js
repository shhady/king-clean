import dbConnect from '../dbConnect';
import mongoose from 'mongoose';

async function createIndexes() {
  try {
    const conn = await dbConnect();
    const db = conn.connection.db;

    // Orders collection indexes
    await db.collection('orders').createIndexes([
      // For general queries and sorting
      { key: { createdAt: -1 } },
      { key: { status: 1, createdAt: -1 } },
      { key: { id: 1 }, unique: true },
      
      // For search functionality
      { key: { 'customer.name': 'text', 'customer.email': 'text' } },
      
      // For date range queries
      { key: { createdAt: 1, status: 1 } },
      
      // For customer queries
      { key: { 'customer.email': 1 } },
      
      // For analytics
      { key: { status: 1, total: 1 } },
      { key: { 'items.id': 1 } }
    ]);

    // Products collection indexes (if you have one)
    await db.collection('products').createIndexes([
      { key: { category: 1 } },
      { key: { name: 'text', description: 'text' } },
      { key: { price: 1 } },
      { key: { createdAt: -1 } }
    ]);

    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
}

// Add a script to verify indexes
async function verifyIndexes() {
  try {
    const { db } = await dbConnect();
    
    const collections = ['orders', 'products'];
    for (const collection of collections) {
      const indexes = await db.collection(collection).indexes();
      console.log(`\nIndexes for ${collection}:`);
      indexes.forEach(index => {
        console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
      });
    }
  } catch (error) {
    console.error('Error verifying indexes:', error);
    throw error;
  }
}

// Add database statistics function
async function getDatabaseStats() {
  try {
    const { db } = await dbConnect();
    
    const stats = await db.stats();
    const collectionsStats = await Promise.all(
      ['orders', 'products'].map(async collection => ({
        name: collection,
        stats: await db.collection(collection).stats()
      }))
    );

    return {
      databaseSize: stats.dataSize,
      collections: collectionsStats.map(({ name, stats }) => ({
        name,
        count: stats.count,
        size: stats.size,
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        indexes: stats.nindexes,
        indexSize: stats.totalIndexSize
      }))
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
}

// Add optimization recommendations
async function getOptimizationRecommendations() {
  try {
    const { db } = await dbConnect();
    const recommendations = [];

    // Check index usage
    const orders = db.collection('orders');
    const indexStats = await orders.aggregate([
      { $indexStats: {} }
    ]).toArray();

    indexStats.forEach(stat => {
      if (stat.accesses.ops < 100) {
        recommendations.push({
          type: 'unused_index',
          collection: 'orders',
          index: stat.name,
          message: 'This index is rarely used and might be a candidate for removal'
        });
      }
    });

    // Check for large documents
    const avgDocSize = await orders.aggregate([
      {
        $group: {
          _id: null,
          avgSize: { $avg: { $bsonSize: "$$ROOT" } }
        }
      }
    ]).toArray();

    if (avgDocSize[0]?.avgSize > 16000) { // 16KB threshold
      recommendations.push({
        type: 'large_documents',
        collection: 'orders',
        message: 'Average document size is large. Consider optimizing document structure'
      });
    }

    return recommendations;
  } catch (error) {
    console.error('Error getting optimization recommendations:', error);
    throw error;
  }
}

export {
  createIndexes,
  verifyIndexes,
  getDatabaseStats,
  getOptimizationRecommendations
}; 