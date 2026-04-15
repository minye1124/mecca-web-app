import styles from "./CategoryNav.module.css";

const categories: ReadonlyArray<{ href: string; label: string }> = [
    { href: "/brands", label: "Brands" },
    { href: "/new", label: "New" },
    { href: "/makeup", label: "Makeup" },
    { href: "/skincare", label: "Skincare" },
    { href: "/fragrance", label: "Fragrance" },
    { href: "/haircare", label: "Haircare" },
    { href: "/body", label: "Body" },
    { href: "/wellness", label: "Wellness" },
    { href: "/mens", label: "Men's" },
    { href: "/gifts", label: "Gifts" },
    { href: "/edits", label: "Edits" }
];

function CategoryNav() {
    return (
        <nav className={styles.categoryNav}>
            {categories.map(category => (
                <a key={category.href} href={category.href}>
                    {category.label}
                </a>
            ))}
        </nav>
    );
}

export default CategoryNav;