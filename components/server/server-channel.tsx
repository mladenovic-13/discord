'use client';

import { cn } from '@/lib/utils';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import {
  EditIcon,
  HashIcon,
  LockIcon,
  MicIcon,
  TrashIcon,
  VideoIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ActionTooltip } from '@/components/action-tooltip';

const iconMap = {
  [ChannelType.TEXT]: HashIcon,
  [ChannelType.AUDIO]: MicIcon,
  [ChannelType.VIDEO]: VideoIcon,
};

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  return (
    <button
      onClick={() => {}}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <Icon className='h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400' />
      <p
        className={cn(
          'line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip label='Edit' align='center' side='right'>
            <EditIcon className='hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300' />
          </ActionTooltip>
          <ActionTooltip label='Delete' align='center' side='right'>
            <TrashIcon className='hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300' />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <LockIcon className='ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400' />
      )}
    </button>
  );
};
