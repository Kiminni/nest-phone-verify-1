import { BadRequestException, Injectable } from '@nestjs/common';
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
        authentication: false,
      });
      await this.phoneRepository.save(newEntry);
    }

    return code;
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    const entry = await this.phoneRepository.findOne({
      where: { phoneNumber },
    });

    if (!entry) {
      throw new BadRequestException('인증번호가 존재하지 않습니다.');
    }

    const now = new Date();
    if (now > entry.expiredAt) {
      throw new BadRequestException('인증번호가 만료되었습니다.');
    }

    if (entry.code !== code) {
      throw new BadRequestException('인증번호가 일치하지 않습니다.');
    }

    await this.phoneRepository.update(entry.id, { authentication: true });
    return true;
  }
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
