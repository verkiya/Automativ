"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({
  open,
  onOpenChange,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          border-white/70
          bg-white
          shadow-[0_25px_80px_rgba(37,99,235,0.10)]
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Manual Trigger
          </DialogTitle>

          <DialogDescription>
            Node information and usage details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div
            className="
              rounded-2xl
              border
              border-sky-100
              bg-gradient-to-r
              from-sky-50
              via-white
              to-cyan-50
              p-4
            "
          >
            <p className="font-medium text-slate-800">
              How it works
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The Manual Trigger starts a workflow only when you explicitly
              execute it from the editor. It does not listen for webhooks,
              schedules, form submissions, or any external events.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Common Use Cases
            </p>

            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Testing workflow logic during development</li>
              <li>• Running workflows on demand</li>
              <li>• Experimenting with new automations</li>
              <li>• Debugging workflow steps and outputs</li>
              <li>• Demonstrating workflow behavior before deployment</li>
            </ul>
          </div>


          <div
            className="
              rounded-2xl
              border
              border-blue-200/50
              bg-gradient-to-r
              from-sky-50
              via-white
              to-cyan-50
              p-4
              shadow-[0_8px_24px_rgba(37,99,235,0.08)]
            "
          >
            <p className="text-sm font-semibold text-sky-800">
              Execute Workflow
            </p>

            <p className="mt-1 text-sm text-slate-600">
              When using a Manual trigger, click the
              <span className="font-semibold text-sky-700">
                {" "}Execute Workflow
              </span>
              {" "}button to
              start the workflow and observe execution results in real time.
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-amber-200/60
              bg-amber-50/80
              p-3
            "
          >
            <p className="text-sm text-amber-800">
              Manual Trigger workflows <strong>never</strong> run automatically. If you need
              automated execution, use an event-based trigger such as
              Google Forms, Stripe, scheduled triggers, or other integrations.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
