import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	DocumentBuilder,
	SwaggerDocumentOptions,
	SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import { logger } from './common/middlewares/logger.middleware';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// enable helmet - collection of middlewares to help secure your apps by setting various HTTP headers
	app.use(helmet());

	// cors middleware
	app.enableCors({
		origin: true, // Reflect the request origin
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow all HTTP methods including OPTIONS
		// allowedHeaders: 'Content-Type, Accept, Authorization', // Specify allowed headers if needed
		exposedHeaders: '', // Expose no additional headers
		credentials: true, // Allow credentials (cookies) from the client if needed
		maxAge: 86400, // Cache preflight response for 1 day (in seconds)
		preflightContinue: false, // Disable preflight OPTIONS request handling
		optionsSuccessStatus: 204, // Set successful OPTIONS response status code
	});

	// enable cookie parser
	app.use(cookieParser());

	// global logger middleware
	// app.use(logger);

	// enable shutdown hook
	app.enableShutdownHooks();

	// validation pipe for all requests
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			//   disableErrorMessages: true,
		}),
	);

	// swagger
	const config = new DocumentBuilder()
		.setTitle('Menumal API')
		.setDescription('The Menumal API description')
		.setVersion('1.0')
		.addTag('users')
		.addBearerAuth()
		.build();

	// generate operationId based on methodKey - default would be controllerKey_methodKey
	const options: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
	};

	const document = SwaggerModule.createDocument(app, config, options);

	SwaggerModule.setup('api', app, document); //4th parameter is options for customizing swagger UI

	await app.listen(3000);
}
bootstrap();
