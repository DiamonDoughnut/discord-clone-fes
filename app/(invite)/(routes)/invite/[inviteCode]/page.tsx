import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string
    }
}

const InviteCodePage  = async ({ 
    params 
}: InviteCodePageProps) => {
    const profile = await currentProfile();
    
    if (!profile) {
        return auth().redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect('/')
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) {
        redirect(`/servers/${existingServer.id}`)
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }
    
    return ( 
      <div className="h-full w-full flex items-center justify-center text-rose-600 text-4xl font-bold">
        Something went Wrong!
      </div> 
    );
}
 
export default InviteCodePage ;