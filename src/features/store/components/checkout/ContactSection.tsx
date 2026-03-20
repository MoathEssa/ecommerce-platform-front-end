import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

interface Props {
  email: string;
  onChange: (email: string) => void;
}

export default function ContactSection({ email, onChange }: Props) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h3 className="text-base font-semibold text-foreground">Contact</h3>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder="your@email.com"
        />
      </div>
    </div>
  );
}
