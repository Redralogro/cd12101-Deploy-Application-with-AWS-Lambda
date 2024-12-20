import { TodoAccess } from "../dataLayer/todoAccess.mjs";
import * as uuid from 'uuid';

const todoAccess = new TodoAccess();

export const createTodo = async (todo, userId) => {
    const todoId = uuid.v4();
    const todoItem = {
        todoId: todoId,
        name: todo.name,
        userId,
        dueDate: todo.dueDate,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
    }
    await todoAccess.createTodo(todoItem);
    return todoItem
} 

export const updateTodo = async (updatedTodo, userId, todoId) => {
    const updateItem = {
        todoId,
        name: updatedTodo.name,
        dueDate: updatedTodo.dueDate,
        done: false,
        userId
    }
    return await todoAccess.updateTodo(updateItem);
}

export const deleteTodo = async (todoId, userId ) => {
    return await todoAccess.deleteTodo(todoId, userId );
}

export const getTodos = async (userId) => {
    return await todoAccess.getTodos(userId);
}