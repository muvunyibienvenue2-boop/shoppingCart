import getItems from "../assets/getItems";
import { useEffect, useState } from "react";
function Items() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const addItems = (item) => {
    setCart((prev) => {
      const existing = prev.find((el) => el.id === item.id);
      if (existing) {
        return prev.map((el) =>
          el.id === item.id ? { ...el, quantity: el.quantity + 1 } : el,
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await getItems();
        setData(res);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading items...</div>
      </div>
    );
  }

  const total = cart
    .reduce((sum, item) => sum + item.price + item.quantity, 0)
    .toFixed(2);
  const quantityDecrease = (id) => {
    setCart((prev) => {
      return prev
        .map((el) => (el.id === id ? { ...el, quantity: el.quantity - 1 } : el))
        .filter((el) => el.quantity > 0);
    });
  };

  const quantityIncrease = (id) => {
    setCart((prev) => {
      return prev.map((el) =>
        el.id === id ? { ...el, quantity: el.quantity + 1 } : el,
      );
    });
  };

  const removeSelected = (id) => {
    setCart((prev) => prev.filter((el) => el.id !== id));
  };
  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <div className={`flex-1 mr-20 overflow-y-auto`}>
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    {data?.length} items available
                  </p>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-3">
                {data?.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex items-center justify-between gap-4"
                  >
                    {/* Product Image & Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Image */}
                      <div className="w-16 h-16 shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-blue-600">
                            ${item.price}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold">
                            ({item.quantity} in stock)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => addItems(item)}
                      className={`shrink-0 w-10 h-10 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                        item.quantity > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={item.quantity === 0}
                      title={item.quantity > 0 ? "Add to cart" : "Out of stock"}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40`}
        >
          <div className="p-6">
            {/* Cart Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🛒 Cart</h2>
              <h2 className="text-2xl font-bold text-gray-900">
                Cart Items :{" "}
                {cart?.reduce((sum, item) => sum + item.quantity, 0)}
              </h2>
            </div>

            {cart?.length > 0 ? (
              <>
                <div className="space-y-3">
                  {cart?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm font-bold text-blue-600 mt-1">
                            ${item.price}
                          </p>
                          <p className="text-sm text-blue-600 mt-1 font-bold">
                            Quantity (In Stock) {item.quantity}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => quantityDecrease(item.id)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200 text-gray-700 font-semibold text-sm"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => quantityIncrease(item.id)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200 text-gray-700 font-semibold text-sm"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeSelected(item.id)}
                            className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors duration-200 mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-blue-600">
                      ${total}
                    </span>
                  </div>
                  <button className="w-full mt-6 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    Checkout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🛒</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-sm text-blue-500 text-center font-semibold">
                  Start adding items to see them here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Items;
