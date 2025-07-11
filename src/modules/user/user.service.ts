import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entities";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { FileService } from "../file-upload/file.service";
import { File } from "../file-upload/entities/file.entity";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import type { Express } from 'express';
import { UserRole } from "src/enum/userRol";

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

    async getUserById(id: string) {
        return this.userRepository.findOne({ where: { id }, relations: ['doctors', 'hospital', 'profileImage'] })
    }

    async getAllUsers() {
        return this.userRepository.find({ relations: ['doctors', 'hospital', 'profileImage'] })
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: { email },
            relations: ['profileImage']
        });
    }

    async getAdmins() {
        try {
            return await this.userRepository.find({
                where: { role: UserRole.ADMIN },
                relations: ['profileImage'],
            });
        } catch (error) {
            console.error('Error al obtener administradores:', error);
            throw new InternalServerErrorException('No se pudieron obtener los administradores');
        }
    }

    async getPatients() {
        try {
            return await this.userRepository.find({
                where: { role: UserRole.PATIENT },
                relations: ['hospital', 'doctors', 'profileImage'],
            });
        } catch (error) {
            console.error('Error al obtener pacientes:', error);
            throw new InternalServerErrorException('No se pudieron obtener los pacientes');
        }
    }


    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
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

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado')
        }

        const isMatch = await bcrypt.compare(changePasswordDto.currentPassword, user.password);

        if (!isMatch) {
            throw new ConflictException('La contraseña actual es incorrecta');
        }

        user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.userRepository.save(user);
        return { message: 'Contraseña actualizada correctamente' };
    }

    async findByResetToken(token: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { resetPasswordToken: token } });
    }

    async save(user: User) {
        return this.userRepository.save(user);
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['profileImage'],
        });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        try {
            if (user.profileImage) {
                user.profileImage = null;
                await this.userRepository.save(user);
            }
            if (user.profileImage) {
                await this.fileRepository.delete(user.profileImage.id);
            }
            await this.userRepository.delete(id);
            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw new InternalServerErrorException('No se pudo eliminar el usuario');
        }
    }

}