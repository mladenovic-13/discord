'use client';

import { PlusIcon } from 'lucide-react';
import { ActionTooltip } from '../action-tooltip';

export const NavigationAction = () => {
  return (
    <div>
      <ActionTooltip align='center' side='right' label='Add new server'>
        <button className='group flex items-center'>
          <div className='mx-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-3xl bg-background transition-all group-hover:rounded-2xl group-hover:bg-emerald-500 dark:bg-neutral-700'>
            <PlusIcon
              size={25}
              className='text-emerald-500 transition group-hover:text-white'
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
