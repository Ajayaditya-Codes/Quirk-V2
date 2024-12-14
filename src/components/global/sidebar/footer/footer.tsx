import { SidebarFooter } from "@/components/ui/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserRound } from "lucide-react";
import Image from "next/image";

export default async function Footer() {
  const { getUser } = getKindeServerSession();
  const { picture, given_name } = await getUser();

  return (
    <SidebarFooter className="m-3 shadow-lg bg-white dark:bg-neutral-800 rounded-xl p-3 flex flex-row justify-start items-start">
      {picture ? (
        <Image
          alt="Logo"
          src={picture}
          width={30}
          height={30}
          className="rounded-lg pt-1"
        />
      ) : (
        <UserRound />
      )}
      <div className="flex flex-col justify-start items-start">
        <h3 className="font-semibold text-lg tracking-tighter leading-snug">
          {given_name}
        </h3>
        <small className="leading-snug font-medium">
          You are using Free Plan of Quirk. You are left with {20} Free Credits.
        </small>
      </div>
    </SidebarFooter>
  );
}
