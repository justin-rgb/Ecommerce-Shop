/*
  Warnings:

  - You are about to drop the `OrderShippingAddress` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `shippingAddress` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingAddress_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingAddress",
ADD COLUMN     "shippingAddress" JSONB NOT NULL;

-- DropTable
DROP TABLE "OrderShippingAddress";
