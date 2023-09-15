const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema = new Schema({
  items: [{ type: Schema.Types.Mixed, required: true }],
  totalAmount: { type: Number },
  totalItems: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paymentMethod: { type: String },
  status: { type: String, default: "pending", required: true },
  selectedAddress: { type: Schema.Types.Mixed, required: true },
});

// This will tell that server need to return _id as id
// virtuals is use to set fields in document
const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);