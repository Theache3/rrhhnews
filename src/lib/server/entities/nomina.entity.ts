import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rrhh_nomina')
export class Nomina {
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

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  jefe_directo: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  compania: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  gerencia: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  gerencia_depto_region: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  departamento: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  division_personal: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  subdivision_personal: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  centro_costo: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  posicion: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  nombre_posicion: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  funcion: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  grupo_empleado: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  subgrupo_empleado: string;

  @Column({ type: 'date', nullable: true })
  fecha_ingreso: Date;

  @Column({ type: 'date', nullable: true })
  fecha_antiguedad: Date;

  @Column({ nullable: true })
  antiguedad: number;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ nullable: true })
  edad: number;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  email: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  cargo: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  periodo: string;
}
