"use client"

import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import React from 'react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Box, CircularProgress } from '@mui/material'
import Header from './_components/Header'
import Body from './_components/body/Body'
import ChatInput from './_components/input/ChatInput'

type Props = {
  params: {
    conversationId: Id<"conversations">;
  }
}

const ConversationPage = ({params: {conversationId}}: Props) => {
  const conversation = useQuery(api.conversation.get, { id: conversationId})

  return conversation === undefined ? (
    <Box className="w-full h-full items-center justify-center" sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  ) : (
    conversation === null ? (
      <p className="w-full h-full items-center justify-center">
        Conversation not found
      </p>
    ) : (
      <ConversationContainer>
        <Header name={(conversation.isGroup ? conversation.name : conversation.otherMember.username) || ""} imageUrl={conversation.isGroup ? undefined : conversation.otherMember.imageUrl} />
        <Body />
        <ChatInput />
      </ConversationContainer>
    )
  )
}

export default ConversationPage