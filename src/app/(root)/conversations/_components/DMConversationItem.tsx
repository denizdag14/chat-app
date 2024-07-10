import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, isThisWeek, isToday } from 'date-fns';

type Props = {
    id: Id<"conversations">;
    imageUrl: string;
    username: string;
    lastMessageSender?: string;
    lastMessageContent?: string;
    unseenCount: number;
    lastMessageTime?: number;
}

const DMConversationItem = ({id, imageUrl, username, lastMessageSender, lastMessageContent, unseenCount, lastMessageTime}: Props) => {
    const formatTime = (timestamp: number | undefined) => {
        if(timestamp === undefined) return null;
        if (isToday(timestamp)) {
            return format(timestamp, "HH:mm");
        } else if (isThisWeek(timestamp)) {
            return format(timestamp, "eeee");
        } else {
            return format(timestamp, "dd/MM/yyyy");
        }
    }
  return (
    <Link href={`/conversations/${id}`} className='w-full mb-2'>
        <Card className='p-2 flex flex-row bg-secondary hover:bg-secondary/50 items-center justify-between'>
            <div className='flex flex-row items-center gap-4 truncate'>
                <Avatar>
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <div className='flex flex-col truncate'>
                    <h4 className='truncate'>
                        {username}
                    </h4>
                    {
                        lastMessageSender && lastMessageContent ? (
                            <span className='text-sm text-muted-foreground flex truncate overflow-ellipsis'>
                                <p className={cn({
                                    "font-extrabold": unseenCount > 0,
                                    "font-semibold": unseenCount === 0
                                })}>
                                    {lastMessageSender}
                                    {":"}&nbsp;
                                </p>
                                <p className={cn("truncate overflow-ellipsis",{
                                    "font-bold": unseenCount > 0,
                                })}>
                                    {lastMessageContent}
                                </p>
                            </span>
                        ) : (
                            <p className='text-sm text-muted-foreground truncate'>
                                Start the conversation!
                            </p>
                        )
                    }
                </div>
            </div>
            <div className='flex flex-col space-y-1'>
                <p className='text-xs'>{formatTime(lastMessageTime)}</p>
                <div className='flex justify-end'>
                    {unseenCount ? <Badge className='w-6 flex items-center justify-center'>{unseenCount}</Badge> : null}
                </div>
            </div>
        </Card>
    </Link>
  )
}

export default DMConversationItem