import { model, Schema } from 'mongoose';

interface IImage {
  fileName: string;
  originalName: string;
}

interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price: number | null
}

const imageSchema = new Schema<IImage>(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
      unique: true,
    },
    image: { type: imageSchema, required: true },
    category: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false },
);

export default model<IProduct>('product', productSchema);
