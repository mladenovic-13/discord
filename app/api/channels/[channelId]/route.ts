import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      channelId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();
    const { channelId } = params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });
    if (!channelId)
      return new NextResponse('Bad Request. Channel ID Missing', {
        status: 400,
      });
    if (!serverId)
      return new NextResponse('Bad Request. Server ID Missing', {
        status: 400,
      });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNELS_ID_DELETE]', error);
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      channelId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();
    const { channelId } = params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });
    if (!channelId)
      return new NextResponse('Bad Request. Channel ID Missing', {
        status: 400,
      });
    if (!serverId)
      return new NextResponse('Bad Request. Server ID Missing', {
        status: 400,
      });

    const { name, type } = await req.json();

    if (name === 'general')
      return new NextResponse('Bad Request. Cannot rename general channel', {
        status: 400,
      });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNELS_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
