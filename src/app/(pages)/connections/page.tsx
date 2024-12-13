import ConnectionCard from "@/components/global/connection-card";
import Header from "@/components/global/header";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  IconBrandAsana,
  IconBrandGithub,
  IconBrandSlack,
} from "@tabler/icons-react";
import { eq } from "drizzle-orm";

export default async function Connections() {
  const { getUser } = getKindeServerSession();
  const { id } = await getUser();

  let userDetails = null;
  try {
    const result =
      id &&
      (await db.select().from(Users).where(eq(Users.KindeID, id)).execute());

    userDetails = result && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching user details:", error);
  }

  return (
    <div className="w-full flex flex-col">
      <Header route="Connections" />
      <div className="w-full p-[3vh]">
        <h1 className="text-2xl font-semibold">Connections</h1>
        <div className="flex flex-col space-y-5 mt-5">
          <ConnectionCard
            title="GitHub"
            description="Connect your GitHub account"
            icon={<IconBrandGithub className="h-5 w-5 " />}
            connectionLink={process.env.GITHUB_AUTH_URL}
            connected={userDetails?.GitHubAccessToken !== null}
          />{" "}
          <ConnectionCard
            title="Slack"
            description="Connect your Slack account"
            icon={<IconBrandSlack className="h-5 w-5 " />}
            connected={userDetails?.SlackAccessToken !== null}
            connectionLink={process.env.SLACK_AUTH_URL}
          />{" "}
          <ConnectionCard
            title="Asana"
            description="Connect your Asana account"
            icon={<IconBrandAsana className="h-5 w-5 " />}
            connected={userDetails?.AsanaRefreshToken !== null}
            connectionLink={process.env.ASANA_AUTH_URL}
          />{" "}
        </div>
      </div>
    </div>
  );
}
