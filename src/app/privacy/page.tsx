import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
  return (
    <article className="container prose-page">
      <div className="eyebrow green">YOUR NUMBERS STAY YOURS</div>
      <h1>Privacy</h1>
      <p>Last updated: 9 October 2026.</p>
      <h2>Calculations</h2>
      <p>
        Your calculator inputs are processed in your browser. We do not send
        them to a server, save them to an account or include them in analytics.
        Refreshing or leaving the page clears the entered figures.
      </p>
      <h2>Trade documents</h2>
      <p>
        Quote, invoice, scope and email details remain in browser memory during
        your visit. Copying, downloading or printing a document creates a copy
        you control. We do not automatically save or send it. Your private
        profit figures are not included in client documents.
      </p>
      <h2>Email updates</h2>
      <p>
        Aussie Tools uses AWeber to manage email updates. Submitting our form sends your name and email address directly to AWeber for subscription processing and delivery of new tool announcements and practical tips. Using a calculator does not subscribe you. Unsubscribe through the link in each marketing email. Subscriber information is managed in AWeber; contact us to request access, correction or deletion. AWeber may process information overseas under its <a href="https://www.aweber.com/privacy.htm" target="_blank" rel="noreferrer">privacy policy</a>.
      </p>
      <h2>Sharing and suggestions</h2>
      <p>
        Copy and share actions include the visible calculation result. You
        choose the destination. When online suggestions are unavailable,
        downloading a suggestion saves a text file to your device and sends
        nothing to us. If online submission is enabled, the text you submit is
        sent to the configured feedback service; avoid including personal or
        sensitive information.
      </p>
      <h2>Analytics and hosting</h2>
      <p>
        {enabled
          ? "Vercel Web Analytics is enabled to measure page visits and anonymous interaction events such as copying a result. Calculation values are not sent with these events."
          : "Optional Vercel Web Analytics is disabled in this build. No analytics events are sent by the application."}{" "}
        Your hosting provider may process ordinary technical request
        information, including IP addresses and browser details, to deliver and
        secure the site.
      </p>
      <h2>External links</h2>
      <p>
        Australian source links open third-party websites with their own privacy
        practices.
      </p>
      <h2>Contact Aussie Tools</h2><p>This website is operated by Aussie Tools. For privacy questions or subscriber data requests, email <a href="mailto:support@aussietools.au">support@aussietools.au</a>. Newsletter messages use updates@aussietools.au.</p>
    </article>
  );
}
