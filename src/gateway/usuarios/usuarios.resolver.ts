import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './dto/usuario.type';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';
import { LoginResponse } from './interfaces/login-response.interface';
import { LoginUsuarioInput } from './dto/login-usuario.input';
import { Rol } from './dto/rol.type';

/**
 * 🏥 USERS RESOLVER
 *
 * Este resolver expone operaciones GraphQL para gestionar pacientes.
 * Internamente, hace llamadas HTTP al microservicio de pacientes (Spring Boot/FastAPI).
 *
 *
 * Flujo:
 * 1. Cliente envía query/mutation GraphQL
 * 2. Este resolver recibe la petición
 * 3. Llama al UsuariosService
 * 4. UsuariosService hace HTTP request al microservicio externo
 * 5. Respuesta del microservicio se devuelve al cliente
 */
@Resolver(() => Usuario)
export class UsuariosResolver {
  constructor(private UsuariosService: UsuariosService) {}

  @Query(() => [Rol], {
    name: 'roles',
    description: 'Obtener todos los roles disponibles',
  })
  async getAllRoles(): Promise<Rol[]> {
    return this.UsuariosService.getAllRoles();
  }

  @Query(() => Rol, {
    name: 'rol',
    description: 'Obtener un rol por su ID',
  })
  async getRolById(@Args('id', { type: () => ID }) id: string): Promise<Rol> {
    return this.UsuariosService.getRolById(id);
  }

  @Query(() => Usuario, {
    name: 'usuario',
    description: 'Obtener un usuario por su ID',
  })
  async getUsuarioById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Usuario> {
    return this.UsuariosService.findById(id);
  }

  @Query(() => Usuario, {
    name: 'usuarioPorPacienteId',
    description: 'Obtener un usuario por su ID de paciente',
  })
  async getUsuarioByPacienteId(
    @Args('idPaciente', { type: () => ID }) idPaciente: number,
  ): Promise<Usuario> {
    return this.UsuariosService.findByPacienteId(idPaciente);
  }

  @Query(() => [Usuario], {
    name: 'usuarios',
    description: 'Obtener todos los usuarios',
  })
  async getAllUsuarios(): Promise<Usuario[]> {
    return this.UsuariosService.findAll();
  }

  @Mutation(() => Usuario, {
    name: 'createUsuario',
    description: 'Crear un nuevo usuario',
  })
  async createUsuario(
    @Args('input') input: CreateUsuarioInput,
  ): Promise<Usuario> {
    return this.UsuariosService.createUser(input);
  }

  @Mutation(() => Usuario, {
    description: 'Actualizar un usuario existente',
  })
  async updateUsuario(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUsuarioInput,
  ): Promise<Usuario> {
    return this.UsuariosService.updateUser(id, input);
  }

  @Mutation(() => LoginResponse, {
    name: 'login',
    description: 'Iniciar sesión de un usuario',
  })
  async login(
    @Args('loginInput') loginInput: LoginUsuarioInput,
  ): Promise<LoginResponse> {
    return this.UsuariosService.login(
      loginInput.nombreUsuario,
      loginInput.contrasena,
    );
  }
}
