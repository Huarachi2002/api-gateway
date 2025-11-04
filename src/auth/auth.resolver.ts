import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse, UserType } from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../common/interfaces/user.interface';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse, { description: 'Registrar nuevo usuario' })
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Public()
  @Mutation(() => AuthResponse, { description: 'Iniciar sesion de usuario' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Public()
  @Mutation(() => AuthResponse, { description: 'Refrescar token' })
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshToken);
  }

  @Query(() => UserType, { description: 'Obtener usuario actual' })
  me(@CurrentUser() user: User): UserType {
    const currentUser = this.authService.validateUser(user.id);

    if (!currentUser) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      isActive: currentUser.isActive,
      createdAt: currentUser.createdAt,
    };
  }
}
