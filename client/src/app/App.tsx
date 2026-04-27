import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../features/home/HomePage";
import ConfirmEmailPage from "../features/auth/pages/ConfirmEmailPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import CheckoutPaymentPage from "../features/checkout/PaymentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route path="/confirm-email" element={<ConfirmEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/checkout/payment" element={<CheckoutPaymentPage />} />
    </Routes>
  )
}

export default App;
