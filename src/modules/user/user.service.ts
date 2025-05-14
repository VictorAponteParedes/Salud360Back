import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entities";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async register(createUserDto: CreateUserDto) {
        const { email, password, confirmPassword } = createUserDto;

        const existingUser = await this.userRepository.findOne({ where: { email } })

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        if (password !== confirmPassword) {
            throw new ConflictException('Las contraseñas no coinciden');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword
        })

        return this.userRepository.save(user)
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

}
