import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@akdelivery/custom';
import { FoodDoc } from './food';

export { OrderStatus };

interface OrderDetails {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  food: FoodDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderDetails): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  food: FoodDoc;
  version: number;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderDetails) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };