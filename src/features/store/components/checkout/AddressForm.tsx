import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import type { CheckoutAddress } from "../../types";

interface AddressFormProps {
  title: string;
  address: CheckoutAddress;
  onChange: (address: CheckoutAddress) => void;
}

export default function AddressForm({
  title,
  address,
  onChange,
}: AddressFormProps) {
  const update = (field: keyof CheckoutAddress, value: string) =>
    onChange({ ...address, [field]: value });

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${title}-fullName`}>Full Name *</Label>
          <Input
            id={`${title}-fullName`}
            value={address.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-phone`}>Phone</Label>
          <Input
            id={`${title}-phone`}
            value={address.phone ?? ""}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${title}-line1`}>Address Line 1 *</Label>
        <Input
          id={`${title}-line1`}
          value={address.line1}
          onChange={(e) => update("line1", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${title}-line2`}>Address Line 2</Label>
        <Input
          id={`${title}-line2`}
          value={address.line2 ?? ""}
          onChange={(e) => update("line2", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`${title}-city`}>City *</Label>
          <Input
            id={`${title}-city`}
            value={address.city}
            onChange={(e) => update("city", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-region`}>Region</Label>
          <Input
            id={`${title}-region`}
            value={address.region ?? ""}
            onChange={(e) => update("region", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-postalCode`}>Postal Code</Label>
          <Input
            id={`${title}-postalCode`}
            value={address.postalCode ?? ""}
            onChange={(e) => update("postalCode", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${title}-country`}>Country *</Label>
        <Input
          id={`${title}-country`}
          value={address.country}
          onChange={(e) => update("country", e.target.value)}
          required
        />
      </div>
    </div>
  );
}
