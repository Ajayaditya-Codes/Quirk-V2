"use client";
import Link from "next/link";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import DeleteWorkflow from "./deleteWorkflow";
import DuplicateWorkflow from "./duplicateWorkflow";

export default function WorkflowMenu({ workflow }: { workflow: String }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={"/editor/" + workflow}>
          <span>{workflow}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            <span>Duplicate Project</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DuplicateWorkflow workflow={workflow} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DeleteWorkflow workflow={workflow} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
