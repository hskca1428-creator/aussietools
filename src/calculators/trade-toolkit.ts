import { australianBusinessData } from "@/data/australia/business";

export type QuoteItem = {
  id: number;
  description: string;
  quantity: number;
  rate: number;
};
const round = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;
function nonNegative(values: number[]) {
  if (
    values.some((value) => !Number.isFinite(value) || value < 0 || value > 1e9)
  ) {
    throw new Error("Enter valid non-negative numbers.");
  }
}

export function documentTotals(items: QuoteItem[], gstRegistered: boolean) {
  nonNegative(items.flatMap((item) => [item.quantity, item.rate]));
  const lineTotals = items.map((item) => round(item.quantity * item.rate));
  const subtotal = round(lineTotals.reduce((total, value) => total + value, 0));
  const gst = gstRegistered
    ? round(subtotal * australianBusinessData.gstRate)
    : 0;
  return { lineTotals, subtotal, gst, total: round(subtotal + gst) };
}

export function hourlyChargeOut(
  income: number,
  overhead: number,
  hours: number,
  weeks: number,
  margin: number,
) {
  nonNegative([income, overhead, hours, weeks, margin]);
  if (!hours || !weeks || margin >= 100)
    throw new Error(
      "Billable time must be greater than zero and margin below 100%.",
    );
  const billableHours = hours * weeks;
  const costPerHour = (income + overhead) / billableHours;
  return {
    billableHours,
    costPerHour,
    chargeOut: costPerHour / (1 - margin / 100),
  };
}

export function markupAndMargin(cost: number, markup: number) {
  nonNegative([cost, markup]);
  const price = cost * (1 + markup / 100);
  return {
    price,
    profit: price - cost,
    margin: price > 0 ? ((price - cost) / price) * 100 : null,
  };
}

export function gstAmounts(amount: number, includesGst: boolean) {
  nonNegative([amount]);
  const exGst = includesGst
    ? amount / (1 + australianBusinessData.gstRate)
    : amount;
  const gst = exGst * australianBusinessData.gstRate;
  return { exGst: round(exGst), gst: round(gst), incGst: round(exGst + gst) };
}

export type EmailKind =
  | "quote"
  | "payment"
  | "schedule"
  | "delay"
  | "complete"
  | "review";
export function clientEmail(
  kind: EmailKind,
  client: string,
  business: string,
  project: string,
  details: string,
  tone: "friendly" | "professional",
) {
  const greeting = `${tone === "friendly" ? "Hi" : "Hello"} ${client || "[client name]"},`;
  const job = project || "[job description]";
  const copy: Record<EmailKind, { subject: string; body: string }> = {
    quote: {
      subject: `Following up on your quote — ${job}`,
      body: `I’m following up on the quote for ${job}. Please let me know if you have any questions about the scope or pricing, or if you would like to discuss the next step.`,
    },
    payment: {
      subject: `Invoice reminder — ${job}`,
      body: `I’m checking in about the invoice for ${job}. Please confirm the payment status when you have a moment. If payment has already been made, thank you — please disregard this reminder.`,
    },
    schedule: {
      subject: `Arranging your job — ${job}`,
      body: `I’d like to confirm a suitable time for ${job}. Please let me know whether the proposed timing below works for you and whether there are any site access requirements we should know about.`,
    },
    delay: {
      subject: `Timing update — ${job}`,
      body: `I’m writing to update you on the timing for ${job}. The details below explain the change and proposed next step. Please let me know if the revised timing creates any difficulties.`,
    },
    complete: {
      subject: `Job completion — ${job}`,
      body: `The work on ${job} is complete. Please review it and let me know if there is anything you would like to discuss. Relevant handover or follow-up details are below.`,
    },
    review: {
      subject: `Your feedback on ${job}`,
      body: `Thank you for choosing us for ${job}. If you have a moment, we would appreciate your feedback on the work and your experience. You can reply to this message or use the review link below.`,
    },
  };
  return `Subject: ${copy[kind].subject}\n\n${greeting}\n\n${copy[kind].body}${details.trim() ? `\n\n${details.trim()}` : ""}\n\n${tone === "friendly" ? "Thanks" : "Kind regards"},\n${business || "[your business name]"}`;
}
