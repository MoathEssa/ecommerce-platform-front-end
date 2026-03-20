import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import CartsTable from "../components/CartsTable";
import CartDetailDialog from "../components/CartDetailDialog";
import SendEmailDialog from "../components/SendEmailDialog";
import type { AdminCartListItemDto } from "../types";

export default function CartPage() {
  const [selectedCart, setSelectedCart] = useState<AdminCartListItemDto | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailTarget, setEmailTarget] = useState("");

  function openDetail(cart: AdminCartListItemDto) {
    setSelectedCart(cart);
    setDetailOpen(true);
  }

  function openSendEmail(email: string) {
    setEmailTarget(email);
    setEmailOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Cart Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all customer carts, monitor abandoned carts, and send
          re-engagement emails.
        </p>
      </div>

      {/* Carts table */}
      <CartsTable onViewDetails={openDetail} onSendEmail={openSendEmail} />

      {/* Detail dialog */}
      <CartDetailDialog
        cart={selectedCart}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSendEmail={openSendEmail}
      />

      {/* Send email dialog */}
      <SendEmailDialog
        toEmail={emailTarget}
        open={emailOpen}
        onOpenChange={setEmailOpen}
      />
    </div>
  );
}
