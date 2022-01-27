import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DMs } from 'src/schemas/DMs';

export class CreateDMsDto extends PickType(DMs, [
    'comment',
    'files',
] as const) {}
