import { Link } from "react-router";

export default function NotFoundPage() {
    return (
        <main className="catalog-page">
            <section className="not-found" aria-labelledby="not-found-title">
                <p className="eyebrow">404</p>
                <h1 id="not-found-title">Page not found</h1>
                <p>The page you requested does not exist.</p>
                <p>
                    <Link to="/products">Return to the catalog</Link>
                </p>
            </section>
        </main>
    );
}
