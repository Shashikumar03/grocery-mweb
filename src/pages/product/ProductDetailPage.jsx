import { useParams } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";

export function ProductDetailPage() {
  const { productId } = useParams();
  return (
    <Screen title={`Product ${productId}`}>
      <p className="muted">PDP: gallery, price, add to cart.</p>
    </Screen>
  );
}
