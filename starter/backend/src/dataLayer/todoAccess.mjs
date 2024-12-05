import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import AWSXRay from 'aws-xray-sdk-core';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('TODO Access');

export class TodoAccess {
    constructor() {
        this.database = DynamoDBDocument.from(
            AWSXRay.captureAWSv3Client(new DynamoDB())
        );
        this.table = process.env.TODOS_TABLE;
        this.index = process.env.TODOS_CREATED_AT_INDEX;
    }

    getTodos = async (userId)=> {
        const Todos = await this.database.query({
            TableName: this.table,
            IndexName: this.index,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        return Todos.Items
    };

    createTodo = async (todo)=>{
        return await this.database.put({
            TableName: this.table,
            Item: todo
        })
    }

    updateTodo = async (item)=> {
        return await this.database.update({
            TableName: this.table,
            Key: {
                todoId: item.todoId,
                userId: item.userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': item.name,
                ':dueDate': item.dueDate,
                ':done': item.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            }
        })
    }

    deleteTodo = async (todoId, userId)=>{
        return await this.database.delete({
            TableName: this.table,
            Key: { todoId,
                userId
            }
        })
    }
}