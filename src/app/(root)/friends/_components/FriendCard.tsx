import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, MessageCircle, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '../../../../../convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

type Props = {
    id: Id<"requests"> | Id<"users">;
    imageUrl: string;
    username: string;
    email: string;
    isRequest: boolean;
    removeFriendDialog?: {
        destructive: boolean;
        onClick: () => void;
    }
}

const FriendCard = ({ id, imageUrl, username, email, isRequest, removeFriendDialog }: Props) => {
    const { mutate: denyRequest, pending: denyPending } = useMutationState(api.request.deny)
    const { mutate: acceptRequest, pending: acceptPending } = useMutationState(api.request.accept)
    const { mutate: createConversationRequest, pending: createConversationPending } = useMutationState(api.conversation.createConversation)
    const router = useRouter();
  return (
    <Card className='w-full p-2 flex bg-secondary flex-row items-center justify-between mb-2 gap-2'>
        <div className='flex items-center gap-4 truncate'>
            <Avatar>
                <AvatarImage src={imageUrl} />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
                <h4 className="truncate">
                    {username}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                    {email}
                </p>
            </div>
        </div>
        <div className='flex items-center gap-2'>
            {
                isRequest ? (
                    <>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button className='w-7 h-7' size="icon" disabled={denyPending || acceptPending} onClick={() => {
                                    acceptRequest({id})
                                    .then(() => {
                                        toast.success("Friend request accepted");
                                    })
                                    .catch((error) => {
                                        toast.error(
                                            error instanceof ConvexError ? 
                                            error.data : "Unexpected error occurred"
                                        )
                                    })
                                }}>
                                    <Check className='h-4 w-4' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Accept Friend Request</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button className='w-7 h-7' size="icon" disabled={denyPending || acceptPending} variant="destructive" onClick={() => {
                                    denyRequest({id})
                                    .then(() => {
                                        toast.success("Friend request denied");
                                    })
                                    .catch((error) => {
                                        toast.error(
                                            error instanceof ConvexError ? 
                                            error.data : "Unexpected error occurred"
                                        )
                                    })
                                }}>
                                    <X className='h-4 w-4' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Deny Friend Request</p>
                            </TooltipContent>
                        </Tooltip>
                        
                    </>
                ) : (
                    <>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button className='w-7 h-7' size="icon" disabled={createConversationPending} variant="default" onClick={() => {
                                    createConversationRequest({id})
                                    .then((conversationId) => {
                                        toast.success("Successfully started a conversation with " + username);
                                        router.push(`/conversations/${conversationId}`)
                                    })
                                    .catch((error) => {
                                        toast.error(
                                            error instanceof ConvexError ? 
                                            error.data : "Unexpected error occurred"
                                        )
                                    })
                                }}>
                                    <MessageCircle className='h-4 w-4' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Start a conversation</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button className='w-7 h-7' size="icon" variant="destructive" onClick={removeFriendDialog?.onClick}>
                                    <X className='h-4 w-4' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Remove Friend</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                )
            }
        </div>
    </Card>
  )
}

export default FriendCard