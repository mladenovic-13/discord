'use client';

import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client';
import { ShieldAlertIcon, ShieldCheckIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { UserAvatar } from '../user-avatar';

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheckIcon className='mr-2 h-4 w-4 text-indigo-500' />
  ),
  [MemberRole.ADMIN]: (
    <ShieldAlertIcon className='mr-2 h-4 w-4 text-rose-500' />
  ),
};

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  return (
    <button
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className='h-6 w-6 md:h-8 md:w-8'
      />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params.channelId === member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        <span className='truncate'>
          {member.profile.name.includes('null')
            ? member.profile.email
            : member.profile.name}
        </span>
      </p>
      {icon}
    </button>
  );
};
