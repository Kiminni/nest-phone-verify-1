import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendCodeDto {
  @ApiProperty({
    example: '010-1234-5678',
    description: '전화번호'
  })
  @Matches(/^010-\d{4}-\d{4}$/, {
    message: '휴대전화 번호는 반드시 형식에 맞게 작성해야합니다.',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}