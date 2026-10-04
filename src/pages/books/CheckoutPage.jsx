/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Swal from "sweetalert2";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import { useGetCartQuery } from "../../redux/features/books/booksApi";
import booksApi from "../../redux/features/books/booksApi";
import { useGetMyProfileQuery } from "../../redux/features/users/usersApi";

const CheckoutPage = () => {
  const { data: cart, isLoading: isLoadingCart, isError: isCartError } =
    useGetCartQuery();
  const cartItems = cart?.items || [];
  const totalPrice = Number(cart?.subtotal || 0).toFixed(2);
  const { currentUser } = useAuth();
  const { data: profile } = useGetMyProfileQuery();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const navigate = useNavigate();

  useEffect(() => {
    reset({
      receiverName:
        profile?.fullName ||
        currentUser?.fullName ||
        currentUser?.displayName ||
        "",
      receiverPhone: profile?.phone || currentUser?.phone || "",
      address: profile?.address || currentUser?.address || "",
    });
  }, [currentUser, profile, reset]);

  const onSubmit = async (data) => {
    const newOrder = {
      shippingAddress: data.address,
      recipientName: data.receiverName,
      recipientPhone: data.receiverPhone,
      paymentMethod: "COD",
    };

    try {
      await createOrder(newOrder).unwrap();
      dispatch(booksApi.util.invalidateTags(["Cart", "Books"]));
      Swal.fire({
        title: "Order placed",
        text: "Your order was placed successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      navigate("/orders");
    } catch (error) {
      console.error("Error place an order", error);
      alert("Failed to place an order");
    }
  };

  if (isLoading || isLoadingCart) return <div>Loading....</div>;
  if (isCartError) return <div>Unable to load your cart.</div>;
  return (
    <section>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div>
              <h2 className="font-semibold text-xl text-gray-600 mb-2">
                Cash On Delivery
              </h2>
              <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
              <p className="text-gray-500 mb-6">
                Items: {cart?.totalItems || 0}
              </p>
            </div>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8"
              >
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Personal Details</p>
                  <p>Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="receiverName">Receiver Name</label>
                      <input
                        {...register("receiverName", { required: true })}
                        type="text"
                        id="receiverName"
                        placeholder="Receiver name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="receiverPhone">Receiver Phone Number</label>
                      <input
                        {...register("receiverPhone", { required: true })}
                        type="tel"
                        id="receiverPhone"
                        placeholder="Receiver phone number"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor="address">Receiver Address / Street</label>
                      <input
                        {...register("address", { required: true })}
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Receiver address"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-5 mt-3">
                      <div className="inline-flex items-center">
                        <input
                          onChange={(e) => setIsChecked(e.target.checked)}
                          type="checkbox"
                          name="billing_same"
                          id="billing_same"
                          className="form-checkbox"
                        />
                        <label htmlFor="billing_same" className="ml-2 ">
                          I am aggree to the{" "}
                          <Link className="underline underline-offset-2 text-blue-600">
                            Terms & Conditions
                          </Link>{" "}
                          and{" "}
                          <Link className="underline underline-offset-2 text-blue-600">
                            Shoping Policy.
                          </Link>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          disabled={!isChecked}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Place an Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
