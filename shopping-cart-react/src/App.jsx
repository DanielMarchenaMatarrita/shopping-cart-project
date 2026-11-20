import { Navigate, Route, Routes } from "react-router";
import SiteHeader from "./components/SiteHeader";
import PaginationProvider from "./context/PaginationProvider";
import CartProvider from "./features/cart/CartProvider";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import "./App.css";

export default function App() {
  return (
    <CartProvider>
      <PaginationProvider>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/checkout/confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PaginationProvider>
    </CartProvider>
  );
}
