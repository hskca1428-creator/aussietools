import Link from "next/link";
export function Newsletter() {
  return <section className="newsletter-section" aria-label="Aussie Tools email updates">
    <div><div className="eyebrow">A LITTLE CLARITY IN YOUR INBOX</div><h2>Be first to try the next useful tool.</h2><p>New tools, practical Australian tips and a chance to shape what we build. Free to join. Unsubscribe whenever you like.</p></div>
    <form className="newsletter-form" method="post" acceptCharset="UTF-8" action="https://www.aweber.com/scripts/addlead.pl">
      <input type="hidden" name="meta_web_form_id" value="972346216" />
      <input type="hidden" name="meta_split_id" value="" />
      <input type="hidden" name="listname" value="awlist6979248" />
      <input type="hidden" name="redirect" value="https://www.aweber.com/thankyou-coi.htm?m=text" />
      <input type="hidden" name="meta_redirect_onlist" value="https://www.aweber.com/thankyou-coi.htm?m=text" />
      <input type="hidden" name="meta_adtracking" value="Aussie_Tools_Updates" />
      <input type="hidden" name="meta_message" value="1" />
      <input type="hidden" name="meta_required" value="name,email" />
      <input type="hidden" name="meta_tooltip" value="" />
      <label>Name<input type="text" name="name" autoComplete="given-name" required maxLength={100} /></label>
      <label>Email address<input type="email" name="email" autoComplete="email" required maxLength={254} /></label>
      <button className="button" type="submit" name="submit">Join Aussie Tools updates</button>
      <p className="newsletter-notice">By joining, you agree to receive Aussie Tools emails through AWeber. Check your inbox for the next step. Read our <Link href="/privacy">privacy notice</Link>.</p>
    </form>
  </section>;
}
