import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Phone } from './phone.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhoneVerificationService {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}

  async sendVerificationCode(phoneNumber: string): Promise<string> {
    const code = this.generateVerificationCode();
    const expiredAt = new Date(Date.now() + 5 * 60000); // 5분 후 만료

    const existingEntry = await this.phoneRepository.findOne({
      where: { phoneNumber },
    });

    if (existingEntry) {
      // 기존 레코드가 있으면 업데이트
      existingEntry.code = code;
      existingEntry.expiredAt = expiredAt;
      await this.phoneRepository.save(existingEntry);
    } else {
      // 없으면 새로 생성
      const newEntry = this.phoneRepository.create({
        phoneNumber,
        code,
        expiredAt,
      });
      await this.phoneRepository.save(newEntry);
    }

    return code;
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
