import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entities";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { FileService } from "../file-upload/file.service";
import { File } from "../file-upload/entities/file.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(File)
        private fileRepository: Repository<File>,
        private fileService: FileService
    ) { }

    async register(createUserDto: CreateUserDto, profileImageFile?: Express.Multer.File) {
        const { email, password, confirmPassword, profileImageId } = createUserDto;

        // Validaciones...

        let profileImage: File | null = null;

        // Si se subió un archivo nuevo
        if (profileImageFile) {
            profileImage = await this.fileService.saveFile(profileImageFile);
        }
        // Si se proporcionó un ID de imagen existente
        else if (profileImageId) {
            profileImage = await this.fileRepository.findOneBy({ id: profileImageId });
        }

        // Crear usuario
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            profileImage
        });

        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: { email },
            relations: ['profileImage'] // Carga la relación con la imagen
        });
    }

    async updateProfileImage(userId: string, file: Express.Multer.File) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['profileImage']
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Eliminar la imagen anterior si existe
        if (user.profileImage) {
            await this.fileRepository.remove(user.profileImage);
        }

        // Guardar nueva imagen
        const newProfileImage = await this.fileService.saveFile(file);
        user.profileImage = newProfileImage;

        return this.userRepository.save(user);
    }
}