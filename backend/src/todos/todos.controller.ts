import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('todos')
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {

  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiBody({ type: CreateTodoDto })
  create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    return this.todosService.create(createTodoDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req) {
    return this.todosService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.todosService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.delete(id);
  }
}