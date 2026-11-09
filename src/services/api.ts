import type {Order, CreateOrderPayload} from "../types/order.ts";

const API_BASE_URL = "/api/v1/orders";

// Declares a reusable asynchronous function that returns a promise resolving to an array of Order objects.
export async function fetchOrders(): Promise<Order[]> {
    // Dispatches an HTTP GET request to ${API_BASE_URL} using the browser's native Fetch API.
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    return response.json();
}

// Declares an asynchronous function accepting an order creation payload and resolving to the newly created Order.
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
    // Dispatches an HTTP GET request to ${API_BASE_URL} with custom request configuration options.
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
    }
    return response.json();
}