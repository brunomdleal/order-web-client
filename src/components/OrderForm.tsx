import React, { useState } from "react";
import type {CreateOrderPayload, OrderStatus} from "../types/order.ts";

// Defines the props contract accepted by OrderForm from its parent container (App.tsx).
interface OrderFormProps {
    onSubmit: (payload: CreateOrderPayload) => Promise<void>;
    loading: boolean;
}

// Exports a typed React Functional Component destructuring its props
export const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, loading }) => {
    // STATE HOOK - item
    const [item, setItem] = useState<string>('');
    // STATE HOOK - order quantity
    const [quantity, setQuantity] = useState<number>(1);
    // STATE HOOK - order status
    const [status, setStatus] = useState<OrderStatus>("PENDING");

    // Intercepts native DOM form submit events.
    const handleSubmit = async (e: React.SubmitEvent) => {
        // Validates that the item string is not blank/whitespace and quantity is at least 1.
        e.preventDefault();
        if (!item.trim() || quantity <= 0) {
            return;
        }

        // Awaits the parent handler (handleCreateOrder), passing the constructed payload.
        await onSubmit({ item: item, quantity: quantity, status: status });
        // Clears description input back to empty.
        setItem('');
        // Resets quantity back to default unit of 1.
        setQuantity(1);
        // Resets dropdown status to the initial default state.
        setStatus('PENDING');
    };

    return (
        <div className="card">
            <h3>Create New Order</h3>
            <form onSubmit={handleSubmit} className="order-form">
                <div className="form-group">
                    <label htmlFor="item">Item Description</label>
                    <input
                        id="item"
                        type="text"
                        placeholder="e.g. Mechanical Keyboard"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group" style={{ maxWidth: '120px' }}>
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                    />
                </div>

                <div className="form-group" style={{ maxWidth: '160px' }}>
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as OrderStatus)}
                        required
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Order'}
                </button>
            </form>
        </div>
    );
}