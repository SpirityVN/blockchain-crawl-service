-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('processing', 'complete', 'failed');

-- CreateTable
CREATE TABLE "job" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "start_block" INTEGER,
    "end_block" INTEGER,
    "status" "JobStatus",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "tx_hash" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_data" JSONB,
    "status" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("tx_hash")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
