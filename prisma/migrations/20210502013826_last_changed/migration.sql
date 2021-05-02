/*
  Warnings:

  - You are about to drop the column `product_id` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Category` table. All the data in the column will be lost.
  - Added the required column `brand_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Brand` DROP FOREIGN KEY `Brand_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_ibfk_1`;

-- AlterTable
ALTER TABLE `Brand` DROP COLUMN `product_id`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `product_id`;

-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'ACCEPTTED', 'DECLINED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Product` ADD COLUMN     `brand_id` INTEGER NOT NULL,
    ADD COLUMN     `category_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD FOREIGN KEY (`brand_id`) REFERENCES `Brand`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
