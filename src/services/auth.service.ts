import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';
import { SignUpDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly Users: Model<User>) {}

  // To signup a user
  async signup(signUpDto: SignUpDto): Promise<any> {
    try {
      const firstName = signUpDto.firstName;
      const lastName = signUpDto.lastName;
      const email = signUpDto.email;
      let password = signUpDto.password;
      const user = await this.Users.findOne({ email });

      if (user)
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

      // hashing password
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);

      const newUser = new this.Users({
        firstName,
        lastName,
        email,
        password,
      });

      const token = jwt.sign(
        { id: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
      );
      return {
        success: true,
        msg: 'Successfully registered',
        newUser,
        token,
      };
    } catch (error) {
      return {
        success: false,
        msg: 'Something went wrong',
        error: error,
      };
    }
  }

  // To login a user
  async login(loginDto: LoginDto): Promise<any> {
    const email = loginDto.email;
    const password = loginDto.password;
    try {
      const user = await this.Users.findOne({ email, password });
      if (!user)
        throw new HttpException('No such user exists', HttpStatus.NOT_FOUND);
      const isMatched = bcrypt.compare(password, user.password);
      if (isMatched) {
        const token = jwt.sign(
          { id: user._id.toString() },
          process.env.JWT_SECRET,
          { expiresIn: '24h' },
        );
        return {
          success: true,
          msg: 'login successful',
          user: user,
          token: token,
        };
      }
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    } catch (error) {
      return {
        success: false,
        msg: 'Something went wrong',
        error: error,
      };
    }
  }
}
