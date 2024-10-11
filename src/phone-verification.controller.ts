import { Body, Controller, Post } from '@nestjs/common';
import { PhoneVerificationService } from './phone-verification.service';
import { SendCodeDto } from './dto/send-code.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyCodeDto } from './dto/verify-code.dto';

@ApiTags('Phone Verification')
@Controller('phone-verification')
export class PhoneVerificationController {
  constructor(
    private readonly phoneVerificationService: PhoneVerificationService,
  ) {}

  @Post('send-code')
  @ApiResponse({ status: 200, description: '인증번호 생성' })
  @ApiResponse({ status: 400, description: '인증번호 관련 오류' })
  @ApiBody({ type: SendCodeDto })
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    const code = await this.phoneVerificationService.sendVerificationCode(
      sendCodeDto.phoneNumber,
    );
    return { code };
  }
  @Post('verify-code')
  @ApiResponse({ status: 200, description: '휴대폰 인증이 성공하였습니다.' })
  @ApiResponse({ status: 400, description: '휴대폰 인증에 실패하였습니다.' })
  @ApiBody({ type: VerifyCodeDto })
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    await this.phoneVerificationService.verifyCode(
      verifyCodeDto.phoneNumber,
      verifyCodeDto.code,
    );
    return { result: true };
  }
}
