import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Title should not be empty' })
  @IsString({ message: 'Title should be a string' })
  title: string;

  @IsNotEmpty({ message: 'description cannot be empty' })
  @IsString({ message: 'description should be a string' })
  description: string;
}
