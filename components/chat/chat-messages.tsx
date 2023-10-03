'use client';

import { Member, Message, Profile } from '@prisma/client';
import { ChatWelcome } from '@/components/chat/chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2Icon, ServerCrashIcon } from 'lucide-react';
import { Fragment } from 'react';
import { ChatItem } from '@/components/chat/chat-item';
import { format } from 'date-fns';
import { useChatSocket } from '@/hooks/use-chat-socket';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ apiUrl, paramKey, paramValue, queryKey });

  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  });

  if (status === 'loading') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <Loader2Icon className='my-4 h-7 w-7 animate-spin text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <ServerCrashIcon className='my-4 h-7 w-7 text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col overflow-y-auto py-4'>
      <div className='flex-1' />

      <ChatWelcome type={type} name={name} />

      <div className='mt-auto flex flex-col-reverse'>
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                content={message.content}
                deleted={message.deleted}
                fileUrl={message.fileUrl}
                isUpdated={message.createdAt !== message.updatedAt}
                member={message.member}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
