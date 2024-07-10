"use client"

import { Card } from '@/components/ui/card'
import { useConversation } from '@/hooks/useConversation'
import { useMutationState } from '@/hooks/useMutationState'
import React, { useRef, useState } from 'react'
import { z } from 'zod'
import { api } from '../../../../../../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConvexError } from 'convex/values'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import TextareaAutosize from "react-textarea-autosize"
import { Button } from '@/components/ui/button'
import { SendHorizonal, Smile } from 'lucide-react'
import EmojiPicker, { Theme as EmojiTheme } from 'emoji-picker-react';
import { useTheme } from 'next-themes'

const chatMessageSchema = z.object({
    content: z.string().min(1, {message: "This field cannot be empty"})
})

const ChatInput = () => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const { conversationId } = useConversation();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const { theme } = useTheme()
    const { mutate: createMessage, pending } = useMutationState(api.message.create)
    const form = useForm<z.infer<typeof chatMessageSchema>>({
        resolver: zodResolver(chatMessageSchema),
        defaultValues: {
            content: "",
        },
    })

    const handleEmojiClick = (emojiObject: any) => {
        const cursor = textareaRef.current?.selectionStart;
        const text = form.getValues("content");
        if (cursor !== undefined) {
            const newText = text.slice(0, cursor) + emojiObject.emoji + text.slice(cursor);
            form.setValue("content", newText);
        } else {
            form.setValue("content", text + emojiObject.emoji);
        }
    }

    const handleInputChange = (event: any) => {
        const {value, selectionStart} = event.target;

        if(selectionStart !== null) {
            form.setValue("content", value)
        }
    }

    const handleSubmit = async ( values: z.infer<typeof chatMessageSchema>) => {
        createMessage({
            conversationId,
            type: "text",
            content: [values.content]
        }).then(() => {
            form.reset();
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
        })
    }
  return (
    <Card className='w-full p-2 rounded-lg relative'>
        {showEmojiPicker && (
            <div className="absolute bottom-full mb-2">
                <EmojiPicker theme={theme === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT} onEmojiClick={handleEmojiClick} />
            </div>
        )}
        <div className='flex gap-2 items-end w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='flex gap-2 items-end w-full'>
                    <Button 
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <Smile />
                    </Button>
                    <FormField 
                        control={form.control} 
                        name="content" 
                        render={({field}) => {
                            return (
                            <FormItem className='h-full w-full'>
                                <FormControl>
                                    <TextareaAutosize 
                                        onKeyDown={async e => {
                                            if(e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                await form.handleSubmit(handleSubmit)();
                                            }
                                        }}
                                        rows={1} 
                                        maxRows={3} {...field} 
                                        onChange={handleInputChange} 
                                        onClick={handleInputChange}
                                        placeholder='Type a message...'
                                        className='min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )
                        }} 
                    />
                    <Button 
                        disabled={pending}
                        size="icon"
                        type='submit'
                    >
                        <SendHorizonal />
                    </Button>
                </form>
            </Form>
        </div>
    </Card>
  )
}

export default ChatInput