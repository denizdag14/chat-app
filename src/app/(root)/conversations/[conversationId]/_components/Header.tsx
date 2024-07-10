import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CircleArrowLeft, Settings, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
    imageUrl?: string;
    name: string;
    isGroup?: boolean;
    members?: { name: string; imageUrl?: string }[];
    options?: {
        label: string;
        destructive: boolean;
        onClick: () => void;
    }[]
}

const Header = ({imageUrl, name, options, isGroup, members}: Props) => {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <Card className='w-full flex rounded-lg items-center p-2 justify-between'>
        <Link href="/conversations" className='block lg:hidden'>
            <CircleArrowLeft />
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className='flex items-center h-full cursor-pointer hover:bg-secondary/50 hover:rounded-lg pl-2 pr-2 gap-2'>
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src={imageUrl} />
                        <AvatarFallback>
                            {name.substring(0,1).toLocaleUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className='font-bold'>
                        {name}
                    </h2>
                </div>
            </DialogTrigger>
            <DialogContent className="w-full max-w-full sm:max-w-[425px] h-full sm:h-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{name}</DialogTitle>
                    <div className='border-b'></div>
                </DialogHeader>
                <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
                    <Avatar className='h-20 w-20 sm:h-16 sm:w-16'>
                        <AvatarImage src={imageUrl} />
                        <AvatarFallback>
                            {name.substring(0,1).toLocaleUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <p className="text-sm text-gray-500">
                            {isGroup ? "Group conversation" : "Personal conversation"}
                        </p>
                    </div>
                </div>
                {isGroup && members && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2 border-b">Members</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto flex justify-between">
                            {members.map((member, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Avatar className='h-8 w-8'>
                                        <AvatarImage src={member.imageUrl} />
                                        <AvatarFallback>
                                            {member.name.substring(0,1).toLocaleUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{member.name}</span>
                                </div>
                            ))}
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button className='w-6 h-6 p-1' size="icon" variant="destructive">
                                        <X />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                        not functional for now
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
        <div className='flex gap-2'>
            {
                options ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button size="icon" variant="secondary">
                                <Settings />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {
                                options.map((option, id) => {
                                    return (
                                        <DropdownMenuItem key={id} onClick={option.onClick} className={cn("font-semibold cursor-pointer", {
                                            "text-destructive": option.destructive,
                                        })} >
                                            {option.label}
                                        </DropdownMenuItem>
                                    )
                                })
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    null
                )
            }
        </div>
    </Card>
  )
}

export default Header