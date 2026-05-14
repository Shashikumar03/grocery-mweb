import { useParams } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";

export function CategoryDetailPage() {
  const { categoryId } = useParams();
  return (
    <Screen title={`Category: ${categoryId}`}>
      <p className="muted">Product grid for this category.</p>
    </Screen>
  );
}
