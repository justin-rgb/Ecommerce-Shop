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

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_Type_key" ON "ProductType"("Type");

-- CreateIndex
CREATE UNIQUE INDEX "Genders_gender_key" ON "Genders"("gender");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_type_fkey" FOREIGN KEY ("type") REFERENCES "ProductType"("Type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_gender_fkey" FOREIGN KEY ("gender") REFERENCES "Genders"("gender") ON DELETE RESTRICT ON UPDATE CASCADE;
