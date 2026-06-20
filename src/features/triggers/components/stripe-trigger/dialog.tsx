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
import { toast } from "@/components/ui/sonner";
import { CheckIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Variable = ({
  code,
  description,
}: {
  code: string;
  description: string;
}) => (
  <div className="flex items-center gap-2">
    <code
      className="
      shrink-0
      rounded-md
      border
      border-emerald-200/60
      bg-emerald-50
      px-2
      py-1
      font-mono
      text-xs
      text-emerald-800
    "
    >
      {code}
    </code>

    <span
      className="
      flex-1
      min-w-0
      truncate
      text-xs
      text-muted-foreground
    "
    >
      {description}
    </span>
  </div>
);

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const [copied, setCopied] = useState(false);

  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);

      setCopied(true);
      toast.info("Webhook URL copied");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-lg

          [&>button]:transition-all
          [&>button]:duration-200
          [&>button]:ease-out
          [&>button]:rounded-md
          [&>button]:p-1
          [&>button]:hover:bg-muted
          [&>button]:hover:scale-110
          [&>button]:active:scale-95
        "
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2">
             <Image src="/stripe.svg" alt="Stripe" width={18} height={18} />
            Stripe Trigger
          </DialogTitle>

          <DialogDescription className="text-sm">
            Connect Stripe webhooks and automatically trigger this workflow when
            payment events occur.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {/* Webhook URL */}
          <div
            className="
              rounded-xl
              border
              border-sky-200/50
              bg-gradient-to-r
              from-sky-50
              via-white
              to-cyan-50
              p-2
              space-y-2
            "
          >
            <Label htmlFor="webhook-url">Webhook URL</Label>

            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="
                  font-mono
                  text-xs
                  bg-white
                  min-w-0
                  truncate
                "
              />

              <Button
                type="button"
                size="icon"
                variant="workflowSoft"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckIcon className="size-4 text-emerald-600" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Setup Instructions */}
          <div
            className="
              rounded-xl
              border
              border-sky-200/40
              bg-gradient-to-r
              from-sky-50/60
              via-white
              to-cyan-50/40
              p-2
              space-y-2
            "
          >
            <h4 className="text-sm font-semibold text-slate-800">
              Setup Instructions
            </h4>

            <ol className="space-y-1.5 text-sm text-muted-foreground">
              {[
                "Open your Stripe Dashboard",
                "Go to Developers → Webhooks",
                "Follow the instructions to test with a local listener",
                "Replace the webhook URL above in the terminal for testing",
                "For desktop, add destination & choose the events you want to listen for (e.g., payment_intent.succeeded)",
                "Configure the endpoint with your deployed URL",
                "Send a test event from Stripe",
                "Verify the workflow executes successfully",
              ].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="
                      flex
                      size-4
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-sky-100
                      text-[10px]
                      font-semibold
                      text-sky-700
                    "
                  >
                    {i + 1}
                  </span>

                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Stripe Notes */}
          <div
            className="
              rounded-xl
              border
              border-violet-200/40
              bg-gradient-to-r
              from-violet-50/60
              via-white
              to-fuchsia-50/40
              p-3
              space-y-3
            "
          >
            <h4 className="text-sm font-semibold text-slate-800">
              Stripe Events
            </h4>

            <p className="text-xs text-muted-foreground">
              Common events include:
            </p>

            <ul className="space-y-1 text-xs text-slate-600">
              <li>• payment_intent.succeeded</li>
              <li>• payment_intent.payment_failed</li>
              <li>• checkout.session.completed</li>
              <li>• customer.subscription.created</li>
              <li>• customer.subscription.deleted</li>
            </ul>
          </div>

          {/* Variables */}
          <div
            className="
              rounded-xl
              border
              border-emerald-200/40
              bg-gradient-to-r
              from-emerald-50/60
              via-white
              to-green-50/40
              p-3
              space-y-3
            "
          >
            <h4 className="text-sm font-semibold text-slate-800">
              Available Variables
            </h4>

            <div className="space-y-2  flex-col">
              <Variable code="{{stripe.amount}}" description="Payment amount" />

              <Variable
                code="{{stripe.currency}}"
                description="Currency code"
              />

              <Variable
                code="{{stripe.customerId}}"
                description="Stripe customer ID"
              />

              <Variable
                code="{{stripe.eventType}}"
                description="Webhook event type (e.g., payment_intent.succeeded)"
              />

              <Variable
                code="{{json stripe}}"
                description="Entire Stripe payload as JSON"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
