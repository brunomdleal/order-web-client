import React from 'react';
import type { Order, OrderStatus } from '../types/order'

// Defines the public props contract accepted by the OrderTable component from its parent (App.tsx).
interface OrderTableProps {
    // Enforces that the parent must supply an array of valid Order objects
    orders: Order[];
}

// Exports a strongly-typed React Functional Component (React.FC) destructuring orders from its incoming props.
export const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {

    // Internal utility mapping each OrderStatus union value to corresponding CSS badge classes.
    const getBadgeClass = (orderStatus: OrderStatus): string => {
        switch (orderStatus) {
            case 'PENDING':
                return 'badge badge-pending';
            case 'CANCELLED':
                return 'badge badge-cancelled';
            case "CONFIRMED":
                return 'badge badge-confirmed';
        }
    }

    return (
        <div className="card">
            <h3>Current Orders ({orders.length})</h3>
            {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No orders registered yet.</p>
            ) : (
                <table className="orders-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((ord) => (
                        <tr key={ord.id}>
                            <td style={{ fontFamily: 'monospace' }}>{ord.id.substring(0, 8)}...</td>
                            <td>{ord.item}</td>
                            <td>{ord.quantity}</td>
                            <td>
                                <span className={getBadgeClass(ord.status)}>
                                  {ord.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}