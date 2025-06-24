-- CreateTable
CREATE TABLE `Pendaftaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `alasan` VARCHAR(191) NOT NULL,
    `pelatihanId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_pelatihanId_fkey` FOREIGN KEY (`pelatihanId`) REFERENCES `Pelatihan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
