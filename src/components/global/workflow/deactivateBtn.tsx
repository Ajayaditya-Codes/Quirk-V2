"use client";
import * as React from "react";
  import { useRouter } from "next/navigation";

export default function DeactivateBtn({
  workflowName,
}: {
  workflowName: String;
}) {
  const router = useRouter();

  const handler = async () => {
    try {
      const response = await fetch("/api/workflow/deactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflowName,
        }),
      });

      if (response.ok) {
        console.log("Workflow deactivated successfully: ", workflowName);
        router.refresh();
      } else {
        const errorData = await response.json();
        console.log(errorData.error);
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };
  return <span onClick={handler}>Deactivate Workflow</span>;
}
