import { useRouter } from "next/navigation";

export default function DeleteBtn({ workflowName }: { workflowName: String }) {
  const router = useRouter();

  const handler = async () => {
    try {
      const response = await fetch("/api/workflow/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflowName }),
      });

      if (!response.ok) {
        return;
      }

      router.push("/dashboard");
    } catch (error) {}
  };
  return (
    <span onClick={handler} className="text-red-600">
      Delete Workflow
    </span>
  );
}
