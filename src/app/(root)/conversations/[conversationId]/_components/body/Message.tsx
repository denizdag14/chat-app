import React from 'react'
import { format } from "date-fns"
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Props = {
    fromCurrentUser: boolean,
    senderImage: string,
    senderName: string,
    lastByUser: boolean,
    content: string[],
    createdAt: number,
    seen?: React.ReactNode
    type: string,
}

const Message = ({
    fromCurrentUser,
    senderImage,
    senderName,
    lastByUser,
    content,
    createdAt,
    seen,
    type,
}: Props) => {
    const formatTime = (timestamp: number) => {
        return format(timestamp, "HH:mm")
    }
  return (
    <div className={cn("flex items-end", {
        "justify-end": fromCurrentUser
    })}>
        <div className={cn("flex flex-col w-full mx-2", {
            "order-1 items-end": fromCurrentUser,
            "order-2 items-start": !fromCurrentUser,
        })}>
            <div className={cn("flex items-center justify-between px-4 py-2 rounded-full max-w-[70%]", {
                "bg-primary text-primary-foreground": fromCurrentUser,
                "bg-secondary text-secondary-foreground": !fromCurrentUser,
                "rounded-br-none": !lastByUser && fromCurrentUser,
                "rounded-bl-none": !lastByUser && !fromCurrentUser,
            })}>
                {
                    type === "text" ? (
                        <p className='text-wrap text-xs sm:text-sm break-words whitespace-pre-wrap break-all'>
                            {content}
                        </p>
                    ) : (
                        null
                    )
                }
                <p className={cn("flex ml-2 mt-1 text-xs", {
                    "text-primary-foreground/50 justify-end": fromCurrentUser,
                    "text-secondary-foreground/60 justify-start": !fromCurrentUser
                })}>
                    {formatTime(createdAt)}
                </p>
            </div>
            {seen}
        </div>
        <Avatar className={cn("relative w-8 h-8", {
            "hidden sm:flex": fromCurrentUser,
            "order-2": fromCurrentUser,
            "order-1": !fromCurrentUser,
            "invisible": lastByUser
        })}>
            <AvatarImage src={senderImage} />
            <AvatarFallback>
                {senderName.substring(0,1)}
            </AvatarFallback>
        </Avatar>
    </div>
  )
}

export default Message