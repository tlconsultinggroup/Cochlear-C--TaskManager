import request from 'supertest';
import express from 'express';
import { app } from '../index';

describe('Task API Endpoints', () => {
    let server: express.Application;
    
    beforeAll(() => {
        server = app;
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(server).get('/health');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status', 'ok');
            expect(res.body).toHaveProperty('timestamp');
        });
    });

    describe('GET /api/tasks', () => {
        it('should return all tasks', async () => {
            const res = await request(server).get('/api/tasks');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const res = await request(server)
                .post('/api/tasks')
                .send({ title: 'Test Task' });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe('Test Task');
            expect(res.body.completed).toBe(false);
        });

        it('should return 400 if title is missing', async () => {
            const res = await request(server)
                .post('/api/tasks')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PATCH /api/tasks/:id', () => {
        let taskId: number;

        beforeEach(async () => {
            const res = await request(server)
                .post('/api/tasks')
                .send({ title: 'Task to Toggle' });
            taskId = res.body.id;
        });

        it('should toggle task completion', async () => {
            const res = await request(server)
                .patch(`/api/tasks/${taskId}`);

            expect(res.status).toBe(200);
            expect(res.body.completed).toBe(true);
        });

        it('should return 404 for non-existent task', async () => {
            const res = await request(server)
                .patch('/api/tasks/999');

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        let taskId: number;

        beforeEach(async () => {
            const res = await request(server)
                .post('/api/tasks')
                .send({ title: 'Task to Delete' });
            taskId = res.body.id;
        });

        it('should delete a task', async () => {
            const res = await request(server)
                .delete(`/api/tasks/${taskId}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Task deleted successfully');
        });

        it('should return 404 for non-existent task', async () => {
            const res = await request(server)
                .delete('/api/tasks/999');

            expect(res.status).toBe(404);
        });
    });
});
