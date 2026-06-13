"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg
        [&>button]:transition-all
        [&>button]:duration-200
        [&>button]:ease-out
        [&>button]:rounded-md
        [&>button]:p-1
        [&>button]:hover:bg-muted
        [&>button]:hover:scale-110
        [&>button]:active:scale-95"
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold">
            Stripe Trigger Configuration{" "}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Configure this webhook URL in your Stripe Dashboard to trigger this
            workflow on payment events.{" "}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={copyToClipboard}
                className="hover:scale-105 active:scale-95 transition"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
            <h4 className="text-sm font-semibold">Setup Instructions</h4>

            <ol className="space-y-2 text-sm text-muted-foreground">
              {[
                "Open your Stripe Dashboard",
                "Go to Developers → Webhooks",
                "Click 'Add endpoint'",
                "Paste the webhook URL above",
                "Select events to listen for (e.g., payment_intent.succeeded)",
                "Save and copy the signing secret",
              ].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-medium text-foreground">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
            <h4 className="text-sm font-semibold">Available Variables</h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-1">
                <code className="bg-background px-2 py-1 rounded text-xs font-mono w-fit">
                  {"{{stripe.amount}}"}
                </code>
                <span className="text-muted-foreground text-xs">
                  - Payment amount
                </span>
              </div>
              <div className="flex items-center gap-1">
                <code className="bg-background px-2 py-1 rounded text-xs font-mono w-fit">
                  {"{{stripe.currency}}"}
                </code>
                <span className="text-muted-foreground text-xs">
                  - Currency code
                </span>
              </div>
              <div className="flex items-center gap-1">
                <code className="bg-background px-2 py-1 rounded text-xs font-mono w-fit">
                  {"{{stripe.customerId}}"}
                </code>
                <span className="text-muted-foreground text-xs">
                  - Customer ID
                </span>
              </div>{" "}
              <div className="flex items-center gap-1">
                <code className="bg-background px-2 py-1 rounded text-xs font-mono w-fit">
                  {"{{json stripe}}"}
                </code>
                <span className="text-muted-foreground text-xs">
                  - Full event data as JSON
                </span>
              </div>
              <div className="flex items-center gap-1">
                <code className="bg-background px-2 py-1 rounded text-xs font-mono w-fit">
                  {"{{stripe.eventType}}"}
                </code>
                <span className="text-muted-foreground text-xs">
                  - Event type (e.g, payment_intent.succeeded)
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

