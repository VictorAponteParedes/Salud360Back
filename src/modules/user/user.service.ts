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

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        if (password !== confirmPassword) {
            throw new ConflictException('Las contraseñas no coinciden');
        }


        let profileImage: File | null = null;
        if (profileImageFile) {
            profileImage = await this.fileService.saveFile(profileImageFile);
        }
        else if (profileImageId) {
            profileImage = await this.fileRepository.findOneBy({ id: profileImageId });
        }

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
            relations: ['profileImage']
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

        if (user.profileImage) {
            await this.fileRepository.remove(user.profileImage);
        }

        const newProfileImage = await this.fileService.saveFile(file);
        user.profileImage = newProfileImage;

        return this.userRepository.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id },
            relations: ['profileImage']
        });
    }
}