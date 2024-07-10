"use client"

import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import React, { useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Box, CircularProgress } from '@mui/material'
import Header from './_components/Header'
import Body from './_components/body/Body'
import ChatInput from './_components/input/ChatInput'
import DeleteConversationDialog from './_components/dialogs/DeleteConversation'
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog'
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog'
import { useRouter } from 'next/navigation'

type Props = {
  params: {
    conversationId: Id<"conversations">;
  }
}

const ConversationPage = ({params: {conversationId}}: Props) => {
  const conversation = useQuery(api.conversation.get, { id: conversationId})
  const [deleteConversationDialogOpen, setDeleteConversationDialogOpen] = useState(false)
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false)
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false)
  const router = useRouter()
  const [callType, setCallType] = useState<"audio" | "video" | null>(null)

  return conversation === undefined ? (
    <Box className="w-full h-full items-center justify-center" sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  ) : (
    conversation === null ? (
      router.push("/conversations")
    ) : (
      <ConversationContainer>
        <DeleteConversationDialog conversationId={conversationId} open={deleteConversationDialogOpen} setOpen={setDeleteConversationDialogOpen} />
        <LeaveGroupDialog conversationId={conversationId} open={leaveGroupDialogOpen} setOpen={setLeaveGroupDialogOpen} />
        <DeleteGroupDialog conversationId={conversationId} open={deleteGroupDialogOpen} setOpen={setDeleteGroupDialogOpen} />
        <Header 
        name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username) || ""} 
        imageUrl={conversation.isGroup ? undefined : conversation.otherMember?.imageUrl} 
        options = {conversation.isGroup ? [
          {
            label: "Leave group",
            destructive: false,
            onClick: () => setLeaveGroupDialogOpen(true),
          },
          {
            label: "Delete group",
            destructive: true,
            onClick: () => setDeleteGroupDialogOpen(true),
          },
        ] : [
          {
            label: "Delete conversation",
            destructive: true,
            onClick: () => setDeleteConversationDialogOpen(true),
          },
        ]}
        />
        <Body members={conversation.isGroup ? conversation.otherMembers ? conversation.otherMembers : [] : conversation.otherMember ? [conversation.otherMember] : []} />
        <ChatInput />
      </ConversationContainer>
    )
  )
}

export default ConversationPage