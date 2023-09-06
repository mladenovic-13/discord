import { auth } from '@clerk/nextjs';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => console.log('serverImage upload complete')),
  messageFile: f(['image', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => console.log('messageFile upload complete')),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
export type FileRouterEndpoints = keyof OurFileRouter;
