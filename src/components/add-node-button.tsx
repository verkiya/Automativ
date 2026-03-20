"use client";
import { useState, memo } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
export const AddNodeButton = memo(() => {
  return (
    <Button
      onClick={() => {}}
      size="icon"
      variant="outline"
      className="bg-background"
    >
      <PlusIcon />
    </Button>
  );
});
AddNodeButton.displayName = "AddNodeButton";
