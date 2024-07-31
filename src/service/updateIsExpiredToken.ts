import knex from 'knex';
import knexConfig from '../../knexfile';

const environment = 'development';
const db = knex(knexConfig[environment]);

export const updateIsExpiredToken = async () => {
    try {
        const result = await db('cardless_transaction')
            .update({ is_expired: true })
            .where('expired_at', '<', new Date())
            .andWhere('is_expired', '=', false);

        console.log('Some token is really expired now:', result);
    } catch (err) {
        console.error('Error:', err);
    }
};
