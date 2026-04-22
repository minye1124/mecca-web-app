import type {
  ProductSummary,
  RecommendedProduct,
} from "../types";
import { formatMoney } from "../formatters";
import ProductQuickActions from "./ProductQuickActions";
import RatingStars from "./RatingStars";

import styles from "./ProductCard.module.css";

type ProductCardVariant = "compact" | "detailed";
type ProductCardData = ProductSummary | RecommendedProduct;

export interface ProductCardProps {
  product: ProductCardData;
  variant: ProductCardVariant;
}

function isRecommendedProduct(product: ProductCardData): product is RecommendedProduct {
  return "socialProof" in product;
}

function ProductCard({ product, variant }: ProductCardProps) {
  const isDetailed = variant === "detailed";

  return (
    <div className={`${styles.card} ${isDetailed ? styles.detailed : styles.compact}`}>
      <div
        className={`${styles.media} ${isDetailed ? styles.detailedMedia : styles.compactMedia}`}
        style={{ background: product.media.value }}
      >
        <ProductQuickActions />
      </div>

      <div className={isDetailed ? styles.info : undefined}>
        <p className={isDetailed ? styles.detailedBrand : styles.compactBrand}>{product.brand}</p>
        <p className={isDetailed ? styles.detailedName : styles.compactName}>{product.name}</p>
        <p className={isDetailed ? styles.detailedPrice : styles.compactPrice}>{formatMoney(product.price)}</p>

        {isDetailed && isRecommendedProduct(product) && (
          <>
            <div className={styles.meta}>
              <RatingStars rating={product.socialProof.rating} />
              <span className={styles.reviewCount}>
                ({product.socialProof.reviewCount.toLocaleString()})
              </span>
            </div>

            {product.badge?.label && (
              <span className={styles.badge}>{product.badge.label}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
