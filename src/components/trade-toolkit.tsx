"use client";

import { useRef, useState } from "react";
import {
  Calculator,
  FileText,
  Receipt,
  ListChecks,
  Mail,
  Copy,
  Download,
  Printer,
  Plus,
  X,
  ShieldCheck,
} from "lucide-react";
import { JobProfit } from "./job-profit";
import {
  clientEmail,
  documentTotals,
  gstAmounts,
  hourlyChargeOut,
  markupAndMargin,
  type EmailKind,
  type QuoteItem,
} from "@/calculators/trade-toolkit";
import { money, percent } from "@/lib/site";

const tabs = [
  { id: "profit", title: "Job profit", icon: Calculator },
  { id: "quote", title: "Quote builder", icon: FileText },
  { id: "invoice", title: "Invoice", icon: Receipt },
  { id: "scope", title: "Scope of works", icon: ListChecks },
  { id: "email", title: "Client emails", icon: Mail },
  { id: "quick", title: "Quick calculators", icon: Calculator },
] as const;
type Tab = (typeof tabs)[number]["id"];
const currency = (value: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
    value,
  );
const validNumber = (value: string) =>
  value.trim() !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) >= 0 &&
  Number(value) <= 1e9;
const validDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;
function validAbn(raw: string) {
  const digits = raw.replace(/\s/g, "");
  if (!/^\d{11}$/.test(digits)) return false;
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  return (
    [...digits].reduce(
      (sum, digit, i) => sum + (Number(digit) - (i === 0 ? 1 : 0)) * weights[i],
      0,
    ) %
      89 ===
    0
  );
}
function TextField({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="toolkit-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
function ExportActions({
  text,
  name,
  printable = false,
  disabled = false,
}: {
  text: string;
  name: string;
  printable?: boolean;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Copy unavailable. Download the text instead.");
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Text file downloaded.");
  }
  return (
    <div className="toolkit-export">
      <div className="result-actions">
        <button disabled={disabled} onClick={copy}>
          <Copy size={17} />
          Copy text
        </button>
        <button disabled={disabled} onClick={download}>
          <Download size={17} />
          Download text
        </button>
        {printable && (
          <button disabled={disabled} onClick={() => window.print()}>
            <Printer size={17} />
            Print / save PDF
          </button>
        )}
      </div>
      <p role="status">{status}</p>
    </div>
  );
}

export function TradeToolkit() {
  const [active, setActive] = useState<Tab>("profit");
  const top = useRef<HTMLElement>(null);
  const [business, setBusiness] = useState("");
  const [abn, setAbn] = useState("");
  const [contact, setContact] = useState("");
  const [client, setClient] = useState("");
  const [address, setAddress] = useState("");
  const [project, setProject] = useState("");
  const [reference, setReference] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [terms, setTerms] = useState("");
  const [gst, setGst] = useState(false);
  const [notes, setNotes] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: "1", rate: "" },
  ]);
  const nextId = useRef(2);
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [timeline, setTimeline] = useState("");
  const [kind, setKind] = useState<EmailKind>("quote");
  const [tone, setTone] = useState<"friendly" | "professional">("friendly");
  const [emailDetails, setEmailDetails] = useState("");
  const numbersValid = items.every(
    (item) => validNumber(item.quantity) && validNumber(item.rate),
  );
  const numberItems: QuoteItem[] = items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    rate: Number(item.rate),
  }));
  const totals = numbersValid ? documentTotals(numberItems, gst) : null;
  const isInvoice = active === "invoice";
  const heading = isInvoice ? (gst ? "Tax invoice" : "Invoice") : "Quote";
  const missing = [
    !business.trim() && "business name",
    !client.trim() && "client name",
    !project.trim() && "job description",
    !reference.trim() && "document reference",
    !validDate(issueDate) && "valid issue date (YYYY-MM-DD)",
    !terms.trim() &&
      (isInvoice ? "payment due date / terms" : "validity / payment terms"),
    items.some(
      (item) =>
        !item.description.trim() ||
        item.description.startsWith("Quoted works —"),
    ) && "item descriptions",
    !numbersValid && "valid quantities and rates",
    gst && !validAbn(abn) && "valid ABN for GST documents",
  ].filter(Boolean);
  const documentReady = missing.length === 0 && !!totals;
  const documentText = `${heading.toUpperCase()}${documentReady ? "" : " — DRAFT"}\n${business || "[business name]"}${abn ? `\nABN: ${abn}` : ""}${contact ? `\n${contact}` : ""}\n\n${reference || "[reference]"} · ${issueDate || "[issue date]"}\nPrepared for: ${client || "[client name]"}${address ? `\n${address}` : ""}\nJob: ${project || "[job description]"}\n\n${items.map((item, i) => `${item.description || "[item description]"} | ${item.quantity || "?"} × ${validNumber(item.rate) ? currency(Number(item.rate)) : "?"} = ${totals ? currency(totals.lineTotals[i]) : "?"}`).join("\n")}\n\nSubtotal (ex GST): ${totals ? currency(totals.subtotal) : "—"}\n${gst ? "GST (10%)" : "GST (not charged)"}: ${totals ? currency(totals.gst) : "—"}\nTOTAL: ${totals ? currency(totals.total) : "—"}\n\n${isInvoice ? "Payment terms" : "Validity / payment terms"}: ${terms || "[add terms]"}${notes ? `\n\n${notes}` : ""}`;
  const scopeReady =
    !!business.trim() &&
    !!client.trim() &&
    !!project.trim() &&
    !!address.trim() &&
    !!inclusions.trim() &&
    !!exclusions.trim() &&
    !!timeline.trim();
  const scopeText = `SCOPE OF WORKS${scopeReady ? "" : " — DRAFT"}\n${business || "[business name]"}\n\nClient: ${client || "[client name]"}\nSite: ${address || "[site address]"}\nProject: ${project || "[project description]"}\n\nINCLUDED\n${inclusions || "[describe included work]"}\n\nEXCLUDED\n${exclusions || "[describe exclusions or enter None]"}\n\nTIMING / ACCESS\n${timeline || "[timing and access requirements]"}\n\nCHANGES\nDiscuss and agree any change to scope, price and timing in writing before carrying out additional work.\n\n${notes ? `NOTES\n${notes}\n\n` : ""}Review with the client before starting. This is a planning document, not a complete building contract.`;
  const emailText = clientEmail(
    kind,
    client,
    business,
    project,
    emailDetails,
    tone,
  );
  function changeTab(id: Tab) {
    setActive(id);
  }
  function prepareQuote(amount: number) {
    setItems([
      {
        id: nextId.current++,
        description: "Quoted works — replace with your job description",
        quantity: "1",
        rate: (Math.ceil(amount * 100) / 100).toFixed(2),
      },
    ]);
    setQuoteNote(
      "Your target quote has been brought across excluding GST. Add your client details and review the scope before sharing.",
    );
    setActive("quote");
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const sharedFields = (
    <>
      <TextField
        label="Your business name"
        value={business}
        onChange={setBusiness}
      />
      <TextField label="Client name" value={client} onChange={setClient} />
      <TextField
        label="Job / project description"
        value={project}
        onChange={setProject}
        multiline
      />
      <TextField
        label="Client / site address"
        value={address}
        onChange={setAddress}
      />
    </>
  );
  return (
    <section className="trade-toolkit" ref={top}>
      <div className="toolkit-ribbon">
        <span>
          <ShieldCheck size={18} />
          Free to use. Your details stay in this browser.
        </span>
        <span>From the numbers to the paperwork.</span>
      </div>
      <div
        className="toolkit-tabs"
        role="tablist"
        aria-label="Trade toolkit tools"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls="toolkit-panel"
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => changeTab(tab.id)}
            onKeyDown={(e) => {
              const index = tabs.findIndex((tab) => tab.id === active);
              let target: number | undefined;
              if (e.key === "ArrowRight") target = (index + 1) % tabs.length;
              if (e.key === "ArrowLeft")
                target = (index + tabs.length - 1) % tabs.length;
              if (e.key === "Home") target = 0;
              if (e.key === "End") target = tabs.length - 1;
              if (target !== undefined) {
                e.preventDefault();
                changeTab(tabs[target].id);
                document.getElementById(`tab-${tabs[target].id}`)?.focus();
              }
            }}
          >
            <tab.icon size={18} />
            {tab.title}
          </button>
        ))}
      </div>
      <div
        id="toolkit-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        <div hidden={active !== "profit"}>
          <JobProfit onPrepareQuote={prepareQuote} />
        </div>
        {(active === "quote" || active === "invoice") && (
          <>
            <div className="toolkit-section-heading">
              <div className="eyebrow green">
                {isInvoice
                  ? "GET THE PAPERWORK RIGHT"
                  : "TURN A GOOD PRICE INTO A CLEAR QUOTE"}
              </div>
              <h2>
                {isInvoice
                  ? "Invoice your work."
                  : "Build a quote you can send."}
              </h2>
              <p>
                {isInvoice
                  ? "The items and client details carry over from your quote. Check them before issuing an invoice."
                  : "Add your details, itemise the work and preview a client-ready document."}
              </p>
            </div>
            {quoteNote && (
              <p className="toolkit-transfer" role="status">
                {quoteNote}
              </p>
            )}
            <div className="toolkit-document-grid">
              <section className="toolkit-form">
                <h3>Business & client</h3>
                {sharedFields}
                <div className="field-pair">
                  <TextField label="ABN" value={abn} onChange={setAbn} />
                  <TextField
                    label="Business contact details"
                    value={contact}
                    onChange={setContact}
                  />
                </div>
                <h3>Document details</h3>
                <div className="field-pair">
                  <TextField
                    label={isInvoice ? "Invoice reference" : "Quote reference"}
                    value={reference}
                    onChange={setReference}
                  />
                  <TextField
                    label="Issue date (YYYY-MM-DD)"
                    value={issueDate}
                    onChange={setIssueDate}
                    placeholder="2026-10-08"
                  />
                </div>
                <h3>
                  Items <small>All rates excluding GST</small>
                </h3>
                {items.map((item, index) => (
                  <div className="quote-item" key={item.id}>
                    <TextField
                      label={`Item ${index + 1} description`}
                      value={item.description}
                      onChange={(value) =>
                        setItems(
                          items.map((row) =>
                            row.id === item.id
                              ? { ...row, description: value }
                              : row,
                          ),
                        )
                      }
                    />
                    <div className="quote-item-numbers">
                      <TextField
                        label={`Item ${index + 1} quantity`}
                        value={item.quantity}
                        type="number"
                        onChange={(value) =>
                          setItems(
                            items.map((row) =>
                              row.id === item.id
                                ? { ...row, quantity: value }
                                : row,
                            ),
                          )
                        }
                      />
                      <TextField
                        label={`Item ${index + 1} unit rate ($)`}
                        value={item.rate}
                        type="number"
                        onChange={(value) =>
                          setItems(
                            items.map((row) =>
                              row.id === item.id
                                ? { ...row, rate: value }
                                : row,
                            ),
                          )
                        }
                      />
                      <button
                        className="remove-item"
                        disabled={items.length === 1}
                        aria-label={`Remove item ${index + 1}`}
                        onClick={() =>
                          setItems(items.filter((row) => row.id !== item.id))
                        }
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="toolkit-secondary"
                  onClick={() =>
                    setItems([
                      ...items,
                      {
                        id: nextId.current++,
                        description: "",
                        quantity: "1",
                        rate: "",
                      },
                    ])
                  }
                >
                  <Plus size={17} />
                  Add item
                </button>
                <label className="checkbox-label toolkit-gst">
                  <input
                    type="checkbox"
                    checked={gst}
                    onChange={(e) => setGst(e.target.checked)}
                  />
                  I am GST registered; all items are taxable at 10%
                </label>
                <p className="field-note">
                  Do not charge GST if you are not registered. For GST-free or
                  mixed items, use your accounting software.
                </p>
                <TextField
                  label={
                    isInvoice
                      ? "Payment due date / terms"
                      : "Quote validity / payment terms"
                  }
                  value={terms}
                  onChange={setTerms}
                  placeholder={
                    isInvoice
                      ? "e.g. Due 22 October; bank details below"
                      : "e.g. Valid for 30 days; payment on completion"
                  }
                />
                <TextField
                  label="Notes, exclusions & payment details"
                  value={notes}
                  onChange={setNotes}
                  multiline
                />
                <p className="field-note">
                  ABN format is checked locally. Registration status is not
                  verified.
                </p>
              </section>
              <section className="toolkit-preview-column">
                <div className="document-preview printable-document">
                  <div className="document-brand">
                    {business || "YOUR BUSINESS"}
                    <small>
                      {abn ? `ABN ${abn}` : "Add your business details"}
                    </small>
                    <small>{contact}</small>
                  </div>
                  <div className="document-heading">
                    <h3>{heading}</h3>
                    <span
                      className={documentReady ? "badge live-badge" : "badge"}
                    >
                      {documentReady ? "Ready for your review" : "Draft"}
                    </span>
                  </div>
                  <div className="document-meta">
                    <div>
                      <small>PREPARED FOR</small>
                      <strong>{client || "Client name"}</strong>
                      <span>{address}</span>
                    </div>
                    <div>
                      <small>REFERENCE / DATE</small>
                      <strong>{reference || "Add a reference"}</strong>
                      <span>{issueDate || "Add an issue date"}</span>
                    </div>
                  </div>
                  <p className="document-project">
                    {project || "Describe the job"}
                  </p>
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id}>
                          <td>{item.description || "Item description"}</td>
                          <td>{item.quantity || "—"}</td>
                          <td>
                            {validNumber(item.rate)
                              ? currency(Number(item.rate))
                              : "—"}
                          </td>
                          <td>
                            {totals ? currency(totals.lineTotals[index]) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="document-totals">
                    <div>
                      <span>Subtotal (ex GST)</span>
                      <strong>
                        {totals ? currency(totals.subtotal) : "—"}
                      </strong>
                    </div>
                    <div>
                      <span>{gst ? "GST (10%)" : "GST (not charged)"}</span>
                      <strong>{totals ? currency(totals.gst) : "—"}</strong>
                    </div>
                    <div className="document-grand-total">
                      <span>Total AUD</span>
                      <strong>{totals ? currency(totals.total) : "—"}</strong>
                    </div>
                  </div>
                  <div className="document-notes">
                    <strong>
                      {isInvoice ? "Payment terms" : "Validity / payment terms"}
                    </strong>
                    <p>{terms || "Add your terms"}</p>
                    {notes && <p>{notes}</p>}
                  </div>
                </div>
                {!documentReady && (
                  <p className="toolkit-validation" role="status">
                    To export, add: {missing.join(", ")}.
                  </p>
                )}
                <ExportActions
                  text={documentText}
                  name={`aussietools-${isInvoice ? "invoice" : "quote"}`}
                  printable
                  disabled={!documentReady}
                />
                {!isInvoice && (
                  <button
                    className="toolkit-secondary"
                    onClick={() => {
                      setActive("invoice");
                      setReference("");
                      setTerms("");
                      setQuoteNote(
                        "Quote items and client details copied. Add an invoice reference and payment terms before issuing.",
                      );
                    }}
                  >
                    Use these items in an invoice
                  </button>
                )}
                <p className="field-note">
                  Review before sending. Tax invoices need your identity, ABN,
                  date, item details, GST and buyer identity for sales of $1,000
                  or more.{" "}
                  <a
                    href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/tax-invoices"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ATO tax invoice guidance
                  </a>
                  .
                </p>
              </section>
            </div>
          </>
        )}
        {active === "scope" && (
          <>
            <div className="toolkit-section-heading">
              <div className="eyebrow green">GET ON THE SAME PAGE</div>
              <h2>Make the scope clear.</h2>
              <p>
                Define what is included, what is excluded and how the work will
                happen.
              </p>
            </div>
            <div className="toolkit-document-grid">
              <section className="toolkit-form">
                {sharedFields}
                <TextField
                  label="Included work"
                  value={inclusions}
                  onChange={setInclusions}
                  multiline
                />
                <TextField
                  label="Excluded work"
                  value={exclusions}
                  onChange={setExclusions}
                  multiline
                />
                <TextField
                  label="Timeline & site access"
                  value={timeline}
                  onChange={setTimeline}
                  multiline
                />
                <TextField
                  label="Additional notes"
                  value={notes}
                  onChange={setNotes}
                  multiline
                />
              </section>
              <section className="toolkit-preview-column">
                <div className="document-preview printable-document text-document">
                  <pre>{scopeText}</pre>
                </div>
                {!scopeReady && (
                  <p className="toolkit-validation">
                    Add business, client, site, project, included work,
                    exclusions and timing to export.
                  </p>
                )}
                <ExportActions
                  text={scopeText}
                  name="aussietools-scope"
                  printable
                  disabled={!scopeReady}
                />
              </section>
            </div>
          </>
        )}
        {active === "email" && (
          <>
            <div className="toolkit-section-heading">
              <div className="eyebrow green">
                A FEW WORDS THAT SAVE YOU TIME
              </div>
              <h2>Write a clear client email.</h2>
              <p>
                Choose a situation, add the facts and edit the draft. Nothing is
                sent automatically.
              </p>
            </div>
            <div className="toolkit-document-grid">
              <section className="toolkit-form">
                <label className="toolkit-field">
                  <span>Email purpose</span>
                  <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value as EmailKind)}
                  >
                    <option value="quote">Quote follow-up</option>
                    <option value="payment">Payment reminder</option>
                    <option value="schedule">Scheduling</option>
                    <option value="delay">Delay notice</option>
                    <option value="complete">Job completion</option>
                    <option value="review">Review request</option>
                  </select>
                </label>
                <TextField
                  label="Your business name"
                  value={business}
                  onChange={setBusiness}
                />
                <TextField
                  label="Client name"
                  value={client}
                  onChange={setClient}
                />
                <TextField
                  label="Job / project"
                  value={project}
                  onChange={setProject}
                />
                <label className="toolkit-field">
                  <span>Tone</span>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as typeof tone)}
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                  </select>
                </label>
                <TextField
                  label="Facts to include"
                  value={emailDetails}
                  onChange={setEmailDetails}
                  multiline
                  placeholder="Add invoice references, amounts, dates or a review link. Check they are correct."
                />
              </section>
              <section className="toolkit-preview-column">
                <div className="document-preview text-document">
                  <pre>{emailText}</pre>
                </div>
                <ExportActions
                  text={emailText}
                  name="aussietools-client-email"
                  disabled={
                    !business.trim() || !client.trim() || !project.trim()
                  }
                />
                <p className="field-note">
                  Template-based draft using your details. Read it before
                  sending from your own email account.
                </p>
              </section>
            </div>
          </>
        )}
        {active === "quick" && <QuickCalculators />}
      </div>
      <div className="toolkit-footnote">
        <ShieldCheck size={17} />
        <p>
          No accounts or automatic saving. Details carry across tabs during this
          visit; refreshing clears them. Exports contain only the document you
          see, never your private profit calculation.
        </p>
      </div>
    </section>
  );
}

function QuickCalculators() {
  const [income, setIncome] = useState("100000");
  const [overhead, setOverhead] = useState("30000");
  const [hours, setHours] = useState("30");
  const [weeks, setWeeks] = useState("48");
  const [margin, setMargin] = useState("20");
  const [cost, setCost] = useState("1000");
  const [markup, setMarkup] = useState("30");
  const [amount, setAmount] = useState("110");
  const [includes, setIncludes] = useState(true);
  const rate =
    [income, overhead, hours, weeks, margin].every(validNumber) &&
    Number(hours) > 0 &&
    Number(hours) <= 168 &&
    Number(weeks) > 0 &&
    Number(weeks) <= 52 &&
    Number(margin) < 100
      ? hourlyChargeOut(
          Number(income),
          Number(overhead),
          Number(hours),
          Number(weeks),
          Number(margin),
        )
      : null;
  const mark = [cost, markup].every(validNumber)
    ? markupAndMargin(Number(cost), Number(markup))
    : null;
  const gst = validNumber(amount) ? gstAmounts(Number(amount), includes) : null;
  return (
    <>
      <div className="toolkit-section-heading">
        <div className="eyebrow green">SMALL CALCULATIONS. BETTER CALLS.</div>
        <h2>Check the numbers behind your quote.</h2>
        <p>All prices are AUD. Charge-out and markup results exclude GST.</p>
      </div>
      <div className="quick-grid">
        <section className="quick-card">
          <span className="icon-tile green">
            <Calculator />
          </span>
          <h3>What should you charge per hour?</h3>
          <TextField
            label="Annual owner pay / labour cost ($)"
            type="number"
            value={income}
            onChange={setIncome}
          />
          <TextField
            label="Annual overhead ($)"
            type="number"
            value={overhead}
            onChange={setOverhead}
          />
          <div className="field-pair">
            <TextField
              label="Billable hours / week"
              type="number"
              value={hours}
              onChange={setHours}
            />
            <TextField
              label="Working weeks / year"
              type="number"
              value={weeks}
              onChange={setWeeks}
            />
          </div>
          <TextField
            label="Target profit margin (%)"
            type="number"
            value={margin}
            onChange={setMargin}
          />
          <div className="quick-answer">
            <small>Planning charge-out rate, ex GST</small>
            <strong>
              {rate ? `${currency(rate.chargeOut)}/hr` : "Check inputs"}
            </strong>
          </div>
          <p>
            Annual pay plus overhead, divided by billable hours, then adjusted
            for your margin. Allow for leave, admin, unpaid travel and
            cancellations in billable time. This is a selling rate, not your
            labour cost.
          </p>
        </section>
        <section className="quick-card">
          <span className="icon-tile gold">
            <Calculator />
          </span>
          <h3>Markup is not your margin.</h3>
          <TextField
            label="Cost excluding recoverable GST ($)"
            type="number"
            value={cost}
            onChange={setCost}
          />
          <TextField
            label="Markup (%)"
            type="number"
            value={markup}
            onChange={setMarkup}
          />
          <div className="quick-answer">
            <small>Selling price, ex GST</small>
            <strong>{mark ? currency(mark.price) : "Check inputs"}</strong>
          </div>
          <p>
            {mark
              ? `That gives ${currency(mark.profit)} profit and a ${percent(mark.margin)} margin.`
              : "Enter valid non-negative numbers."}
          </p>
          <p>Price = cost × (1 + markup). Margin = profit ÷ price × 100.</p>
        </section>
        <section className="quick-card">
          <span className="icon-tile blue">
            <Receipt />
          </span>
          <h3>Add or remove GST.</h3>
          <TextField
            label="Amount ($)"
            type="number"
            value={amount}
            onChange={setAmount}
          />
          <label className="toolkit-field">
            <span>Amount entered</span>
            <select
              value={includes ? "inclusive" : "exclusive"}
              onChange={(e) => setIncludes(e.target.value === "inclusive")}
            >
              <option value="inclusive">Includes 10% GST</option>
              <option value="exclusive">Excludes GST</option>
            </select>
          </label>
          <div className="quick-answer">
            <small>Total including GST</small>
            <strong>{gst ? currency(gst.incGst) : "Check inputs"}</strong>
          </div>
          {gst && (
            <div className="quick-breakdown">
              <p>
                Ex GST <strong>{currency(gst.exGst)}</strong>
              </p>
              <p>
                GST <strong>{currency(gst.gst)}</strong>
              </p>
            </div>
          )}
          <p>
            For fully taxable supplies at 10%. Add GST by multiplying by 1.1;
            remove it by dividing by 1.1.
          </p>
        </section>
      </div>
    </>
  );
}
