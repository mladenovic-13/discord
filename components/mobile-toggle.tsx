import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { NavigationSidebar } from './navigation/navigation-sidebar';
import { ServerSidebar } from './server/server-sidebar';

interface MobileToggleProps {
  serverId: string;
}

export const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='flex gap-0 p-0'>
        <div className='w-[72px]'>
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
