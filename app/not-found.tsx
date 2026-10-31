import Link from 'next/link';

// No metadata export: Next only reads metadata from layout/page, and the 404
// status already keeps this page out of search results.
export default function NotFound() {
  return (
    <div className="form-page-container">
      <div className="container">
        <h1 className="form-page-title">404 — Page Not Found</h1>
        <p className="form-page-description">
          The page you are looking for has moved or no longer exists. Browse our
          valve range or get in touch and we will point you the right way.
        </p>
        <p style={{ textAlign: 'center' }}>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/valves" className="btn-primary" style={{ marginLeft: 12 }}>
            View Valves
          </Link>
        </p>
      </div>
    </div>
  );
}
