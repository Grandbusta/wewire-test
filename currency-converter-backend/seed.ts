import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';
import { User } from './src/auth/entity/user.entity';
import { UserBalance } from './src/auth/entity/user-balance.entity'; 
import * as bcrypt from 'bcrypt';
import { SUPPORTED_CURRENCIES } from './src/constants/supported-currencies';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  
  const dataSource = appContext.get(DataSource);
  const userRepository = dataSource.getRepository(User);
  const userBalanceRepository = dataSource.getRepository(UserBalance);

  const existingUser = await userRepository.findOne({ where: { email: 'test@example.com' } });
  if (existingUser) {
    console.log('User already exists');
  } else {
    const hashedPassword = await bcrypt.hash(process.env.USER_PASSWORD, 10);

    const user = userRepository.create({
      email: 'test@example.com',
      password: hashedPassword,
    });

    await userRepository.save(user);
    console.log('User seeded successfully!');

    for (const currency of SUPPORTED_CURRENCIES) {
      const userBalance = userBalanceRepository.create({
        user,
        currency,
        amount: 1000,
      });
      await userBalanceRepository.save(userBalance);
      console.log(`Balance for ${currency} seeded successfully!`);
    }
  }
  
  await appContext.close();
}

bootstrap();
