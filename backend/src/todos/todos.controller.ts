import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 201,
    description: 'Todo created successfully',
    schema: {
      example: {
        _id: "64ab23d112",
        title: "joaquim",
        description: "getting there",
        userId: "789123abc"
      }
    }
  })
  create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    return this.todosService.create(createTodoDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'List of todos',
    schema: {
      example: [
        {
          _id: '64ab23d112',
          title: 'Sample todo',
          description: 'Example description',
          userId: '789123abc',
        },
      ],
    },
  })
  findAll(@Req() req) {
    return this.todosService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single todo by ID' })
  @ApiResponse({
    status: 200,
    description: 'Single todo returned',
    schema: {
      example: {
        _id: "64ab23d112",
        title: "joaquim",
        description: "getting there",
        userId: "789123abc"
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({
    status: 200,
    description: 'Todo updated successfully'
  })
  update(@Param('id') id: string, @Body() body) {
    return this.todosService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({
    status: 200,
    description: 'Todo deleted successfully'
  })
  remove(@Param('id') id: string) {
    return this.todosService.delete(id);
  }
}