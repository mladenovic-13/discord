'use client';

import { ServerWithMembersWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDownIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus: outline-none' asChild>
        <button className='flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 text-base font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-700 dark:hover:bg-zinc-700/50'>
          {server.name}
          <ChevronDownIcon className='ml-auto h-5 w-5' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 space-y-0.5  text-xs font-medium text-black dark:text-neutral-400'>
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('invite', { server })}
            className='cursor-pointer px-3 py-2 text-sm text-indigo-700 dark:text-indigo-400'
          >
            Invite People
            <UserPlusIcon className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('editServer', { server })}
            className='cursor-pointer px-3 py-2 text-sm'
          >
            Server Settings
            <SettingsIcon className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('members', { server })}
            className='cursor-pointer px-3 py-2 text-sm'
          >
            Manage Members
            <UsersIcon className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className='cursor-pointer px-3 py-2 text-sm'>
            Create Channel
            <PlusCircleIcon className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className='cursor-pointer px-3 py-2 text-sm text-rose-500'>
            Delete Server
            <TrashIcon className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className='cursor-pointer px-3 py-2 text-sm text-rose-500'>
            Leave Server
            <LogOutIcon className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
