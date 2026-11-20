import { Link, useNavigate } from "react-router";
import { useRef, useState } from "react";
import CheckoutForm from "../components/CheckoutForm";
import CheckoutReview from "../components/CheckoutReview";
import {
    validateCheckoutForm,
} from "../features/checkout/checkoutValidation";
import { createDemoOrder } from "../features/checkout/orderFactory";
import { useCart } from "../features/cart/useCart";
import { useOrders } from "../features/orders/useOrders";

const initialFormValues = {
    customerName: "",
    deliveryMethod: "",
    notes: "",
};

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const { recordOrder } = useOrders();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState(initialFormValues);
    const [errors, setErrors] = useState({});
    const [checkoutError, setCheckoutError] = useState("");
    const [reviewOrder, setReviewOrder] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const confirmingRef = useRef(false);
    const identityRef = useRef(null);

    const isEmpty = items.length === 0;

    function handleChange(event) {
        const { name, value } = event.target;

        setFormValues((previous) => ({
            ...previous,
            [name]: value,
        }));
        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
        setCheckoutError("");
    }

    function createOrderForCurrentCart() {
        return createDemoOrder(items, formValues);
    }

    function handleReview(event) {
        event.preventDefault();

        const form = validateCheckoutForm(formValues);
        const result = createOrderForCurrentCart();

        setErrors({
            ...form.errors,
            ...(result.ok ? {} : result.errors),
        });

        if (!result.ok) {
            setCheckoutError(
                result.errors.cart ??
                    "Review the highlighted checkout information."
            );
            return;
        }

        setFormValues(form.value);
        identityRef.current = null;
        setCheckoutError("");
        setReviewOrder(result.order);
    }

    function handleConfirm() {
        if (confirmingRef.current) return;

        confirmingRef.current = true;
        setIsConfirming(true);

        // Rebuild from the live cart and current catalog immediately before
        // clearing anything. The review snapshot is never trusted as input.
        const result = createOrderForCurrentCart();

        if (!result.ok) {
            confirmingRef.current = false;
            setIsConfirming(false);
            setErrors(result.errors);
            setCheckoutError(
                result.errors.cart ??
                    "Checkout information needs attention before confirmation."
            );
            setReviewOrder(null);
            return;
        }

        if (!identityRef.current) {
            if (!globalThis.crypto?.randomUUID) {
                confirmingRef.current = false;
                setIsConfirming(false);
                setCheckoutError("A secure local demo ID is unavailable. Your cart was not cleared.");
                return;
            }
            identityRef.current = { id: `local-demo-${globalThis.crypto.randomUUID()}`, createdAt: new Date().toISOString() };
        }
        const recorded = recordOrder(result.order, identityRef.current.id, identityRef.current.createdAt);
        if (!recorded.ok) {
            confirmingRef.current = false;
            setIsConfirming(false);
            setCheckoutError("Could not save the simulated order in browser storage. Your cart was not cleared; check browser storage or incompatible history.");
            return;
        }

        clearCart();
        navigate("/checkout/confirmation", {
            replace: true,
            state: { orderId: recorded.order.id },
        });
    }

    if (isEmpty) {
        return (
            <main className="catalog-page checkout-page">
                <header className="checkout-page__header">
                    <p className="eyebrow">Demo checkout</p>
                    <h1>Simulated checkout</h1>
                </header>
                <section className="cart-empty" aria-labelledby="empty-checkout-title">
                    <h2 id="empty-checkout-title">Your cart is empty</h2>
                    <p>
                        Add a fictional demo product before starting a simulated
                        checkout.
                    </p>
                    <Link to="/products#demo-store">Browse demo products</Link>
                </section>
            </main>
        );
    }

    return (
        <main className="catalog-page checkout-page">
            <header className="checkout-page__header">
                <p className="eyebrow">Demo checkout</p>
                <h1>Simulated checkout</h1>
                <p>
                    Use fictional information only. No payment will be
                    processed and no real order will be created.
                </p>
            </header>

            {checkoutError && (
                <p className="checkout-alert" role="alert">
                    {checkoutError}
                </p>
            )}

            {reviewOrder ? (
                <CheckoutReview
                    order={reviewOrder}
                    isConfirming={isConfirming}
                    onEdit={() => {
                        confirmingRef.current = false;
                        setIsConfirming(false);
                        setReviewOrder(null);
                    }}
                    onConfirm={handleConfirm}
                />
            ) : (
                <>
                    <p className="checkout-page__step">Step 1 of 2</p>
                    <CheckoutForm
                        values={formValues}
                        errors={errors}
                        onChange={handleChange}
                        onSubmit={handleReview}
                    />
                </>
            )}

            <p className="checkout-page__back">
                <Link to="/cart">← Return to cart</Link>
            </p>
        </main>
    );
}
