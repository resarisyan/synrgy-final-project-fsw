import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  const password = await bcrypt.hash('password', 10);
  await knex('users').insert([
    {
      full_name: 'John Doe',
      pin: '123456',
      email: 'john@gmail.com',
      password,
      isEnabled: true,
      isDefaultPassword: true,
      account_number: '1234567890',
      balance: 1000000,
      username: 'john_doe',
      phone: '081234567890'
    },
    {
      full_name: 'Jane Doe',
      pin: '123456',
      email: 'jane@gmail.com',
      password,
      isEnabled: true,
      isDefaultPassword: true,
      account_number: '1234567891',
      balance: 1000000,
      username: 'jane_doe',
      phone: '081234567891'
    }
  ]);
}
