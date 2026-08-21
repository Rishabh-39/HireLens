import { Module } from '@nestjs/common';
import { JobDiscoveryService } from './job-discovery.service';
import { JobDiscoveryController } from './job-discovery.controller';

@Module({
  controllers: [JobDiscoveryController],
  providers: [JobDiscoveryService],
  exports: [JobDiscoveryService],
})
export class JobDiscoveryModule {}
