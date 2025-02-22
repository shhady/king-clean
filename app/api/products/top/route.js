import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

export async function GET() {
  try {
    await dbConnect();

    // Get top 5 products by sales
    const products = await Product.find()
      .sort({ sales: -1 })
      .limit(6)
      .select('name nameAr images price sales salesHistory stock description descriptionAr category subcategory featuresHe featuresAr salePercentage unit unitAmount');


    // Get the first day of current and last month
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const productsWithTrend = products.map(product => {
      const salesHistory = product.salesHistory || [];
      
      // Get current month sales using timestamps for comparison
      const currentMonthSales = salesHistory
        .filter(sale => new Date(sale.date) >= currentMonthStart)
        .reduce((total, sale) => total + sale.quantity, 0);

      // Get last month sales
      const lastMonthSales = salesHistory
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= lastMonthStart && saleDate < currentMonthStart;
        })
        .reduce((total, sale) => total + sale.quantity, 0);

      // Calculate trend percentage
      let salesTrend = 0;
      if (lastMonthSales > 0) {
        salesTrend = ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
      } else if (currentMonthSales > 0) {
        salesTrend = 100; // If no sales last month but sales this month, 100% increase
      }

      return {
        _id: product._id,
        name: product.name,
        nameAr: product.nameAr,
        images: product.images,
        price: product.price,
        sales: product.sales || 0,
        stock:product.stock,
        description:product.description,
        descriptionAr:product.descriptionAr,
        category:product.category,
        subcategory:product.subcategory,
        featuresHe:product.featuresHe,
        featuresAr:product.featuresAr,
        salePercentage:product.salePercentage,
        currentMonthSales,
        lastMonthSales,
        salesTrend: Math.round(salesTrend)
      };
    });

    return NextResponse.json(productsWithTrend);
  } catch (error) {
    console.error('Error fetching top products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top products' },
      { status: 500 }
    );
  }
} 