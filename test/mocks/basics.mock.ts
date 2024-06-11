import { Request, Response } from 'express';

export const responseMock = {
	status: jest.fn().mockReturnThis(),
	setHeader: jest.fn().mockReturnThis(),
	send: jest.fn().mockReturnThis(),
	json: jest.fn().mockReturnThis(),
} as unknown as Response;

export const requestMock = {
	query: {},
} as unknown as Request;
