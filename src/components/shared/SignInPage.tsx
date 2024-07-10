import React from 'react'
import LoadingLogo from './LoadingLogo'
import { SignInButton } from '@clerk/clerk-react'
import { Button } from '../ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'

type Props = {}

const SignInPage = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <div className='flex items-center justify-center mb-6'>
          <LoadingLogo />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-indigo-800">Welcome to <h1 className='animate-pulse duration-800 mt-4'>ODUO chat app</h1></h1>
        <p className="mb-8 text-gray-200">Sign in with your Google account to get started.</p>
        <SignInButton mode="modal">
          <Button className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </SignInButton>
        
        <div className="mt-8 pt-6 border-t border-indigo-800">
          <p className="text-sm text-gray-500 mb-4">Connect with the developer:</p>
          <div className="flex justify-center space-x-4">
            <a href="https://github.com/denizdag14/chat-app" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors duration-300">
              <FaGithub className="w-6 h-6" />
            </a>
            <a href="https://instagram.com/denizdag" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/in/denizdag14" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage