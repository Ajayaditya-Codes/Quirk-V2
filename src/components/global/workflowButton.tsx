"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { generate } from "random-words";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function WorkflowButton() {
  const { toast } = useToast();
  const router = useRouter();

  const handler = async () => {
    const workflowName = join(generate(3));
    try {
      const response = await fetch("/api/workflow/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newWorkflowName: workflowName,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        toast({ title: "Workflow Added Successfully" });
        router.refresh();
      } else if (result.error === "Maximum number of workflows reached") {
        toast({
          title: "Workflow Limit Reached. ",
          description: "You can only have 3 Workflows in Hobby Plan.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "There was some Error. Try Again Later!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to add workflow:", error);
      toast({
        title: "There was some Error. Try Again Later!",
        variant: "destructive",
      });
    }
  };

  const join = (strings: string[] | string) => {
    let result = "";
    for (const string of strings) {
      result += string[0].toUpperCase() + string.slice(1);
      result += "-";
    }
    return result.slice(0, -1);
  };
  return (
    <span onClick={handler}>
      <Plus size={15} />
    </span>
  );
}
