"use client"

import ItemList from '@/components/shared/item-list/ItemList'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { Box, CircularProgress } from '@mui/material'
import DMConversationItem from './_components/DMConversationItem'
import CreateGroupDialog from './_components/CreateGroupDialog'
import GroupConversationItem from './_components/GroupConversationItem'

type Props = React.PropsWithChildren<{}>

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get)
  return (
    <>
      <ItemList title='Conversations' action={<CreateGroupDialog />}>
        {
          conversations ? conversations.length === 0 ? (
            <p className='w-full h-full flex items-center justify-center'>
              No conversations found
            </p>
          ) : (
            conversations.map(conversations => {
              return conversations.conversation.isGroup ? (
                <GroupConversationItem 
                  key={conversations.conversation._id} 
                  id={conversations.conversation._id} 
                  name={conversations.conversation.name || ""}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                  unseenCount={conversations.unseenCount}
                  lastMessageTime={conversations.lastMessageTime}
                />
              ) : (
                <DMConversationItem
                  key={conversations.conversation._id} 
                  id={conversations.conversation._id} 
                  username={conversations.otherMember?.username || ""}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                  unseenCount={conversations.unseenCount}
                  lastMessageTime={conversations.lastMessageTime}
                />
              )
            })
          ) : (
            <Box className="w-full h-full items-center justify-center" sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          )
        }
      </ItemList>
      {children}
    </>
  )
}

export default ConversationsLayout