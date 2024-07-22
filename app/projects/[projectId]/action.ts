'use server'

import { PrismaClient } from '@prisma/client'
import { getSessionUserId } from './loader'

export const addRole = async (projectId:string) => {
  const prisma = new PrismaClient()
  const userId = await getSessionUserId()

  if (!userId) {
    throw new Error('User ID is null or undefined')
  }

  try {
    await prisma.projectUser.create({
      data: {
        userId,
        projectId,
        role: 'VIEWER',
      },
    }) 
  } catch (error) {
    console.error('Error accepting NDA:', error)
    return false
  }finally {
    await prisma.$disconnect() 
  }
  return true

}