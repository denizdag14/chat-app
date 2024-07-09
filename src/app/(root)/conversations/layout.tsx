"use client"

import ItemList from '@/components/shared/item-list/ItemList'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { Box, CircularProgress } from '@mui/material'
import DMConversationItem from './_components/DMConversationItem'

type Props = React.PropsWithChildren<{}>

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get)
  return (
    <>
      <ItemList title='Conversations'>
        {
          conversations ? conversations.length === 0 ? (
            <p className='w-full h-full flex items-center justify-center'>
              No conversations found
            </p>
          ) : (
            conversations.map(conversations => {
              return conversations.conversation.isGroup ? (
                null
              ) : (
                <DMConversationItem 
                  key={conversations.conversation._id} 
                  id={conversations.conversation._id} 
                  username={conversations.otherMember?.username || ""} 
                  imageUrl={conversations.otherMember?.imageUrl || ""} 
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