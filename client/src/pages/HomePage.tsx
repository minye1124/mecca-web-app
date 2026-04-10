import styles from "./HomePage.module.css";

// ── Static Data ──────────────────────────────────────────────

const needToKnowProducts = [
  { brand: "Korres", name: "Greek Yoghurt Probiotic Superdose Face Mask", price: "$62.00", gradient: "linear-gradient(160deg, #e8eef0 0%, #c8d8dc 100%)" },
  { brand: "PHLUR", name: "Vanilla Skin Body Oil", price: "$98.00", gradient: "linear-gradient(160deg, #f5e8c0 0%, #e0c878 100%)" },
  { brand: "Too Faced", name: "Pillow Balm Hydrating Lip Treatment", price: "$44.00", gradient: "linear-gradient(160deg, #fce0e8 0%, #f0b8c8 100%)" },
  { brand: "Tsu Lange Yor", name: "By Your Side Eau de Parfum", price: "$285.00", gradient: "linear-gradient(160deg, #e8e4f0 0%, #c8c0d8 100%)" },
  { brand: "Summer Fridays", name: "Lip Butter Balm", price: "$41.00", gradient: "linear-gradient(160deg, #f8dce0 0%, #eeb8c0 100%)" },
];

const categories = [
  { title: "New Pillow Talk", sub: "The new shade everyone's after", gradient: "linear-gradient(160deg, #f2d8cc 0%, #d4a898 100%)" },
  { title: "Smooth Things Over", sub: "Glow Recipe's Korean facial in a swipe.", gradient: "linear-gradient(160deg, #f0d8e0 0%, #d8b0c0 100%)" },
  { title: "Glow in Every Drop", sub: "Supercharged serums and treatments.", gradient: "linear-gradient(160deg, #d4e8e8 0%, #a8c8c8 100%)" },
  { title: "Fara Homidi", sub: "Makeup from a visionary artist.", gradient: "linear-gradient(160deg, #d8e0f0 0%, #a8b8d8 100%)" },
];

const curatedProducts = [
  { brand: "Summer Fridays", name: "Lip Butter Balm", price: "$41.00", rating: 4.8, reviews: 3260, badge: null, gradient: "linear-gradient(160deg, #fce0e4 0%, #f0b8c0 100%)" },
  { brand: "rhode", name: "Glazing Milk Ceramide Facial Essence", price: "$55.00", rating: 4.7, reviews: 280, badge: "TRENDING NOW", gradient: "linear-gradient(160deg, #e8e8ec 0%, #c8c8d4 100%)" },
  { brand: "ILIA Beauty", name: "Limitless Lash Mascara", price: "$50.00", rating: 4.6, reviews: 6863, badge: null, gradient: "linear-gradient(160deg, #1a1a1a 0%, #2e2e2e 100%)" },
  { brand: "rhode", name: "Pocket Blush Buildable Hydrating Cream Blush", price: "$43.00", rating: 4.7, reviews: 267, badge: null, gradient: "linear-gradient(160deg, #c4785c 0%, #a05840 100%)" },
  { brand: "rhode", name: "Peptide Lip Tint Nourishing Glaze", price: "$35.00", rating: 4.8, reviews: 313, badge: "NEW SHADE", gradient: "linear-gradient(160deg, #f4d0d8 0%, #e0a8b8 100%)" },
];

const memoArticles = [
  { tag: "MAKEUP", title: "Face Off: MECCA HQ Tries Every Single NARS Foundation", date: "February 27", read: "3 minute read", gradient: "linear-gradient(160deg, #e8d4c0 0%, #c8a888 100%)" },
  { tag: "NEW IN", title: "It's New. In March. At MECCA", date: "February 28", read: "6 minute read", gradient: "linear-gradient(160deg, #d8c0c0 0%, #c0a0a0 100%)" },
  { tag: "SKINCARE", title: "MECCA HQ Tries Out Hailey Bieber's rhode", date: "February 12", read: "5 minute read", gradient: "linear-gradient(160deg, #e0d4c8 0%, #c4b0a0 100%)" },
  { tag: "SKINCARE", title: "Got Milk? It's Skincare's Biggest Trend Right Now", date: "February 24", read: "4 minute read", gradient: "linear-gradient(160deg, #f0e8d8 0%, #d8c8b0 100%)" },
  { tag: "WELLNESS", title: "How to Get the Best Sleep of Your Life", date: "March 2", read: "4 minute read", gradient: "linear-gradient(160deg, #d4dce8 0%, #b0bcd0 100%)" },
];

const trustItems = [
  {
    label: "Chat live with our team",
    href: "/contact",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Free shipping & returns*",
    href: "/shipping",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Beauty Loop rewards",
    href: "/beauty-loop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V22H4V12" />
        <path d="M22 7H2v5h20V7z" />
        <path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    label: "250,000+ reviews",
    href: "/reviews",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
];

// ── Star Rating ───────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#000" : "none"} stroke="#000" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

// ── HomePage ──────────────────────────────────────────────────
function HomePage() {
  return (
    <main className={styles.main}>

      {/* 1. Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>New perfume</p>
          <h1 className={styles.heroHeadline}>
            The Future of<br />Fragrance
          </h1>
          <p className={styles.heroSub}>Description</p>
          <div className={styles.heroCtas}>
            <a href="/shop" className={styles.btnPrimary}>Shop</a>
          </div>
        </div>
      </section>

      {/* 2. Need to Know */}
      <section className={styles.needToKnow}>
        <div className={styles.needToKnowLeft}>
          <p className={styles.needToKnowEyebrow}>File Under:</p>
          <h2 className={styles.needToKnowTitle}>Need to Know</h2>
          <p className={styles.needToKnowSub}>The beauty products we tell all our friends about.</p>
          <a href="/shop" className={styles.shopNowLink}>Shop now</a>
        </div>
        <div className={styles.needToKnowRight}>
          <div className={styles.productScroll}>
            {needToKnowProducts.map((p) => (
              <div key={p.name} className={styles.scrollCard}>
                <div className={styles.scrollCardImage} style={{ background: p.gradient }}>
                  <button className={styles.wishlistBtn} aria-label="Wishlist">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <button className={styles.addBtn} aria-label="Add to bag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
                <p className={styles.scrollCardBrand}>{p.brand}</p>
                <p className={styles.scrollCardName}>{p.name}</p>
                <p className={styles.scrollCardPrice}>{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <a href="/shop" key={cat.title} className={styles.categoryTile}>
              <div className={styles.categoryImage} style={{ background: cat.gradient }} />
              <div className={styles.categoryBody}>
                <p className={styles.categoryTileTitle}>{cat.title}</p>
                <p className={styles.categoryTileSub}>{cat.sub}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 4. Curated for You */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Curated for you</h2>
        <div className={styles.curatedGrid}>
          {curatedProducts.map((p) => (
            <div key={p.name} className={styles.curatedCard}>
              <div className={styles.curatedImage} style={{ background: p.gradient }}>
                <button className={styles.wishlistBtn} aria-label="Wishlist">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button className={styles.addBtn} aria-label="Add to bag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
              <div className={styles.curatedInfo}>
                <p className={styles.curatedBrand}>{p.brand}</p>
                <p className={styles.curatedName}>{p.name}</p>
                <p className={styles.curatedPrice}>{p.price}</p>
                <div className={styles.curatedMeta}>
                  <Stars rating={p.rating} />
                  <span className={styles.reviewCount}>({p.reviews.toLocaleString()})</span>
                </div>
                {p.badge && <span className={styles.badge}>{p.badge}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MECCA Memo */}
      <section className={styles.section}>
        <h2 className={styles.memoHeadline}>MECCA MEMO</h2>

        {/* Featured article */}
        <div className={styles.memoFeatured}>
          <div className={styles.memoFeaturedMain} style={{ background: "linear-gradient(160deg, #6b2020 0%, #4a1818 60%, #2e1010 100%)" }} />
          <div className={styles.memoFeaturedSide}>
            <div className={styles.memoFeaturedSideImg} style={{ background: "linear-gradient(160deg, #f0e8e0 0%, #d8c8b8 100%)" }} />
            <div className={styles.memoFeaturedSideText}>
              <p className={styles.memoArticleDate}>March 31 · 4 minute read</p>
              <h3 className={styles.memoArticleTitle}>Get to Know the Icons: Meet MECCA's Most-Loved Fragrances</h3>
            </div>
          </div>
        </div>

        {/* Article row */}
        <div className={styles.memoArticleRow}>
          {memoArticles.map((a) => (
            <a href="/memo" key={a.title} className={styles.memoArticleCard}>
              <div className={styles.memoArticleImage} style={{ background: a.gradient }} />
              <p className={styles.memoArticleTitle2}>{a.title}</p>
              <p className={styles.memoArticleDate}>{a.date} · {a.read}</p>
            </a>
          ))}
        </div>

        {/* Two editorial banners */}
        <div className={styles.memoBanners}>
          <div className={styles.memoBanner} style={{ background: "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%)" }}>
            <div className={styles.memoBannerText}>
              <p className={styles.memoBannerTitle}>Explore MECCAVERSITY</p>
              <a href="/meccaversity" className={styles.memoBannerLink}>Take me there</a>
            </div>
          </div>
          <div className={styles.memoBanner} style={{ background: "linear-gradient(160deg, #c8a888 0%, #a88868 100%)" }}>
            <div className={styles.memoBannerText}>
              <p className={styles.memoBannerTitle}>The best beauty experiences</p>
              <a href="/services" className={styles.memoBannerLink}>Explore MECCA's services and events</a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. From us to you */}
      <section className={styles.trustBar}>
        <p className={styles.trustLabel}>From us to you</p>
        <div className={styles.trustItems}>
          {trustItems.map((item) => (
            <a key={item.label} href={item.href} className={styles.trustItem}>
              <span className={styles.trustIcon}>{item.icon}</span>
              <span className={styles.trustText}>{item.label}</span>
            </a>
          ))}
        </div>
      </section>

    </main>
  );
}

export default HomePage;
