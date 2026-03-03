import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rrhh_altas_bajas')
export class AltaBaja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upload_id: number;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  legajo: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  apellido_nombre: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  clase_medida: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  descr_clase_medida: string;

  @Column({ type: 'float', nullable: true })
  motivo_medida: number;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  descr_motivo_medida: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  tipo: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  fecha_ingreso: string;

  @Column({ type: 'float', nullable: true })
  cod_ingreso: number;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  fecha_egreso: string;

  @Column({ type: 'float', nullable: true })
  cod_egreso: number;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  cuil: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  gerencia: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  clave_organizacional: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  descr_clave_organizacional: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  periodo: string;
}
