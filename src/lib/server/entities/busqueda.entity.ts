import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rrhh_busquedas')
export class Busqueda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upload_id: number;

  @Column({ type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  puesto: string;

  @Column({ nullable: true })
  cantidad: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  responsable: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  sede: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  area: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  jefe: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  estado: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  fuente: string;

  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  condiciones: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  observaciones: string;

  @Column({ type: 'date', nullable: true })
  fecha_ingreso: Date;

  @Column({ type: 'float', nullable: true })
  dias_en_cerrarse: number;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  periodo: string;
}
