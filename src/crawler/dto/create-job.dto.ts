import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { EContract } from 'src/constant/contract';
export class CreateJobDto {
  @ApiProperty()
  @IsString()
  contractName: EContract;

  @ApiProperty()
  @IsString()
  cronValue: string;

  @ApiProperty()
  @IsNumber()
  nonceJob: number;
}
