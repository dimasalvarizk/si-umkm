-- CreateTable
CREATE TABLE `Pelatihan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `kuota` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
