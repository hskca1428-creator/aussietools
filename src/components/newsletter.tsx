import Link from "next/link";

export function Newsletter() {
  const configuredUrl = process.env.NEXT_PUBLIC_NEWSLETTER_URL;
  if (!configuredUrl) return null;
  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  return (
    <section className="newsletter-section">
      <div>
        <div className="eyebrow">A LITTLE CLARITY IN YOUR INBOX</div>
        <h2>Be first to try the next useful tool.</h2>
        <p>
          New tools, practical Australian tips and a chance to shape what we
          build. Join through our email provider’s signup form. Unsubscribe
          whenever you like.
        </p>
      </div>
      <Link className="button" href={url.href} target="_blank" rel="noreferrer">
        Join the AussieTools list
      </Link>
    </section>
  );
}
