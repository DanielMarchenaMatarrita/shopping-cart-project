import { Navigate, Route, Routes } from "react-router";
import SiteHeader from "./components/SiteHeader";
import PaginationProvider from "./context/PaginationProvider";
import CartProvider from "./features/cart/CartProvider";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PaginationProvider>
    </CartProvider>
  );
}
