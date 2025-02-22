import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

export async function POST(request) {
  try {
    await dbConnect();
    const { productId } = await request.json();

    const sourceProduct = await Product.findById(productId);
    if (!sourceProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create the duplicate product
    const duplicateProduct = new Product({
      ...sourceProduct.toObject(),
      _id: undefined,
      name: `${sourceProduct.name} (עותק)`,
      nameAr: `${sourceProduct.nameAr} (عملية)`,
      createdAt: undefined,
      updatedAt: undefined,
      stock:sourceProduct.stock,
      salePercentage:0,
      unit:'יחידות',
      unitAmount:sourceProduct.unitAmount,
      featuresHe:sourceProduct.featuresHe,
      featuresAr:sourceProduct.featuresAr,
      description:sourceProduct.description,
      descriptionAr:sourceProduct.descriptionAr,
      category:sourceProduct.category,
      subcategory:sourceProduct.subcategory,
      images:sourceProduct.images,
      price:sourceProduct.price,
      sales:0,
      salesHistory:[],
      images:sourceProduct.images,
      images:sourceProduct.images,


    });

    await duplicateProduct.save();

    const populatedProduct = await Product.findById(duplicateProduct._id)
      .populate('category', 'name nameAr');


    return NextResponse.json(populatedProduct, { status: 201 });
  } catch (error) {
    console.error('Error duplicating product:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate product' },
      { status: 500 }
    );
  }
} 