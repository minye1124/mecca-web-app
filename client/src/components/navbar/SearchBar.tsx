import styles from "./SearchBar.module.css";
import { SearchIcon } from "../Icons";

function SearchBar() {
    return (
        <div className={styles.searchRow}>
            <div className={styles.searchBar}>
                <span className={styles.searchIcon}>
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Search 150+ global beauty brands"
                    className={styles.searchInput}
                />
            </div>
        </div>
    );
}

export default SearchBar;