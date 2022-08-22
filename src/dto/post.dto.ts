import { IsNotEmpty, IsString } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  @IsString()
  public desc: string;
}
