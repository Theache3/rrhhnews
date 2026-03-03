import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rrhh_capacitaciones')
export class Capacitacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upload_id: number;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  legajo: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  apellido: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  nombre: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  titulo_curso: string;

  @Column({ type: 'float', nullable: true })
  monto: number;

  @Column({ type: 'float', nullable: true })
  horas_duracion: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  institucion: string;

  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  clasificacion_actividad: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  area: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  posicion: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  cargo: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  genero: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  comentarios: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  periodo: string;
}
