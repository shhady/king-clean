import { getDatabaseStats, getOptimizationRecommendations } from '../lib/db/indexes';

async function main() {
  try {
    console.log('Getting database statistics...');
    const stats = await getDatabaseStats();
    console.log(JSON.stringify(stats, null, 2));

    console.log('\nChecking for optimization opportunities...');
    const recommendations = await getOptimizationRecommendations();
    if (recommendations.length > 0) {
      console.log('\nOptimization recommendations:');
      recommendations.forEach(rec => {
        console.log(`- ${rec.message} (${rec.type} in ${rec.collection})`);
      });
    } else {
      console.log('No optimization recommendations found.');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 