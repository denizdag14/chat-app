"use client"

import React, { useMemo } from 'react'
import { z } from 'zod'
import { api } from '../../../../../convex/_generated/api'
import { useMutationState } from '@/hooks/useMutationState'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from 'convex/react'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { CirclePlus, UserPlus, X } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

type Props = {}

const CreateGroupFromSchema = z.object({
    name: z.string().min(1, {message: "This field cannot be empty"}),
    members: z.string().array().min(1, {message: "You must select at least one friend"}),
})

const CreateGroupDialog = (props: Props) => {
    const friends = useQuery(api.friends.get)
    const { mutate: createGroup, pending } = useMutationState(api.conversation.createGroup)
    const form = useForm<z.infer<typeof CreateGroupFromSchema>>({
        resolver: zodResolver(CreateGroupFromSchema),
        defaultValues: {
            name: "",
            members: [],
        }
    })

    const members = form.watch("members", [])

    const unselectedFriends = useMemo(() => {
        return friends ? friends.filter(friend => !members.includes(friend._id)) : []
    }, [members.length, friends?.length])

    const handleSubmit = async (values: z.infer<typeof CreateGroupFromSchema>) => {
        await createGroup({name: values.name, members: values.members}).then(() => {
            form.reset()
            toast.success("Group created successfully!")
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred") 
        })
    }

  return (
    <Dialog>
        <Tooltip>
            <TooltipTrigger>
                <Button size="icon" variant="outline">
                    <DialogTrigger asChild>
                        <CirclePlus />
                    </DialogTrigger>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Create Group</p>
            </TooltipContent>
        </Tooltip>
        <DialogContent className='block'>
            <DialogHeader className='flex items-center'>
                <DialogTitle>
                    Create group
                </DialogTitle>
                <DialogDescription>
                    Add your friends to get started!
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField control={form.control} name='name' render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder='Group name...' {...field}>

                                    </Input>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }} />
                    <FormField control={form.control} name='members' render={() => {
                        return (
                            <FormItem>
                                <div className='flex items-center space-x-4'>
                                <FormLabel>
                                    Members
                                </FormLabel>
                                <FormControl>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild disabled={unselectedFriends.length === 0}>
                                            <Button className='h-12 w-12 p-1 rounded-full' variant="outline">
                                                <UserPlus />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='w-full'>
                                            {
                                                unselectedFriends.map(friend => {
                                                    return (
                                                        <DropdownMenuCheckboxItem key={friend._id} className='flex items-center gap-2 w-full p-2' onCheckedChange={checked => {
                                                            if(checked){
                                                                form.setValue("members", [...members, friend._id])
                                                            }
                                                        }}>
                                                            <Avatar className='w-8 h-8'>
                                                                <AvatarImage src={friend.imageUrl} />
                                                                <AvatarFallback>
                                                                    {friend.username.substring(0,1)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <h4 className='truncate'>
                                                                {friend.username}
                                                            </h4>
                                                        </DropdownMenuCheckboxItem>
                                                    )
                                                })
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )
                    }} />
                    {
                        members && members.length ? (
                            <Card className='flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar'>
                                {
                                    friends?.filter(friend => members.includes(friend._id)).map(friend => {
                                        return (
                                            <div key={friend._id} className='flex flex-col items-center gap-1'>
                                                <div className='relative'>
                                                    <Avatar>
                                                        <AvatarImage src={friend.imageUrl} />
                                                        <AvatarFallback>
                                                                    {friend.username.substring(0,1)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <X className='text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer' onClick={() => form.setValue("members", members.filter(id => id !== friend._id))} />
                                                </div>
                                                <p className='truncate text-sm'>
                                                    {
                                                        friend.username.split(" ")[0]
                                                    }
                                                </p>
                                            </div>
                                        )
                                    })
                                }
                            </Card>
                        ) : (
                            null
                        )
                    }
                    <DialogFooter>
                        <Button disabled={pending} type='submit'>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateGroupDialog