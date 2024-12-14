import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
  connectionLink?: string;
};

export default async function ConnectionCard({
  description,
  icon,
  title,
  connected,
  connectionLink,
}: Props) {
  return (
    <Card className="flex w-full items-end bg-transparent justify-between border shadow-lg">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">{icon}</div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-row gap-2 space-x-3 p-4 ">
        {connected ? (
          <button
            disabled={true}
            className="rounded-lg p-2 border  text-neutral-400 font-bold "
          >
            Connected
          </button>
        ) : (
          <Link
            href={connectionLink ? connectionLink : "#"}
            className=" rounded-lg p-2 font-bold border  text-center"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  );
}
