"use client";
import * as React from "react";
import { Plus } from "lucide-react";
  import { generate } from "random-words";
  import { useRouter } from "next/navigation";

export default function CreateBtn() {
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
          workflowName,
        }),
      });

      if (response.ok) {
        console.log("Workflow created successfully: ", workflowName);
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

  return (
    <span onClick={handler}>
      <Plus size={15} />
    </span>
  );
}
