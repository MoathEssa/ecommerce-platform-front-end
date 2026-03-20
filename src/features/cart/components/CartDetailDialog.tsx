import {
  ImageOff,
  Mail,
  ShoppingCart,
  Tag,
  User,
  AlertTriangle,
} from "lucide-react";

import { useAdminGetCartByUserIdQuery } from "../api/cartApi";
import type { AdminCartListItemDto, CartStatus } from "../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Skeleton } from "@shared/ui/skeleton";
import { Separator } from "@shared/ui/separator";

const statusConfig: Record<CartStatus, { label: string; className: string }> = {
  Active: {
    label: "Active",
    className:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  },
  Abandoned: {
    label: "Abandoned",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  },
  Ordered: {
    label: "Ordered",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
}

interface Props {
  cart: AdminCartListItemDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail: (email: string) => void;
}

export default function CartDetailDialog({
  cart,
  open,
  onOpenChange,
  onSendEmail,
}: Props) {
  const hasUser = !!cart?.userId;

  const { data: cartDetail, isLoading } = useAdminGetCartByUserIdQuery(
    cart?.userId ?? "",
    { skip: !open || !hasUser },
  );

  const currency = cartDetail?.currencyCode ?? cart?.currencyCode ?? "USD";
  const statusCfg = cart
    ? (statusConfig[cart.status] ?? statusConfig.Active)
    : null;

  function handleSendEmail() {
    if (!cart?.userEmail) return;
    onSendEmail(cart.userEmail);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            Cart Details
            {cart && (
              <span className="font-mono text-xs text-muted-foreground font-normal">
                #{cart.cartId}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {!cart ? null : (
          <div className="space-y-5">
            {/* Customer Info */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    {cart.userEmail ? (
                      <>
                        <p className="font-semibold text-sm truncate">
                          {cart.userEmail}
                        </p>
                        {cart.userName && (
                          <p className="text-xs text-muted-foreground truncate">
                            {cart.userName}
                          </p>
                        )}
                        <p className="font-mono text-xs text-muted-foreground truncate mt-0.5">
                          ID: {cart.userId}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-sm">
                          Guest / Anonymous
                        </p>
                        {cart.sessionId && (
                          <p className="font-mono text-xs text-muted-foreground truncate">
                            Session: {cart.sessionId}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {statusCfg && (
                  <Badge variant="outline" className={statusCfg.className}>
                    {statusCfg.label}
                  </Badge>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Created: </span>
                  {new Date(cart.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Last updated: </span>
                  {new Date(cart.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div>
              <h3 className="text-sm font-semibold mb-2.5">
                Items{" "}
                <span className="text-muted-foreground font-normal">
                  ({cart.itemCount})
                </span>
              </h3>

              {!hasUser ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  Item details are only available for registered customers.
                </div>
              ) : isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-14 w-14 rounded-md shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : !cartDetail || cartDetail.items.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  This cart is empty.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {cartDetail.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-md border px-3 py-2.5"
                    >
                      {/* Image */}
                      <div className="h-14 w-14 rounded-md border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productTitle}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {item.sku}
                        </p>
                        {Object.keys(item.options).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.options).map(([k, v]) => (
                              <Badge
                                key={k}
                                variant="secondary"
                                className="text-xs px-1.5 py-0"
                              >
                                {k}: {v}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {item.warnings.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            {item.warnings[0]}
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold tabular-nums">
                          {formatCurrency(item.lineTotal, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {item.quantity} ×{" "}
                          {formatCurrency(item.unitPrice, currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coupon */}
            {(cart.couponCode || cartDetail?.coupon) && (
              <div className="flex items-center gap-2 rounded-md border bg-purple-50 dark:bg-purple-900/20 px-3 py-2.5">
                <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-sm font-medium text-purple-700 dark:text-purple-300">
                    {cartDetail?.coupon?.code ?? cart.couponCode}
                  </span>
                  {cartDetail?.coupon?.description && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {cartDetail.coupon.description}
                    </span>
                  )}
                </div>
                {cartDetail?.coupon && (
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400 tabular-nums shrink-0">
                    −
                    {formatCurrency(cartDetail.coupon.discountAmount, currency)}
                  </span>
                )}
              </div>
            )}

            {/* Totals */}
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(
                    cartDetail?.subtotal ?? cart.subtotal,
                    currency,
                  )}
                </span>
              </div>
              {(cartDetail?.discountTotal ?? cart.discountTotal) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium tabular-nums text-green-600 dark:text-green-400">
                    −
                    {formatCurrency(
                      cartDetail?.discountTotal ?? cart.discountTotal,
                      currency,
                    )}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg tabular-nums">
                  {formatCurrency(cartDetail?.total ?? cart.total, currency)}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={handleSendEmail}
                disabled={!cart.userEmail}
                title={
                  !cart.userEmail
                    ? "No email available for guest carts"
                    : undefined
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
