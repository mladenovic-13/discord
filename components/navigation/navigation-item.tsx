'use client';

import Image from 'next/image';
import { ActionTooltip } from '../action-tooltip';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const router = useRouter();
  const params = useParams();

  const handleClick = () => router.push(`/servers/${id}`);

  return (
    <ActionTooltip align='center' side='right' label={name}>
      <button
        onClick={handleClick}
        className='group relative flex items-center'
      >
        <div
          className={cn(
            'absolute left-0 w-1 rounded-r-full bg-primary transition-all',
            params.serverId !== id && 'group-hover:h-5',
            params.serverId === id ? 'h-9' : 'h-2'
          )}
        />
        <div
          className={cn(
            'group relative mx-3 flex h-12 w-12 overflow-hidden rounded-3xl transition-all group-hover:rounded-2xl',
            params.serverId === id && 'rounded-2xl bg-primary/10 text-primary'
          )}
        >
          <Image fill src={imageUrl} alt='Channel' />
        </div>
      </button>
    </ActionTooltip>
  );
};
