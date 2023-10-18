import { Profile, Server, Member } from '@prisma/client'

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[]
}
