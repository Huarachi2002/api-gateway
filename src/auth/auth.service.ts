import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse, UserType } from './dto/auth-response.dto';
import { User, JwtPayload } from '../common/interfaces/user.interface';

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@lab.com',
      name: 'Admin User',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      role: 'ADMIN' as any,
      isActive: true,
      createdAt: new Date(),
    },
  ];

  private userPasswords = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Inicializar con usuario admin (password: admin123)
    this.userPasswords.set(
      '1',
      '$2b$10$YourHashedPasswordHere', // En producción, hashear correctamente
    );
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const existingUser = this.users.find(
      user => user.email === registerInput.email,
    );

    if (existingUser) {
      throw new ConflictException('El email ya esta registrado');
    }

    const hashedPassword = await bcrypt.hash(registerInput.password, 10);

    // Crear nuevo usuario
    const newUser: User = {
      id: uuidv4(),
      email: registerInput.email,
      name: registerInput.name,
      role: registerInput.role,
      isActive: true,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    this.userPasswords.set(newUser.id, hashedPassword);

    // Generar token JWT
    const tokens = await this.generateTokens(newUser);
    return {
      ...tokens,
      user: this.mapUserToUserType(newUser),
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = this.users.find(user => user.email === loginInput.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const hashedPassword = this.userPasswords.get(user.id);
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      hashedPassword || '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const tokens = await this.generateTokens(user);
    return {
      ...tokens,
      user: this.mapUserToUserType(user),
    };
  }

  validateUser(userId: string): User | null {
    const user = this.users.find(user => user.id === userId);
    return user && user.isActive ? user : null;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const user = this.validateUser(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        user: this.mapUserToUserType(user),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Token de actualización inválido');
    }
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private mapUserToUserType(user: User): UserType {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
