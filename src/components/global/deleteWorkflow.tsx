import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

export default function DeleteWorkflow({ workflow }: { workflow: String }) {
  const { toast } = useToast();
  const router = useRouter();

  const handler = async () => {
    try {
      const response = await fetch("/api/workflow/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflowName: workflow }),
      });

      if (!response.ok) {
        toast({
          title: "Failed to Delete Workflow",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Workflow Deleted Successfully",
      });

      router.push("/workflows");
    } catch (error) {
      toast({ title: "Failed to Delete the Workflow", variant: "destructive" });
    }
  };
  return (
    <span onClick={handler} className="p-0 py-0">
      Delete Workflow
    </span>
  );
}
