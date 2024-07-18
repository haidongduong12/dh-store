import React, { useEffect, useState } from "react";
import "./css/index.css";
import Header from "../component/header";
import Footer from "../component/footer";
import axios from "axios";

const HistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const infoUser = JSON.parse(localStorage.getItem("user"));
  const userId = infoUser ? infoUser.id : null;
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/view-orders`,
        {
          params: { userId: userId }, // Sending userId as a parameter
        }
      );
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <div>
      <Header />
      <section className="py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="main-data p-8 sm:p-14 bg-gray-50 rounded-3xl">
            <h2 className="text-center font-manrope font-semibold text-4xl text-black mb-16">
              Order History
            </h2>
            <div className="grid grid-cols-5 pb-9">
              <div className="col-span-1">
                <p className="font-medium text-lg leading-8 text-indigo-600">
                  #
                </p>
              </div>
              <div className="col-span-1">
                <p className="font-medium text-lg leading-8 text-gray-600 text-center">
                  User
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <p className="font-medium text-lg leading-8 text-gray-600">
                  Total
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <p className="font-medium text-lg leading-8 text-gray-500">
                  Status
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <p className="font-medium text-lg leading-8 text-gray-500">
                  Actions
                </p>
              </div>
            </div>
            {orders && orders.length > 0 ? (
              <>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="box p-8 rounded-3xl bg-gray-100 grid grid-cols-5 mb-7 cursor-pointer transition-all duration-500 hover:bg-indigo-50"
                  >
                    <div className="col-span-1 flex items-left justify-left">
                      <p className="font-medium text-lg leading-8 text-black">
                        {order.id}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <p className="font-medium text-lg leading-8 text-black">
                        {order.user.fullname}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <p className="font-semibold text-xl leading-8 text-black">
                        ${order.total_amount}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <p className="font-semibold text-lg leading-8 text-green-500 text-left whitespace-nowrap">
                        {order.status}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <a
                        href={`/history-order-details/${order.id}`}
                        className="font-semibold text-lg leading-8 text-red-500 text-left whitespace-nowrap"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="col-span-1 flex items-center justify-center">
                  <a
                    className="font-semibold text-lg leading-8 text-green-500 text-center whitespace-nowrap"
                    href="/login"
                  >
                    You need to log in to view
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HistoryOrder;
