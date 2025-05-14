import { Post, Controller, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";



@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.register(createUserDto);
    }

}
