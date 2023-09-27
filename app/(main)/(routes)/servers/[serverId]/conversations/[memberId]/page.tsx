import { ChatHeader } from '@/components/chat/chat-header';
import { getConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { getName } from '@/lib/utils';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const { serverId, memberId } = params;

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect('/');

  const conversation = await getConversation(currentMember.id, memberId);

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className='flex  h-full flex-col bg-white dark:bg-[#313338]'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={getName(otherMember.profile)}
        serverId={serverId}
        type='conversation'
      />
    </div>
  );
};

export default MemberIdPage;
