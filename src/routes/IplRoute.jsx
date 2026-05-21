import { Navigate } from "react-router-dom";
import { IPL_PROMO_ENABLED } from "../constants/features.js";
import { IplPredictPage } from "../pages/ipl/IplPredictPage.jsx";

/** IPL promo page — hidden unless VITE_ENABLE_IPL_PROMO=true */
export function IplRoute() {
  if (!IPL_PROMO_ENABLED) {
    return <Navigate to="/" replace />;
  }
  return <IplPredictPage />;
}
