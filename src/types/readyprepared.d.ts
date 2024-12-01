export interface ITransaction {
  _id: string;
  orderId: {
    _id: string;
    orderId: string;
    customerId: string;
    shopId: {
      _id: string;
      name: string;
    };
    totalAmount: number;
    status: string;
    paymentStatus: string;
  };
  id_order: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  amount: number;
  paystackReference: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: {
    _id: string;
    name: string;
  };
  subcategoryId: {
    _id: string;
    name: string;
    price: string;
  } | null;
  quantity: number;
  productPrice: number;
  subcategoryPrice: number;
  totalPrice: number;
  _id: string;
}

export interface IOrder {
  _id: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
  };
  shopId: {
    _id: string;
    name: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  pickupLocation: {
    coordinates: {
      latitude: string;
      longitude: string;
    };
    place: string;
    _id: string;
  };
  deliveryLocation: {
    coordinates: {
      latitude: string;
      longitude: string;
    };
    place: string;
    _id: string;
  };
  paymentStatus: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}