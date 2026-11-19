import ProductsPage from "./pages/ProductsPage";
import PaginationProvider from "./context/PaginationProvider";
import "./App.css";

export default function App() {
  return (
    <PaginationProvider>
      <ProductsPage />
    </PaginationProvider>
  );
}