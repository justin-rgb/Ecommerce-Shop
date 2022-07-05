/*
  Warnings:

  - The `orderItems` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `OrderItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderItems_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_gender_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderItems",
ADD COLUMN     "orderItems" JSONB[];

-- DropTable
DROP TABLE "OrderItems";
