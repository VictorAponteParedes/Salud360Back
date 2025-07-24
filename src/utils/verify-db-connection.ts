import { Client } from 'pg';

export async function verifyPostgresConnection(config: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}) {
  const client = new Client({
    ...config,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Conexión directa a PostgreSQL exitosa');
  } catch (err) {
    console.error('❌ Falló conexión directa a PostgreSQL:', err.message);
  } finally {
    await client.end();
  }
}
