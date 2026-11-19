import { Link, NavLink } from "react-router";
import CartBadge from "./CartBadge";

function navLinkClass({ isActive }) {
    return `site-nav__link${isActive ? " site-nav__link--active" : ""}`;
}

export default function SiteHeader() {
    return (
        <header className="site-header">
            <Link className="site-header__brand" to="/products">
                Tropical Fruits &amp; Veggies SA
            </Link>

            <nav className="site-nav" aria-label="Main navigation">
                <NavLink className={navLinkClass} to="/products" end>
                    Catalog
                </NavLink>
                <NavLink className={navLinkClass} to="/cart">
                    Cart <CartBadge />
                </NavLink>
            </nav>
        </header>
    );
}
