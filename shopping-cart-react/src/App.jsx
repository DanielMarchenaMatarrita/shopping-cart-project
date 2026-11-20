import { Navigate, Route, Routes } from "react-router";
import SiteHeader from "./components/SiteHeader";
import PaginationProvider from "./context/PaginationProvider";
import CartProvider from "./features/cart/CartProvider";
import OrdersProvider from "./features/orders/OrdersProvider";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import "./App.css";

export default function App() {
  return (
    <CartProvider>
      <OrdersProvider>
      <PaginationProvider>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/checkout/confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PaginationProvider>
      </OrdersProvider>
    </CartProvider>
  );
}
