import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { UtilService } from './util.service';

@Module({
  providers: [S3Service, UtilService],
  exports: [S3Service, UtilService],
})
export class ServicesModule {}
