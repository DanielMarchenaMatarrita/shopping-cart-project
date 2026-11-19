import { Navigate, Route, Routes } from "react-router";
import PaginationProvider from "./context/PaginationProvider";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import "./App.css";

export default function App() {
  return (
    <PaginationProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PaginationProvider>
  );
}
