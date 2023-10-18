'use client'
import { useEffect, useState } from 'react'
import { CreateServerModal } from '@/components/modals/create-server-modal'
import { InviteModal } from '@/components/modals/invite-modal'
import { EditServerModal } from '@/components/modals/edit-server-modal'
import { MembersModal } from '@/components/modals/members-modal'

export const ModalProvider = () => {
  const [wasRendered, setWasRendered] = useState(false)

  useEffect(() => {
    setWasRendered(true)
  }, [])

  if (!wasRendered) {
    return null
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
    </>
  )
}
