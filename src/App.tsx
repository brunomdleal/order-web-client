import { useState, useEffect } from 'react';
import './App.css'
import type {CreateOrderPayload, Order} from './types/order'
import { fetchOrders, createOrder } from './services/api'
import {OrderForm} from "./components/OrderForm.tsx";
import {OrderTable} from "./components/OrderTable.tsx";

export default function App() {

  // STATE HOOK - List of orders newly created/fetched from the API
  const [orders, setOrders] = useState<Order[]>([]);
  // STATE HOOK - Tracks pending asynchronous operations to disable inputs and indicate loading progress
  const [loading, setLoading] = useState<boolean>(false);
  // STATE HOOK - Tracks error
  const [error, setError] = useState<string | null>(null);

  // Triggers the initial fetch from the backend service.
  useEffect(() => {
    // Prevents state updates if the component unmounts while an async request is still traveling over the network
    let ignore = false;
    // Performs the network query
    async function startFetching() {
      try {
        const data = await fetchOrders();
        if (!ignore) {
          setOrders(data);
        }
      } catch (error: unknown) {
        if (!ignore) {
          setError(error instanceof Error ? error.message : 'Failed to fetch orders');
        }
      }
    }

    startFetching();

    return () => {
      ignore = true;
    };
  }, []);

  // Handles order creation delegated up from the OrderForm component.
  const handleCreateOrder = async (payload: CreateOrderPayload) => {
    try {
      // Disables the submit button to indicate network activity.
      setLoading(true);
      // Clears preexisting error banners before firing a new request.
      setError(null);
      // Sends POST /api/v1/orders with JSON payload to persist the order.
      const newOrder = await createOrder(payload);
      // Prepends the newly saved order directly to the top of the local state array.
      setOrders((prev) => [newOrder, ...prev]);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to create order');
    } finally {
      // Re-enables the form submit button.
      setLoading(false);
    }
  }

  return (
      <div className="dashboard-container">
        <header>
          <h1>Order Operations Dashboard</h1>
          <p>Live order streaming & dispatch intake</p>
        </header>

        {error && <div className="alert-error">{error}</div>}

        <OrderForm onSubmit={handleCreateOrder} loading={loading} />
        <OrderTable orders={orders} />
      </div>
  );

}
