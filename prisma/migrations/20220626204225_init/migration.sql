-- CreateEnum
CREATE TYPE "Types" AS ENUM ('shirts', 'pants', 'hoodies', 'hats');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('men', 'women', 'kid', 'unisex', 'non_specified');

-- CreateEnum
CREATE TYPE "Sizes" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "inStock" INTEGER NOT NULL DEFAULT 0,
    "sizes" "Sizes"[],
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "slug" TEXT NOT NULL,
    "tags" TEXT[],
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductType" (
    "idType" SERIAL NOT NULL,
    "Type" TEXT NOT NULL,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("idType")
);

-- CreateTable
CREATE TABLE "Genders" (
    "idGender" SERIAL NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "Genders_pkey" PRIMARY KEY ("idGender")
);

-- CreateTable
CREATE TABLE "User" (
    "idUser" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Role" (
    "idRole" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("idRole")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "user" INTEGER NOT NULL,
    "shippingAddress" INTEGER NOT NULL,
    "orderItems" INTEGER NOT NULL,
    "numberOfItems" INTEGER NOT NULL,
    "subTotal" INTEGER NOT NULL,
    "tax" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL,
    "paidAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "idItem" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("idItem")
);

-- CreateTable
CREATE TABLE "OrderShippingAddress" (
    "idShippingAddress" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "OrderShippingAddress_pkey" PRIMARY KEY ("idShippingAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_Type_key" ON "ProductType"("Type");

-- CreateIndex
CREATE UNIQUE INDEX "Genders_gender_key" ON "Genders"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_type_fkey" FOREIGN KEY ("type") REFERENCES "ProductType"("Type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_gender_fkey" FOREIGN KEY ("gender") REFERENCES "Genders"("gender") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("idRole") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderItems_fkey" FOREIGN KEY ("orderItems") REFERENCES "OrderItems"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddress_fkey" FOREIGN KEY ("shippingAddress") REFERENCES "OrderShippingAddress"("idShippingAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_gender_fkey" FOREIGN KEY ("gender") REFERENCES "Genders"("gender") ON DELETE RESTRICT ON UPDATE CASCADE;
