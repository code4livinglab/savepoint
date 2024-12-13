/*
  Warnings:

  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `NotificationUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `notificationId` on the `NotificationUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "NotificationUser" DROP CONSTRAINT "NotificationUser_notificationId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "NotificationUser" DROP CONSTRAINT "NotificationUser_pkey",
DROP COLUMN "notificationId",
ADD COLUMN     "notificationId" INTEGER NOT NULL,
ADD CONSTRAINT "NotificationUser_pkey" PRIMARY KEY ("userId", "notificationId");

-- AddForeignKey
ALTER TABLE "NotificationUser" ADD CONSTRAINT "NotificationUser_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
