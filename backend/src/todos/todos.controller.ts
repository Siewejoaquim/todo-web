import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ApiBody, ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBody({ type: CreateTodoDto })
  create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    return this.todosService.create(createTodoDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get todos for the logged-in user' })
  @ApiQuery({ name: 'type', enum: ['today', 'scheduled', 'completed'], required: false })
  findAll(
    @Req() req,
    @Query('type') type: 'today' | 'scheduled' | 'completed' = 'today',
    @Query('category') category?: string,
  ) {
    return this.todosService.findAll(req.user.userId, type, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single todo by ID' })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  update(@Param('id') id: string, @Body() body) {
    return this.todosService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  remove(@Param('id') id: string) {
    return this.todosService.delete(id);
  }
}
