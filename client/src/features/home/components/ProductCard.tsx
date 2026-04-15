import ProductQuickActions from "./ProductQuickActions";
import RatingStars from "./RatingStars";
import styles from "./ProductCard.module.css";
import type { CuratedProduct, ProductTeaser } from "../types";

type ProductCardVariant = "compact" | "detailed";

export interface ProductCardProps {
  product: ProductTeaser | CuratedProduct;
  variant: ProductCardVariant;
}

function isCuratedProduct(product: ProductTeaser | CuratedProduct): product is CuratedProduct {
  return "rating" in product && "reviews" in product;
}

function ProductCard({ product, variant }: ProductCardProps) {
  const isDetailed = variant === "detailed";
  const curatedProduct = isCuratedProduct(product) ? product : null;

  return (
    <div className={`${styles.card} ${isDetailed ? styles.detailed : styles.compact}`}>
      <div
        className={`${styles.media} ${isDetailed ? styles.detailedMedia : styles.compactMedia}`}
        style={{ background: product.gradient }}
      >
        <ProductQuickActions />
      </div>

      <div className={isDetailed ? styles.info : undefined}>
        <p className={isDetailed ? styles.detailedBrand : styles.compactBrand}>{product.brand}</p>
        <p className={isDetailed ? styles.detailedName : styles.compactName}>{product.name}</p>
        <p className={isDetailed ? styles.detailedPrice : styles.compactPrice}>{product.price}</p>

        {isDetailed && curatedProduct && (
          <>
            <div className={styles.meta}>
              <RatingStars rating={curatedProduct.rating} />
              <span className={styles.reviewCount}>
                ({curatedProduct.reviews.toLocaleString()})
              </span>
            </div>

            {curatedProduct.badge && <span className={styles.badge}>{curatedProduct.badge}</span>}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
