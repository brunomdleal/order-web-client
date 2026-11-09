export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// Defines the public contract and shape of a fully materialized, persisted Order object received from the backend API.
export interface Order {
    id: string;
    item: string;
    quantity: number;
    status: OrderStatus;
    createdAt?: string;
}

// Defines the contract for data sent from the client UI form to POST /api/v1/orders.
export interface CreateOrderPayload {
    item: string;
    quantity: number;
    status: OrderStatus;
}