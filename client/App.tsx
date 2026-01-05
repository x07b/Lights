import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartProvider } from "./hooks/useCart";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSearch from "./pages/AdminSearch";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminCollections from "./pages/AdminCollections";
import NotFound from "./pages/NotFound";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Index />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <Products />
            </Layout>
          }
        />
        <Route
          path="/collections"
          element={
            <Layout>
              <Collections />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <Layout>
              <ProductDetail />
            </Layout>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout>
              <Checkout />
            </Layout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/collections" element={<AdminCollections />} />
        <Route path="/admin/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/search" element={<AdminSearch />} />

        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
