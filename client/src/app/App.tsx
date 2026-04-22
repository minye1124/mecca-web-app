import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../features/home/HomePage";
import CheckoutPaymentPage from "../features/checkout/PaymentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route path="/checkout/payment" element={<CheckoutPaymentPage />} />
    </Routes>
  )
}

export default App;
