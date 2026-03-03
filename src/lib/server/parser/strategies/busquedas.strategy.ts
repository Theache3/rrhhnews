import { ColumnDef } from '../column-mapper';

export const BUSQUEDAS_SHEET_PATTERNS = ['busqueda'];
export const PROMOCIONES_SHEET_PATTERNS = ['promocion'];

export const busquedasColumns: ColumnDef[] = [
  { dbField: 'fecha_inicio', aliases: ['fecha de inicio', 'fecha inicio', 'f. inicio'], required: false },
  { dbField: 'puesto', aliases: ['puesto', 'posicion buscada', 'cargo buscado'], required: true },
  { dbField: 'cantidad', aliases: ['cantidad', 'cant', 'qty'], required: false },
  { dbField: 'responsable', aliases: ['responsable de busqueda', 'responsable', 'recruiter'], required: false },
  { dbField: 'sede', aliases: ['sede', 'ubicacion', 'locacion'], required: false },
  { dbField: 'area', aliases: ['area', 'sector'], required: false },
  { dbField: 'jefe', aliases: ['jefe', 'jefe directo', 'supervisor'], required: false },
  { dbField: 'estado', aliases: ['estado', 'status'], required: true },
  { dbField: 'fuente', aliases: ['fuente', 'consultora', 'fuente (consultora-mail-linkedin)'], required: false },
  { dbField: 'condiciones', aliases: ['condiciones', 'condiciones (jornada-modalidad-bono- convenio)'], required: false },
  { dbField: 'observaciones', aliases: ['observaciones', 'observaciones - etapa', 'comentarios'], required: false },
  { dbField: 'fecha_ingreso', aliases: ['fecha de ingreso', 'fecha ingreso', 'ingreso'], required: false },
  { dbField: 'dias_en_cerrarse', aliases: ['dias en cerrarse', 'dias', 'tiempo de cierre'], required: false },
];

export const promocionesColumns: ColumnDef[] = [
  { dbField: 'cantidad', aliases: ['cantidad', 'cant'], required: false },
  { dbField: 'nombre_apellido', aliases: ['nombre y apellido', 'nombre apellido', 'empleado'], required: false },
  { dbField: 'legajo', aliases: ['legajo', 'nro legajo', 'leg'], required: false },
  { dbField: 'puesto_anterior', aliases: ['puesto anterior', 'cargo anterior'], required: false },
  { dbField: 'puesto_actual', aliases: ['puesto actual', 'cargo actual', 'nuevo puesto'], required: false },
  { dbField: 'fecha_promocion', aliases: ['fecha de promocion', 'fecha promocion', 'fecha'], required: false },
];
