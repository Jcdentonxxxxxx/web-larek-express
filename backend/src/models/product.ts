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
      required: [true, 'Имя файла изображения обязательно'],
    },
    originalName: {
      type: String,
      required: [true, 'Оригинальное имя файла обязательно'],
    },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Поле "title" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "title" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "title" - 30 символов'],
      unique: true,
    },
    image: { type: imageSchema, required: [true, 'Изображение обязательно'] },
    category: {
      type: String,
      required: [true, 'Категория обязательна'],
    },
    description: String,
    price: {
      type: Number,
      min: [0, 'Цена не может быть отрицательной'],
      default: null,
    },
  },
  { versionKey: false },
);

export default model<IProduct>('product', productSchema);
