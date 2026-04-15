import styles from "./HomeHero.module.css";

function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>New perfume</p>
        <h1 className={styles.heroHeadline}>
          The Future of
          <br />
          Fragrance
        </h1>
        <p className={styles.heroSub}>Description</p>
        <div className={styles.heroCtas}>
          <a href="/shop" className={styles.btnPrimary}>
            Shop
          </a>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
