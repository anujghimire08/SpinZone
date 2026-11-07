-- AlterTable
ALTER TABLE "inventory_adjustments" ADD COLUMN     "admin_id" TEXT;

-- CreateIndex
CREATE INDEX "inventory_adjustments_admin_id_createdAt_idx" ON "inventory_adjustments"("admin_id", "createdAt");

-- AddForeignKey
ALTER TABLE "inventory_adjustments" ADD CONSTRAINT "inventory_adjustments_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
