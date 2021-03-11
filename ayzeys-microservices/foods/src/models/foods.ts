import mongoose from 'mongoose';

interface FoodDetails {
  name: string;
  price: number;
  userId: string;
}

interface FoodModel extends mongoose.Model<FoodDoc> {
  build(attrs: FoodDetails): FoodDoc;
}

interface FoodDoc extends mongoose.Document {
  name: string;
  price: number;
  userId: string;
}

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

foodSchema.statics.build = (attrs: FoodDetails) => {
  return new Food(attrs);
};

const Food = mongoose.model<FoodDoc, FoodModel>('Food', foodSchema);

export { Food };