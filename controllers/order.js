import OrderModel from "../models/order.js";
export const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({}).sort({ createdAt: -1 });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getOrdersByUserID = async (req, res) => {
  try {
    const orders = await OrderModel.find({ user: req.body.id }).sort({
      createdAt: -1,
    });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findOne({ _id: req.body.id })
      .populate({
        path: "orderItems.product", // Specify the field to populate
        model: "Product", // Model to use for population
        select: "name price photos title status description", // Specify the fields to retrieve from the Product model
      })
      .exec();
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const createOrder = async (req, res) => {
  try {
    const newOrder = new OrderModel({
      orderItems: req.body.cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      shippingAddress: req.body.address,
      paymentMethod: "Paypal",
      itemsPrice: req.body.totalPrice,
      shippingPrice: 3,
      totalPrice: Number(req.body.totalPrice) + Number(3),
      user: req.body.userID,
    });
    const order = await newOrder.save();
    console.log(order);
    res.status(201).send({ message: "New Order Created", order });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
export const payOrder = async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    const updateOrder = await order.save();
    res.send({ message: "Order Paid", order: updateOrder });
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
};
export const getDataOrder = async (req, res) => {
  try {
    const currentDate = new Date();
    const previousThreeMonthsStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 3,
      1
    );
    const filter = {
      isPaid: true,
      updatedAt: {
        $gte: previousThreeMonthsStartDate,
        $lt: currentDate,
      },
    };
    const orders = await OrderModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
            day: { $dayOfMonth: "$updatedAt" },
          },
          totalPrice: { $sum: { $multiply: ["$totalPrice", 1] } },
          itemCount: { $sum: 1 },
        },
      },

      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
