'use server'

import { PrismaClient } from '@prisma/client'
import { getSessionUserId } from './loader'

export const addRole = async (projectId:string) => {
  const prisma = new PrismaClient()
  const userId = await getSessionUserId()

  if (!userId) {
    throw new Error('Failed to add role: User ID is null or undefined')
  }

  try {
    await prisma.projectUser.create({
      data: {
        userId,
        projectId,
        role: 'VIEWER',
      },
    })
    return 'VIEWER'
  } catch (error) {
    console.error('Error accepting NDA:', error)
    return null
  }finally {
    await prisma.$disconnect() 
  }
  return null

}
