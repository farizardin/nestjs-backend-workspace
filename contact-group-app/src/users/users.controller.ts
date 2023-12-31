import { Controller, Request, Body, Post, Get, Put, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './user-dto/create-user.dto';
import { UpdateUserDto } from './user-dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtStrategy)
    @Get()
    async list(
        @Request() req: any,
        @Query() query: any
    ): Promise<any> {
        query['deletedAt'] = {
            equals: null,
        }
        this.usersService.setUser = req.user;
        const result = await this.usersService.listUser(query);

        return {
            data: result.map((r: any)=>({
                    id: r.id,
                    name: r.name,
                    email: r.email,
                    role: r.role,
            }))
        };
    }

    @UseGuards(JwtStrategy)
    @Get('/archived')
    async archived(
        @Request() req: any,
        @Query() query: any
    ): Promise<any> {
        query['deletedAt'] = {
            not: null,
        }
        this.usersService.setUser = req.user;
        const result = await this.usersService.listUser(query);
        return {
            data: result.map((r: any)=>({
                id: r.id,
                name: r.name,
                email: r.email,
                role: r.role,
        }))
        };
    }

    @Post('/signup')
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<any> {
        const result = await this.usersService.createUser(createUserDto);
        return {
            message: 'User successfully registered',
            data: {
                id: result.id,
                name: result.name,
                email: result.email,
            }
        };
    }

    @UseGuards(JwtStrategy)
    @Put(':id/update')
    async updateUser(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<any> {
        this.usersService.setUser = req.user;
        const result = await this.usersService.updateUser(id, updateUserDto);
        return {
            data: {
                id: result.id,
                name: result.name,
                email: result.email,
            }
        };
    }

    @UseGuards(JwtStrategy)
    @Delete(':id/archive')
    async archiveUser(
        @Request() req: any,
        @Param('id') id: string
    ): Promise<any> {
        this.usersService.setUser = req.user;
        const result = await this.usersService.softDeleteUser(id);
        return {
            data: {
                id: result.id,
                name: result.name,
                email: result.email,
            }
        };
    }

    @UseGuards(JwtStrategy)
    @Put(':id/restore')
    async restoreUser(
        @Request() req: any,
        @Param('id') id: string
    ): Promise<any> {
        this.usersService.setUser = req.user;
        const result = await this.usersService.restoreUser(id);
        return {
            data: {
                id: result.id,
                name: result.name,
                email: result.email,
            }
        };
    }

    @UseGuards(JwtStrategy)
    @Delete(':id/hard_delete')
    async deleteUser(
        @Request() req: any,
        @Param('id') id: string
    ): Promise<any> {
        this.usersService.setUser = req.user;
        const result = await this.usersService.hardDeleteUser(id);
        return {
            data: {
                id: result.id,
                name: result.name,
                email: result.email,
            }
        };
    }
}
