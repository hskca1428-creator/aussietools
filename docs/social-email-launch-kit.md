# AussieTools — social and email launch kit

Prepared 8 October 2026. These are drafts for the owner to review and publish. No accounts have been created or posts sent. Suggested handles have not been checked for availability.

## Brand basics

Display name: **AussieTools**

Try **@AussieToolsAU** consistently. If unavailable, try **@UseAussieTools**. Avoid changing the spelling between platforms.

Website: https://aussietools.au

Short bio:

> Practical tools for real Australian decisions. Work it out. Compare your options. Make a better call. Free tools at aussietools.au.

Business profile description:

> AussieTools helps Australians make everyday decisions with simple, transparent tools. From pricing a tradie job to preparing a clear quote, we show the working so you can check the numbers. No signup needed to use our tools.

Profile image direction: a bold yellow A on deep green, using the site's existing favicon/brand system. Use the same square image everywhere. Cover line: “A little clarity. A better decision.” Deep green background, yellow accent, aussietools.au clearly visible. Use actual product screenshots for posts. Export graphics separately when final handles are confirmed.

## Platforms and effort

| Platform | Role | Starting cadence |
| --- | --- | --- |
| Facebook Page | Practical demonstrations and discussion with Australian small businesses | 2 useful posts each week |
| Instagram professional profile | Visual before/after results, carousels and short demos | Reuse 2 posts + 1 short demo each week |
| TikTok | Short examples of a costly mistake and how to check it | Reuse the same weekly demo |
| YouTube | Searchable walkthroughs and Shorts | Same demo as a Short; one full walkthrough initially |
| LinkedIn Page | Business owners, pricing, margin and product progress | 1 business-focused post each week |
| Threads / X | Reserve the matching handle; publish selectively | Reuse concise lessons when worthwhile |

My recommended active focus is Facebook and Instagram initially, with one video reused across TikTok and YouTube. Reserve the wider presence, but avoid creating seven separate content schedules. This is an editorial recommendation, not a claim about guaranteed reach.

Use the new domain email for ownership/recovery where supported. Facebook Pages are administered through an existing personal account; do not create a fictional personal profile for the brand. The owner should complete passwords, verification and any account terms. Keep recovery codes securely and use two-factor authentication. Do not give me passwords in chat.

## First seven posts

Use the toolkit link only after the new release is verified live. Otherwise use the existing Job Profit link.

### 1. Launch / pinned post

> A busy job is not always a profitable job.
>
> AussieTools is built to make everyday Australian decisions easier. Start with your materials, time, travel and expenses. See the margin before you lock in the quote.
>
> Try it with a recent job: https://aussietools.au/business/job-profit-calculator
>
> What is the cost you most often forget to include?

Visual: actual calculator screenshot showing job profit and margin. Do not show a customer's details.

### 2. Margin versus markup

> A $1,000 job cost plus 30% markup gives a $1,300 selling price. Your margin is 23.1%, not 30%.
>
> For a 30% margin, that same job needs about $1,429 excluding GST.
>
> Different formulas. A meaningful difference to your quote. Check your own numbers with AussieTools.

Visual: two prices side by side with the formulas. Caption: illustrative example, before tax.

### 3. Your time is a cost

> The money left after buying materials is not all profit. Your own hours count too.
>
> Try adding your labour cost before calling the rest profit. Include pickup, preparation, travel and cleanup.
>
> Would your last quote look different?

### 4. Twelve more hours

> In our example job, another 12 owner hours at $65/hour adds $780 to the cost. The margin moves from 33.2% to 24.0%.
>
> Before you send a quote, try the “what if it takes longer?” check.
>
> Example only — put in your own costs and hours.

### 5. From price to paperwork

> Work out the price. Write down the scope. Make the quote clear.
>
> The AussieTools Trade Toolkit brings job profit, quote and invoice documents, scope planning and client email drafts into one free workspace.
>
> https://aussietools.au/business/trade-toolkit

Publish only after release. Visual: three actual screenshots, with fictional business/client details.

### 6. Build with us

> We are starting small and making each tool useful.
>
> What Australian decision do you still work out with a spreadsheet, a notepad or a guess?
>
> Tell us the problem, not just the calculator name. Your next good idea might be our next tool.

### 7. Email list invitation

> Want to be first to try the next AussieTools release?
>
> Join for new tools, practical tips and the chance to shape what we build. You can unsubscribe any time.
>
> [Insert verified signup link]

Publish only after a live, tested signup and unsubscribe flow exists.

## One reusable 25-second video

0–4 seconds: “Is your quote actually profitable?” Show a fictional quote of $8,500.

4–12 seconds: enter materials, owner hours and travel. Narration: “Count the whole job, including your own time.”

12–20 seconds: show $2,822 profit and 33.2% margin; change the extra-hours scenario. “Twelve more hours changes the picture.”

20–25 seconds: “Check your next quote at aussietools.au.” End card using existing green and yellow branding. Add captions and “Illustrative estimate, before income tax.”

## Domain email

Suggested public address: **hello@aussietools.au**. Optional alias: **support@aussietools.au**, both delivered to the same inbox. A separate **updates@aussietools.au** sender is useful for the newsletter, but not essential at the start.

Mailbox hosting and an email marketing list are separate services. Follow the mailbox provider's MX/SPF/DKIM instructions while preserving Vercel's website records. Authenticate the marketing sender with the list provider's records. Avoid duplicate SPF TXT records; use the provider's guidance to combine authorised senders.

## Email list — recommended starting setup

If no existing preference, use **Brevo** with a hosted double opt-in signup form. This avoids storing subscriber data in our application and works with a single configured URL. Its free plan currently advertises 300 sends/day; check current limits before choosing a plan. No paid subscription is needed for the initial test.

1. Create the owner-controlled account using the domain email.
2. Create list: “AussieTools updates”.
3. Set sender name: AussieTools. Sender: hello@aussietools.au or updates@aussietools.au.
4. Authenticate the sending domain using provider instructions.
5. Create a hosted signup form collecting email only; first name optional. Use explicit consent, double opt-in and bot protection.
6. Consent copy: “Email me AussieTools updates, new tools and practical Australian tips. I can unsubscribe at any time.” Link to the site's privacy notice.
7. Provide the actual operator identity, contact and any address the provider requires in the email footer.
8. In Vercel set `NEXT_PUBLIC_NEWSLETTER_URL` to the verified HTTPS signup URL, then redeploy. The prepared site component appears on the homepage and tool pages only when this is configured.
9. Test with your own address: signup, confirmation, welcome message, unsubscribe. Confirm no subscription before confirmation and no further marketing after unsubscribe.
10. Add confirmed social links to the site only once those profiles exist.

Australian commercial email needs consent, sender identification and a working unsubscribe mechanism. Double opt-in is our recommended operational practice, not a claim that Australian law mandates that particular method. Do not purchase lists or automatically add people who use a calculator.

## Welcome email draft

Subject: A little clarity — welcome to AussieTools

> Thanks for joining AussieTools.
>
> We build practical tools for real Australian decisions, with the formulas and assumptions shown.
>
> Start with the Job Profit Calculator: https://aussietools.au/business/job-profit-calculator
>
> Try a recent job and see what is left after materials, labour, travel and expenses. Then ask what happens if it takes longer.
>
> What should we build next? Reply with one decision you would like help working out.
>
> AussieTools
> [Operator identity and contact details]
> [Provider-managed unsubscribe link]

## First-month measures

Track useful tool visits, completed confirmed subscriptions, replies, repeat use and which questions people ask. Use distinct UTM links for social channels. Never include calculator or client details in analytics. Start with organic demonstrations before paying for reach.

## Reference sources

- Toolkit reviewed: https://aussiework.au/trade-business-toolkit/
- Brevo plans: https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans
- Brevo forms: https://help.brevo.com/hc/en-us/sections/202171729
- Australian email rules: https://www.acma.gov.au/avoid-sending-spam
- Facebook Page usernames: https://www.facebook.com/help/1671339099618123/
- YouTube handles: https://support.google.com/youtube/answer/11585688

## What the owner needs to supply

- Confirmed domain email and preferred email list provider.
- Actual operator/business identity and privacy contact.
- Hosted signup form URL after it is created.
- Confirmed social profile handles/links. Drafts above are ready to adapt.
