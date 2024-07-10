"use client"

import React, { useState } from 'react'
import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import ItemList from '@/components/shared/item-list/ItemList'
import AddFriendDialog from './_components/AddFriendDialog'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import FriendCard from './_components/FriendCard'
import { Tabs, Tab } from '@mui/material'
import RemoveFriendDialog from './_components/RemoveFriendDialog'
import { Id } from '../../../../convex/_generated/dataModel'

type Props = {}

const FriendsPage = (props: Props) => {
  const [activeTab, setActiveTab] = useState(0)
  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false)
  const [removeFriendConversationId, setRemoveFriendConversationId] = useState<Id<"conversations">>();
  const requests = useQuery(api.requests.get)
  const friends = useQuery(api.friends.get)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const renderContent = () => {
    if (activeTab === 0) {
      return friends ? (
        friends.length === 0 ? (
          <p className='w-full h-full flex items-center justify-center'>
            No friends found
          </p>
        ) : (
          friends.map(friend => (
            <>
              <FriendCard
                key={friend.friend._id}
                id={friend.friend._id}
                imageUrl={friend.friend.imageUrl}
                username={friend.friend.username}
                email={friend.friend.email}
                isRequest={false}
                removeFriendDialog={{
                  destructive: true,
                  onClick: () => {
                    setRemoveFriendDialogOpen(true);
                    setRemoveFriendConversationId(friend.conversationId)
                  },
                }}
              />
            </>
          ))
        )
      ) : (
        <Box className="w-full h-full items-center justify-center" sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )
    } else {
      return requests ? (
        requests.length === 0 ? (
          <p className='w-full h-full flex items-center justify-center'>
            No friend requests found
          </p>
        ) : (
          requests.map(request => (
            <FriendCard
              key={request.request._id}
              id={request.request._id}
              imageUrl={request.sender.imageUrl}
              username={request.sender.username}
              email={request.sender.email}
              isRequest={true}
            />
          ))
        )
      ) : (
        <Box className="w-full h-full items-center justify-center" sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )
    }
  }

  return (
    <>
      <ItemList title='Friends' action={<AddFriendDialog />}>
        <Tabs className='mb-2' value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Friends" />
          <Tab label="Friend Requests" />
        </Tabs>
        {renderContent()}
      </ItemList>
      <ConversationFallback />
      <RemoveFriendDialog conversationId={removeFriendConversationId} open={removeFriendDialogOpen} setOpen={setRemoveFriendDialogOpen} />
    </>
  )
}

export default FriendsPage