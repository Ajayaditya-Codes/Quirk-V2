import { db } from "@/db/drizzle";
import { Logs, Users, Workflows } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const { workflow, newWorkflow } = await req.json();

  if (!workflow || !newWorkflow) {
    return NextResponse.json(
      { error: "New workflow name or Original Workflow name not provided" },
      { status: 400 }
    );
  }
  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.ClerkID, userId))
    .execute();

  if (user.length === 0) {
    return NextResponse.json({ error: "No User found" }, { status: 404 });
  }

  const currentWorkflows = user[0].Workflows || [];

  if (currentWorkflows.includes(newWorkflow)) {
    return NextResponse.json(
      { error: "Workflow name already exists" },
      { status: 400 }
    );
  }
  const updatedWorkflows = [...currentWorkflows, newWorkflow];
  if (updatedWorkflows.length > 3) {
    await db.insert(Logs).values({
      LogMessage: `Failed to create Workflow ${newWorkflow} due to Workflow limit`,
      WorkflowName: newWorkflow,
      Success: false,
    });

    return NextResponse.json(
      { error: "Maximum number of workflows reached" },
      { status: 400 }
    );
  }

  const existingWorkflow = await db
    .select()
    .from(Workflows)
    .where(eq(Workflows.WorkflowName, workflow))
    .execute();

  if (existingWorkflow.length === 0) {
    return NextResponse.json({ error: "Workflow Not Found" }, { status: 404 });
  }

  try {
    await db
      .update(Users)
      .set({ Workflows: updatedWorkflows })
      .where(eq(Users.ClerkID, userId))
      .execute();
    await db
      .insert(Workflows)
      .values({
        WorkflowName: newWorkflow,
        Nodes: existingWorkflow[0].Nodes,
        Edges: existingWorkflow[0].Edges,
        GitHubNode: {
          id: "github-1",
          type: "github",
          data: {
            repoName: "",
            listenerType: "issues",
          },
          position: { x: 0, y: 0 },
        },
        Published: false,
        HookID: null,
      })
      .execute();

    await db.insert(Logs).values({
      LogMessage: `Workflow ${newWorkflow} Duplicated from ${workflow}`,
      WorkflowName: newWorkflow,
      Success: true,
    });

    return NextResponse.json(
      { message: `Workflow ${newWorkflow} Duplicated from ${workflow}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to Duplicate Workflow:", error);
    await db
      .insert(Logs)
      .values({
        LogMessage: `Failed to duplicate Workflow ${workflow}`,
        WorkflowName: workflow,
        Success: false,
      })
      .execute();
    return NextResponse.json(
      { error: `Failed to duplicate Workflow ${workflow}` },
      { status: 400 }
    );
  }
}
