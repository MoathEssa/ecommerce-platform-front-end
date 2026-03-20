import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useSendCartReminderEmailMutation } from "../api/cartApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

interface Props {
  toEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SendEmailDialog({
  toEmail,
  open,
  onOpenChange,
}: Props) {
  const [subject, setSubject] = useState("You left items in your cart!");
  const [body, setBody] = useState(
    "Hi there!\n\nWe noticed you left some items in your shopping cart. Complete your purchase today before they sell out!\n\nIf you have any questions, feel free to reach out to our support team.",
  );

  const [sendEmail, { isLoading }] = useSendCartReminderEmailMutation();

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required.");
      return;
    }
await sendEmail({
        toEmail,
        subject: subject.trim(),
        body: body.trim(),
      }).unwrap();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            Send Cart Reminder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="email-to">To</Label>
            <Input id="email-to" value={toEmail} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-body">Message</Label>
            <textarea
              id="email-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Write your message…"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
