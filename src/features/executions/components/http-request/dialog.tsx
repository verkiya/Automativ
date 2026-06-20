"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, CopyIcon, GlobeIcon } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contains only letters, numbers, and underscores",
    }),
  endpoint: z.string().min(1, { message: "Please enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? "",
      endpoint: defaultValues.endpoint ?? "",
      method: defaultValues.method ?? "GET",
      body: defaultValues.body ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName ?? "",
        endpoint: defaultValues.endpoint ?? "",
        method: defaultValues.method ?? "GET",
        body: defaultValues.body ?? "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myApiCall";
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);
  const [copied, setCopied] = useState(false);

  const variableReference = `{{${watchVariableName}.httpResponse.data}}`;

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    await navigator.clipboard.writeText(variableReference);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          border-white/70
          bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))]
        "
      >
        <DialogHeader className="space-y-2">
          <div>
            <DialogTitle className="flex items-center gap-2">
              <GlobeIcon width={18} height={18} /> HTTP Request{" "}
            </DialogTitle>

            <DialogDescription className="mt-2 flex  text-slate-500">
              Configure an API request and expose the response as a workflow
              variable.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-2">
            <div
              className="
                rounded-3xl
                border
                border-sky-100/60
                bg-white
                p-5
                overflow-auto
                shadow-[0_8px_24px_rgba(37,99,235,0.04)]
              "
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="variableName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variable Name</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="myApiCall"
                          className="
                            border-sky-100/80
                            bg-white
                            shadow-sm
                            focus-visible:border-sky-300
                          "
                          {...field}
                        />
                      </FormControl>

                      <FormDescription className="space-y-2">
                        Use this variable name to reference the result in other
                        nodes:
                      </FormDescription>
                      <div className="flex items-start gap-2 mt-2">
                        <div
                          className="
      inline-flex
      max-w-full
      rounded-xl
      border
      border-sky-200/60
      bg-gradient-to-r
      from-sky-50
      via-white
      to-cyan-50
      px-3
      py-1.5
    "
                        >
                          <code
                            className="
        break-all
        font-mono
        text-xs
        text-sky-800
      "
                          >
                            {variableReference}
                          </code>
                        </div>

                        <Button
                          type="button"
                          size="icon-sm"
                          onClick={handleCopy}
                          variant="workflowSoft"
                          className="shrink-0"
                        >
                          {copied ? (
                            <CheckIcon className="size-3 text-emerald-500" />
                          ) : (
                            <CopyIcon className="size-3" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem
                      className="
                        rounded-2xl
                        border
                        border-sky-100/70
                        p-4
                      "
                    >
                      <FormLabel>Method</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="
                              w-full
                              border-sky-200/60
                              bg-gradient-to-r
                              from-sky-50
                              via-white
                              to-cyan-50
                            "
                          >
                            <SelectValue placeholder="Select a method" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormDescription>
                        Choose the HTTP method for this request.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endpoint URL</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="https://api.example.com/users/{{variable}}"
                          className="
                            border-sky-100/80
                            bg-white
                            shadow-sm
                            focus-visible:border-sky-300
                          "
                          {...field}
                        />
                      </FormControl>

                      <FormDescription>
                        Static URL or use {"{{variables}}"} for simple values or{" "}
                        {"{{json variable}}"} to stringify objects
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showBodyField && (
                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem
                        className="
                          rounded-2xl
                          border
                          border-sky-100/70
                          bg-sky-50/20
                          p-4
                        "
                      >
                        <FormLabel>
                          Request Body (Supports JSON with template variables)
                        </FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder={
                              '{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'
                            }
                            className="
                              min-h-[160px]
                              border-sky-100
                              max-h-[175px]
                              bg-white
                              font-mono
                              text-sm
                              shadow-sm
                            "
                            {...field}
                          />
                        </FormControl>

                        <FormDescription>
                          <span className="block">
                            Use {"{{variables}}"} or {"{{json variable}}"} to
                            stringify objects. "json" is a reserved keyword; use
                            before the variable.
                          </span>

                          <span className="mt-1 block">
                            Empty request body passes an empty object {"{}"} by
                            default.
                          </span>
                        </FormDescription>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                variant="workflow"
                className="
                  h-11
                  w-full
                  rounded-2xl
                "
              >
                Save Configuration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
