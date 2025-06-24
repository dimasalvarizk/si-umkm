-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `komentar` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `produkId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
