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
CREATE TABLE "create_news_event" (
    "id" INTEGER NOT NULL,
    "owner_address" TEXT NOT NULL,
    "is_claim" TEXT NOT NULL,
    "total_supply" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "job_id" INTEGER NOT NULL,

    CONSTRAINT "create_news_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_token_event" (
    "id" INTEGER NOT NULL,
    "reader_address" TEXT NOT NULL,
    "token_value" TEXT NOT NULL,
    "job_id" INTEGER NOT NULL,

    CONSTRAINT "claim_token_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "create_news_event" ADD CONSTRAINT "create_news_event_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_token_event" ADD CONSTRAINT "claim_token_event_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
