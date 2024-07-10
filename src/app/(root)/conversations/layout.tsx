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
  const sortedConversations = conversations ? [...conversations].sort((a, b) => {
    const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : new Date(a.conversation._creationTime).getTime()
    const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : new Date(b.conversation._creationTime).getTime()
    return bTime - aTime
  }) : []
  return (
    <>
      <ItemList title='Conversations' action={<CreateGroupDialog />}>
        {
          conversations ? sortedConversations.length === 0 ? (
            <p className='w-full h-full flex items-center justify-center'>
              No conversations found
            </p>
          ) : (
            sortedConversations.map(sortedConversations => {
              return sortedConversations.conversation.isGroup ? (
                <GroupConversationItem 
                  key={sortedConversations.conversation._id} 
                  id={sortedConversations.conversation._id} 
                  name={sortedConversations.conversation.name || ""}
                  lastMessageContent={sortedConversations.lastMessage?.content}
                  lastMessageSender={sortedConversations.lastMessage?.sender}
                  unseenCount={sortedConversations.unseenCount}
                  lastMessageTime={sortedConversations.lastMessageTime}
                />
              ) : (
                <DMConversationItem
                  key={sortedConversations.conversation._id} 
                  id={sortedConversations.conversation._id} 
                  username={sortedConversations.otherMember?.username || ""}
                  imageUrl={sortedConversations.otherMember?.imageUrl || ""}
                  lastMessageContent={sortedConversations.lastMessage?.content}
                  lastMessageSender={sortedConversations.lastMessage?.sender}
                  unseenCount={sortedConversations.unseenCount}
                  lastMessageTime={sortedConversations.lastMessageTime}
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