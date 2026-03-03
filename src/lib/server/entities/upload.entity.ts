import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('rrhh_uploads')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  file_type: string;

  @Column({ nullable: true })
  period: string;

  @Column({ default: 0 })
  rows_imported: number;

  @Column({ default: 'processing' })
  status: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  error_message: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  parse_report: string;

  @CreateDateColumn()
  created_at: Date;
}
