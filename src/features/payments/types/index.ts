// ── Stripe Charge Types ───────────────────────────────────────────────────────

export interface StripeAddressDto {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postalCode: string | null;
  state: string | null;
}

export interface StripeBillingDetailsDto {
  address: StripeAddressDto | null;
  email: string | null;
  name: string | null;
  phone: string | null;
}

export interface StripeCardDetailsDto {
  brand: string | null;
  country: string | null;
  expMonth: number | null;
  expYear: number | null;
  fingerprint: string | null;
  funding: string | null;
  last4: string | null;
  network: string | null;
}

export interface StripePaymentMethodDetailsDto {
  type: string;
  card: StripeCardDetailsDto | null;
}

export interface StripeChargeOutcomeDto {
  networkStatus: string | null;
  reason: string | null;
  riskLevel: string | null;
  riskScore: number | null;
  sellerMessage: string | null;
  type: string | null;
}

export interface StripeChargeDto {
  id: string;
  amount: number;
  amountCaptured: number;
  amountRefunded: number;
  balanceTransaction: string | null;
  billingDetails: StripeBillingDetailsDto | null;
  captured: boolean;
  created: string; // ISO 8601 date string
  currency: string;
  customer: string | null;
  description: string | null;
  disputed: boolean;
  failureCode: string | null;
  failureMessage: string | null;
  paid: boolean;
  paymentIntent: string | null;
  paymentMethod: string | null;
  paymentMethodDetails: StripePaymentMethodDetailsDto | null;
  receiptEmail: string | null;
  receiptNumber: string | null;
  receiptUrl: string | null;
  refunded: boolean;
  statementDescriptor: string | null;
  statementDescriptorSuffix: string | null;
  status: "succeeded" | "pending" | "failed";
  outcome: StripeChargeOutcomeDto | null;
}

export interface StripeChargeListDto {
  data: StripeChargeDto[];
  hasMore: boolean;
  lastId: string | null;
}

export interface GetChargesParams {
  limit?: number;
  startingAfter?: string;
}
