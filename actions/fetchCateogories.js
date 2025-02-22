'use server'
import dbConnect from '@/lib/dbConnect';
import Category from '@/app/models/Category';

export async function getCategories() {
    await dbConnect();
    const categories = await Category.find({})
        .select('name nameAr description descriptionAr image _id') // Fetch only the required fields
        .lean(); // Convert to plain JavaScript objects

    // Map over the array and convert _id to string
    const serializedCategories = categories.map(category => ({
        id: category._id.toString(),  // Convert ObjectId to string
        nameAr: category.nameAr,
        name: category.name,
        image:category.image,
        description:category.description,
        descriptionAr:category.descriptionAr
    }));

    return serializedCategories; // Return the properly formatted array
}
