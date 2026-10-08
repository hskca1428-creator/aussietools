import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Our approach",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <article className="container prose-page">
      <div className="eyebrow green">A LITTLE LESS GUESSWORK</div>
      <h1>Tools for the decisions that actually matter.</h1>
      <p>
        AussieTools helps Australians make everyday decisions using simple,
        transparent and useful tools built around Australian life.
      </p>
      <p>
        We build a tool when there is a real decision to make: whether a quote
        pays fairly, a new job is worth the commute, or a caravan has room for
        the gear.
      </p>
      <h2>A useful place to start.</h2>
      <p>
        The Job Profit Calculator and Trade Business Toolkit are ready to use.
        Check a job, prepare a quote or invoice, define your scope and draft a
        client email. Nine more tools are planned across Money, Work, Business &
        Tradies, Home, Cars & Travel, and Caravan & Camping.
      </p>
      <h2>Show the working.</h2>
      <p>
        Every live tool explains its formula, assumptions and sources. Editable
        planning assumptions are labelled separately from Australian rules.
        Results are estimates, with enough detail to check them yourself.
      </p>
      <h2>Your figures stay yours.</h2>
      <p>
        There is no login and no database of your calculations. Your numbers are
        processed in your browser. You choose whether to copy or share a result.
      </p>
      <Link className="button" href="/business/job-profit-calculator">
        Work out your job profit
      </Link>
    </article>
  );
}
