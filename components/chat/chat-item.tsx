'use client';

import { Member, MemberRole, Profile } from '@prisma/client';
import { UserAvatar } from '../user-avatar';
import { cn, getName } from '@/lib/utils';
import { ActionTooltip } from '../action-tooltip';
import {
  EditIcon,
  FileIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  TrashIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import qs from 'query-string';
import { useRouter } from 'next/navigation';

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheckIcon className='ml-2 h-4 w-4 text-indigo-500' />,
  ADMIN: <ShieldAlertIcon className='ml-2 h-4 w-4 text-rose-500' />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  currentMember: Member;
  deleted: boolean;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

export const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteing, setIsDeleteing] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('escape keydown');
        setIsEditing(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const form = useForm({
    defaultValues: {
      content,
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, data);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fileType = fileUrl?.split('.').pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileType === 'pdf' && fileUrl;
  const isImage = !isPdf && fileUrl;

  return (
    <div className='group relative flex w-full items-center p-4 transition hover:bg-black/5'>
      <div className='group flex w-full items-start gap-x-2'>
        <div className='cursor-pointer transition hover:drop-shadow-md'>
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className='flex w-full flex-col'>
          <div className='flex items-center gap-x-2 '>
            <div className='flex items-center '>
              <p className='cursor-pointer text-sm font-semibold hover:underline'>
                {getName(member.profile)}
              </p>
              <ActionTooltip label={member.role} align='start' side='bottom'>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary'
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className='object-cover'
              />
            </a>
          )}
          {isPdf && (
            <div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className='mx-2 text-[10px] text-zinc-500 dark:text-zinc-400'>
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex w-full items-center gap-x-2 pt-2'
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <div className='relative w-full'>
                          <Input
                            disabled={isLoading}
                            className='border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200'
                            placeholder='Edited message'
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size='sm' variant='primary'>
                  Save
                </Button>
              </form>
              <span className='mt-1 text-[10px] text-zinc-400'>
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className='absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800'>
          {canEditMessage && (
            <ActionTooltip label='edit' align='center' side='top'>
              <EditIcon
                onClick={() => setIsEditing(true)}
                className='ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
              />
            </ActionTooltip>
          )}
          <ActionTooltip label='delete' align='center' side='top'>
            <TrashIcon className='ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300' />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
