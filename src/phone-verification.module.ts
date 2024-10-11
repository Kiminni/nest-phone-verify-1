import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneVerificationService } from './phone-verification.service';
import { PhoneVerificationController } from './phone-verification.controller';
import { Phone } from './phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phone])],
  providers: [PhoneVerificationService],
  controllers: [PhoneVerificationController],
})
export class PhoneVerificationModule {}
