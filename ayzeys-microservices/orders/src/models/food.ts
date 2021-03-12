import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface FoodDetails {
  id: string;
  name: string;
  price: number;
}

interface FoodModel extends mongoose.Model<FoodDoc> {
  build(attrs: FoodDetails): FoodDoc;
  findByEvent(event: { id: string, version: number }): Promise<FoodDoc | null>
}

export interface FoodDoc extends mongoose.Document {
  name: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

foodSchema.set('versionKey', 'version');
foodSchema.plugin(updateIfCurrentPlugin);

foodSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Food.findOne({
    _id: event.id,
    version: event.version - 1
  });
};

foodSchema.statics.build = (attrs: FoodDetails) => {
  return new Food({
    _id: attrs.id,
    name: attrs.name,
    price: attrs.price,
  });
};

foodSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
      food: this,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Completed
        ],
      }
    });

    return !!existingOrder;
};

const Food = mongoose.model<FoodDoc, FoodModel>('Food', foodSchema);

export { Food };