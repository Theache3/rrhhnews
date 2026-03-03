import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Upload, Busqueda, Promocion, Capacitacion, Nomina, AltaBaja } from './entities';

const entities = [Upload, Busqueda, Promocion, Capacitacion, Nomina, AltaBaja];

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource?.isInitialized) return dataSource;
  const password = process.env.DB_PASSWORD ?? '';
  dataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    username: process.env.DB_USERNAME || 'sa',
    password,
    database: process.env.DB_DATABASE || 'rrhh',
    entities,
    synchronize: true,
    options: { encrypt: true, trustServerCertificate: false },
  });
  await dataSource.initialize();
  return dataSource;
}
