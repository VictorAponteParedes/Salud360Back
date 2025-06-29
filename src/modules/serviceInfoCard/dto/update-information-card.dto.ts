import { PartialType } from '@nestjs/mapped-types';
import { CreateInformationCardDto } from './create-information-card.dto';

export class UpdateInformationCardDto extends PartialType(CreateInformationCardDto) { }

