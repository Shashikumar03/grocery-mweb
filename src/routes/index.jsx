import { Navigate } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage.jsx";
import { CategoriesPage } from "../pages/categories/CategoriesPage.jsx";
import { CategoryDetailPage } from "../pages/categories/CategoryDetailPage.jsx";
import { ProductDetailPage } from "../pages/product/ProductDetailPage.jsx";
import { SearchPage } from "../pages/search/SearchPage.jsx";
import { CartPage } from "../pages/cart/CartPage.jsx";
import { CheckoutPage } from "../pages/checkout/CheckoutPage.jsx";
import { OrdersPage } from "../pages/orders/OrdersPage.jsx";
import { AccountPage } from "../pages/account/AccountPage.jsx";
import { AddressesPage } from "../pages/account/AddressesPage.jsx";
import { SignUpPage } from "../pages/auth/SignUpPage.jsx";
import { LoginPage } from "../pages/auth/LoginPage.jsx";
import { NotFoundPage } from "../pages/errors/NotFoundPage.jsx";
import { IplRoute } from "./IplRoute.jsx";
import { AboutPage } from "../pages/legal/AboutPage.jsx";
import { ContactPage } from "../pages/legal/ContactPage.jsx";
import { PrivacyPage } from "../pages/legal/PrivacyPage.jsx";
import { TermsPage } from "../pages/legal/TermsPage.jsx";
import { FaqPage } from "../pages/legal/FaqPage.jsx";
import { DeliveryPage } from "../pages/legal/DeliveryPage.jsx";
import { GroceryGuidePage } from "../pages/legal/GroceryGuidePage.jsx";

export const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/categories", element: <CategoriesPage /> },
  { path: "/categories/:categoryId", element: <CategoryDetailPage /> },
  { path: "/product/:productId", element: <ProductDetailPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/orders", element: <OrdersPage /> },
  { path: "/ipl", element: <IplRoute /> },
  { path: "/account", element: <AccountPage /> },
  { path: "/account/addresses", element: <AddressesPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "/faq", element: <FaqPage /> },
  { path: "/delivery", element: <DeliveryPage /> },
  { path: "/guide", element: <GroceryGuidePage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
];
