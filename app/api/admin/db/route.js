import { NextResponse } from 'next/server';
import { 
  createIndexes, 
  verifyIndexes, 
  getDatabaseStats, 
  getOptimizationRecommendations 
} from '@/lib/db/indexes';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    let result;
    switch (action) {
      case 'verify-indexes':
        result = await verifyIndexes();
        break;
      case 'stats':
        result = await getDatabaseStats();
        break;
      case 'optimize':
        result = await getOptimizationRecommendations();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Database operation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تنفيذ العملية' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action } = await request.json();

    if (action === 'create-indexes') {
      await createIndexes();
      return NextResponse.json({ message: 'Indexes created successfully' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Database operation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تنفيذ العملية' },
      { status: 500 }
    );
  }
} 