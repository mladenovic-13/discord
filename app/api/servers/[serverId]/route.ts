import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const response = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log('[SERVERS_SERVERID_PATCH]', error);
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      serverId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();
    const { serverId } = params;

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });
    if (!serverId)
      return new NextResponse('Server ID Missing', { status: 400 });

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
