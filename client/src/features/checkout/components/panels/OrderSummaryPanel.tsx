import { useState } from "react";

import type { OrderSummaryContent, PricingLine } from "../../types";
import { formatMoney } from "../../../../utils/money";
import { ChevronDownIcon } from "../Icons";

import styles from "./OrderSummaryPanel.module.css";

interface OrderSummaryPanelProps {
    summary: OrderSummaryContent;
}

function renderPricingLine(line: PricingLine) {
    if (line.displayValue) {
        return line.displayValue;
    }

    if (line.money) {
        return formatMoney(line.money);
    }

    return "";
}

function OrderSummaryPanel({ summary }: OrderSummaryPanelProps) {
    const [isBagExpanded, setBagExpanded] = useState(false);

    const visibleItems = summary.items.filter((item) => item.quantity > 0);

    const totalQuantity = visibleItems.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    return (
        <section className={styles.section} aria-label="Order summary">
            <div className={styles.summaryCard}>
                <header className={styles.summaryHeader}>
                    <h2 className={styles.summaryTitle}>{summary.title}</h2>
                </header>

                <ul className={styles.pricingList}>
                    {summary.pricingLines.map((line) => {
                        const rowClassName = [
                            styles.pricingRow,
                            line.tone === "muted" ? styles.pricingRowMuted : "",
                            line.tone === "total" ? styles.pricingRowTotal : ""
                        ].filter(Boolean).join(" ");

                        return (
                            <li key={line.id} className={rowClassName}>
                                <span>{line.label}</span>
                                <span>{renderPricingLine(line)}</span>
                            </li>
                        );
                    })}
                </ul>

                {summary.beautyLoopPreview ? (
                    <div className={styles.beautyLoopSection}>
                        <p className={styles.beautyLoopTitle}>{summary.beautyLoopPreview.title}</p>

                        {summary.beautyLoopPreview.points !== undefined ? (
                            <p className={styles.beautyLoopPoints}>
                                Estimated points: {summary.beautyLoopPreview.points}
                            </p>
                        ) : null}

                        <p className={styles.beautyLoopDescription}>
                            {summary.beautyLoopPreview.description}
                        </p>
                    </div>
                ) : null}
            </div>

            <div className={styles.bagCard}>
                <button
                    type="button"
                    className={styles.bagToggle}
                    aria-expanded={isBagExpanded}
                    onClick={() => setBagExpanded((current) => !current)}
                >
                    <span className={styles.bagTitle}>
                        My Bag - {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
                    </span>

                    <ChevronDownIcon
                        className={[
                            styles.bagChevron,
                            isBagExpanded ? styles.bagChevronExpanded : "",
                        ].filter(Boolean).join(" ")}
                    />
                </button>

                {isBagExpanded ? (
                    visibleItems.length > 0 ? (
                        <ul className={styles.itemsList}>
                            {visibleItems.map((item) => (
                                <li key={item.id} className={styles.itemRow}>
                                    {item.image ? (
                                        <img
                                            src={item.image.src}
                                            alt={item.image.alt}
                                            loading="lazy"
                                            decoding="async"
                                            className={styles.itemImage}
                                        />
                                    ) : (<div className={styles.itemImagePlaceholder} aria-hidden="true" />)
                                    }


                                    <div className={styles.itemBody}>
                                        <div className={styles.itemDetails}>
                                            <p className={styles.itemBrand}>{item.brand}</p>
                                            <p className={styles.itemName}>{item.name}</p>

                                            {item.sku ? (
                                                <p className={styles.itemMeta}>{item.sku}</p>
                                            ) : null}

                                            {item.variant ? (
                                                <p className={styles.itemMeta}>{item.variant}</p>
                                            ) : null}
                                        </div>

                                        <div className={styles.itemFooter}>
                                            <p className={styles.itemQuantity}>Qty {item.quantity}</p>
                                            <p className={styles.itemPrice}>{formatMoney(item.lineTotal)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (<p className={styles.emptyState}>Your bag is empty.</p>)
                ) : null}

            </div>
        </section>
    );
}

export default OrderSummaryPanel;