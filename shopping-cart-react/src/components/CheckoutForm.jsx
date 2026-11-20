import { DELIVERY_METHODS } from "../features/checkout/checkoutValidation";

export default function CheckoutForm({
    values,
    errors,
    onChange,
    onSubmit,
}) {
    return (
        <form className="checkout-form" noValidate onSubmit={onSubmit}>
            <div className="checkout-form__field">
                <label htmlFor="checkout-customer-name">
                    Fictional display name
                </label>
                <input
                    id="checkout-customer-name"
                    name="customerName"
                    type="text"
                    value={values.customerName}
                    onChange={onChange}
                    maxLength="60"
                    autoComplete="off"
                    aria-describedby={
                        errors.customerName
                            ? "checkout-customer-name-error"
                            : undefined
                    }
                    aria-invalid={Boolean(errors.customerName)}
                />
                {errors.customerName && (
                    <p
                        id="checkout-customer-name-error"
                        className="checkout-form__error"
                    >
                        {errors.customerName}
                    </p>
                )}
            </div>

            <fieldset
                className="checkout-form__field"
                aria-describedby={
                    errors.deliveryMethod
                        ? "checkout-delivery-method-error"
                        : undefined
                }
            >
                <legend>Simulated fulfillment method</legend>
                {Object.entries(DELIVERY_METHODS).map(([value, label]) => (
                    <label className="checkout-form__choice" key={value}>
                        <input
                            type="radio"
                            name="deliveryMethod"
                            value={value}
                            checked={values.deliveryMethod === value}
                            onChange={onChange}
                            aria-invalid={Boolean(errors.deliveryMethod)}
                        />
                        {label}
                    </label>
                ))}
                {errors.deliveryMethod && (
                    <p
                        id="checkout-delivery-method-error"
                        className="checkout-form__error"
                    >
                        {errors.deliveryMethod}
                    </p>
                )}
            </fieldset>

            <div className="checkout-form__field">
                <label htmlFor="checkout-notes">
                    Optional demo notes
                </label>
                <textarea
                    id="checkout-notes"
                    name="notes"
                    value={values.notes}
                    onChange={onChange}
                    maxLength="240"
                    rows="4"
                    aria-describedby={
                        errors.notes ? "checkout-notes-error" : undefined
                    }
                    aria-invalid={Boolean(errors.notes)}
                />
                <p className="checkout-form__hint">
                    Do not enter real contact, address, or payment information.
                </p>
                {errors.notes && (
                    <p id="checkout-notes-error" className="checkout-form__error">
                        {errors.notes}
                    </p>
                )}
            </div>

            <button className="checkout-button" type="submit">
                Review simulated order
            </button>
        </form>
    );
}
