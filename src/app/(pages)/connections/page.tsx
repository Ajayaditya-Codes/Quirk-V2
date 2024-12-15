import ConnectionCard from "@/components/global/connection-card";
import Header from "@/components/global/header";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  IconBrandAsana,
  IconBrandGithub,
  IconBrandSlack,
} from "@tabler/icons-react";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import Head from "next/head";

// Define the user type for TypeScript
type User = {
  KindeID: string;
  GitHubAccessToken: string | null;
  SlackAccessToken: string | null;
  AsanaRefreshToken: string | null;
};

// Async function to fetch user details
const getUserDetails = async (): Promise<User | null> => {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession?.id) {
    return null;
  }

  try {
    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.KindeID, userSession.id))
      .execute();

    return result && result.length > 0 ? (result[0] as User) : null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

// Skeleton loader for the connection cards
const CardSkeleton = () => (
  <Skeleton className="w-full h-32 rounded-xl" />
);

// Content component for rendering connection cards
const ConnectionsContent = async () => {
  const userDetails = await getUserDetails();

  if (!userDetails) {
    return <p className="text-center text-gray-500">No user details available.</p>;
  }

  return (
    <>
      <ConnectionCard
        title="GitHub"
        description="Connect your GitHub account"
        icon={<IconBrandGithub className="h-5 w-5" />}
        connectionLink={process.env.NEXT_PUBLIC_GITHUB_AUTH_URL || "#"}
        disconnectionLink="/api/github/disconnect"
        connected={!!userDetails.GitHubAccessToken}
      />
      <ConnectionCard
        title="Slack"
        description="Connect your Slack account"
        icon={<IconBrandSlack className="h-5 w-5"  />}
        connectionLink={process.env.NEXT_PUBLIC_SLACK_AUTH_URL || "#"}
        disconnectionLink="/api/slack/disconnect"
        connected={!!userDetails.SlackAccessToken}
      />
      <ConnectionCard
        title="Asana"
        description="Connect your Asana account"
        icon={<IconBrandAsana className="h-5 w-5" />}
        connectionLink={process.env.NEXT_PUBLIC_ASANA_AUTH_URL || "#"}
        disconnectionLink="/api/asana/disconnect"
        connected={!!userDetails.AsanaRefreshToken}
      />
    </>
  );
};

// Main connections page
export default function Connections() {
  return (
    <div className="w-full flex flex-col">
      {/* SEO metadata */}
      <Head>
        <title>Connections | Quirk</title>
        <meta
          name="description"
          content="Manage and connect your accounts including GitHub, Slack, and Asana."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Page content */}
      <Header route="Connections" />
      <div className="w-full p-[3vh]">
        <h1 className="text-2xl font-semibold">Connections</h1>
        <div className="flex flex-col space-y-5 mt-5 w-full">
          <Suspense
            fallback={
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            }
          >
            {/* Render connection content */}
            <ConnectionsContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
