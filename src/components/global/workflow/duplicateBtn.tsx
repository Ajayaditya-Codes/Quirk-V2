"use client";
import * as React from "react";
import { generate } from "random-words";
import { useRouter } from "next/navigation";

export default function DuplicateBtn({
  workflowName,
}: {
  workflowName: String;
}) {
  const router = useRouter();

  const handler = async () => {
    const newWorkflow = join(generate(3));
    try {
      const response = await fetch("/api/workflow/duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow:workflowName,
          newWorkflow
        }),
      });

      if (response.ok) {
        console.log("Workflow duplicated successfully: ", workflowName);
        router.refresh();
      } else {
        const errorData = await response.json();
        console.log(errorData.error);
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };
  const join = (strings: String[] | String) => {
    let result = "";
    for (const string of strings) {
      result += string[0].toUpperCase() + string.slice(1);
      result += "-";
    }
    return result.slice(0, -1);
  };
  return <span onClick={handler}>Duplicate Workflow</span>;
}
