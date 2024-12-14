import React from "react";
import { db } from "@/db/drizzle";
import { Logs, Users } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconCircleCheck, IconExclamationCircle } from "@tabler/icons-react";
import { eq, inArray } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Header from "@/components/global/header";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const { id } = await getUser();

  let logs = null;
  try {
    const user =
      id &&
      (await db.select().from(Users).where(eq(Users.KindeID, id)).execute());
    logs =
      user &&
      (await db
        .select()
        .from(Logs)
        .where(inArray(Logs.WorkflowName, user[0].Workflows))
        .execute());
    if (logs && logs.length > 30) {
      for (const log of logs) {
        await db
          .delete(Logs)
          .where(eq(Logs.createdAt, log.createdAt))
          .execute();
      }
    }
  } catch (error) {}

  return (
    <div className="w-full flex flex-col">
      <Header route="Logs" />
      <div className="w-full p-[3vh]">
        <Table className="text-base">
          <TableCaption>Workflow Activity Logs</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="xl:w-[20vw]">Timestamp</TableHead>
              <TableHead className="xl:w-[15vw]">Workflow</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Success</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs &&
              logs.reverse().map((log, idx) => {
                return (
                  <TableRow
                    className="hover:bg-transparent font-medium"
                    key={idx}
                  >
                    <TableCell>{log.createdAt.toTimeString()}</TableCell>
                    <TableCell>{log.WorkflowName}</TableCell>
                    <TableCell>{log.LogMessage}</TableCell>
                    {log.Success ? (
                      <TableCell className="flex justify-end">
                        <div className="flex flex-row  w-fit h-fit items-center space-x-2 rounded-xl p-1 px-2 ">
                          <IconCircleCheck className="text-green-500" />
                          <p>Succeeded</p>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell className="flex justify-end">
                        <div className="flex flex-row  w-fit h-fit items-center space-x-2 rounded-xl p-1 px-2">
                          <IconExclamationCircle className="text-red-500" />
                          <p>Failed</p>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
