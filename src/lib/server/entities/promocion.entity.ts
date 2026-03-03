import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rrhh_promociones')
export class Promocion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upload_id: number;

  @Column({ nullable: true })
  cantidad: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  nombre_apellido: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  legajo: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  puesto_anterior: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  puesto_actual: string;

  @Column({ type: 'date', nullable: true })
  fecha_promocion: Date;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  periodo: string;
}
