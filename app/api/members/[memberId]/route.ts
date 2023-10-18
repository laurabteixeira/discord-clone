import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID Missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member ID Missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[MEMBER_ID_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile()

    const { searchParams } = new URL(req.url)

    const { role } = await req.json()

    const serverId = searchParams.get('serverId')
    // Geralmente, a serverId poderia ser acessada pelo parâmetro da URL. No entanto, não estamos no arquivo [serverId] e, sim, no [memberId], logo, a URL não contem o serverId.

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID Missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member ID Missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id, // Para o ADMIN não mudar a role de si mesmo.
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (err) {
    console.error('[MEMBERS_ID_PATCH]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
