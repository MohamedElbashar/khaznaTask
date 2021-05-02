/*
  Warnings:

  - You are about to drop the column `brand_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_ibfk_2`;

-- AlterTable
ALTER TABLE `Brand` ADD COLUMN     `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN     `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `brand_id`,
    DROP COLUMN `category_id`;

-- CreateIndex
CREATE UNIQUE INDEX `Brand_product_id_unique` ON `Brand`(`product_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_product_id_unique` ON `Category`(`product_id`);

-- AddForeignKey
ALTER TABLE `Brand` ADD FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
