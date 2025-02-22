import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hebrew name is required'],
    trim: true
  },
  nameAr: {
    type: String,
    required: [true, 'Arabic name is required'],
    trim: true
  }
}, { _id: true }); // Ensure subcategories get their own _id

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hebrew name is required'],
    trim: true
  },
  nameAr: {
    type: String,
    required: [true, 'Arabic name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Hebrew description is required'],
    trim: true
  },
  descriptionAr: {
    type: String,
    required: [true, 'Arabic description is required'],
    trim: true
  },
  image: {
    type: String,
  },
  subcategories: [subcategorySchema]
}, {
  timestamps: true
});

// Add compound index for unique names
categorySchema.index({ 
  name: 1,
  nameAr: 1
}, { 
  unique: true,
  background: true,
  name: 'unique_names' // Named index for better management
});

// Remove old model if it exists to prevent duplicate model error
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const Category = mongoose.model('Category', categorySchema);

export default Category; 