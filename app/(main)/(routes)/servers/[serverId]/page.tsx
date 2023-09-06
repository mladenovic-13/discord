import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

const ServersPage = async ({ params }: { params: { serverId: string } }) => {
  const { serverId } = params;

  const server = await db.server.findFirst({
    where: {
      id: serverId,
    },
  });

  if (!server) return notFound();

  return <div>{server?.name}</div>;
};

export default ServersPage;
