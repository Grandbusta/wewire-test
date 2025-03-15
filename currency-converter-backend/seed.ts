// seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';
import { User } from './src/auth/entity/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  
  const dataSource = appContext.get(DataSource);
  const userRepository = dataSource.getRepository(User);

  const existingUser = await userRepository.findOne({ where: { email: 'test@example.com' } });
  if (existingUser) {
    console.log('User already exists');
  } else {
    const hashedPassword = await bcrypt.hash(process.env.USER_PASSWORD, 10);

    const user = userRepository.create({
      email: 'test@example.com',
      password: hashedPassword,
    });

    // Save the new user to the database
    await userRepository.save(user);
    console.log('User seeded successfully!');
  }
  
  await appContext.close();
}

bootstrap();
