import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '010-1234-5678',
    description: '전화번호',
  })
  @Matches(/^010-\d{4}-\d{4}$/, {
    message: '휴대전화 번호 형식을 맞춰주세요.',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '123456',
    description: '인증코드',
  })
  @Length(6, 6, { message: '코드는 여섯자리입니다.' })
  code: string;
}
