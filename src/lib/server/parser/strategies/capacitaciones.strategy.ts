import { ColumnDef } from '../column-mapper';

export const CAPACITACIONES_DATA_SHEET = ['hoja1', 'capacitaciones', 'cursos'];
export const CAPACITACIONES_MASTER_SHEET = ['dattos', 'datos', 'maestro'];

export const capacitacionesColumns: ColumnDef[] = [
  { dbField: 'legajo', aliases: ['legajo', 'nro legajo', 'leg'], required: true },
  { dbField: 'apellido', aliases: ['apellido'], required: false },
  { dbField: 'nombre', aliases: ['nombre'], required: false },
  { dbField: 'titulo_curso', aliases: ['titulo curso', 'titulo del curso', 'curso', 'nombre curso'], required: true },
  { dbField: 'monto', aliases: ['monto', 'costo', 'inversion'], required: false },
  { dbField: 'horas_duracion', aliases: ['horas de duracion', 'horas', 'duracion', 'hs'], required: false },
  { dbField: 'institucion', aliases: ['institucion', 'proveedor', 'entidad'], required: false },
  { dbField: 'fecha', aliases: ['fecha', 'fecha de capacitacion', 'fecha curso'], required: false },
  { dbField: 'clasificacion_actividad', aliases: ['clasificacion de actividad', 'clasificacion', 'tipo actividad'], required: false },
  { dbField: 'area', aliases: ['area', 'sector'], required: false },
  { dbField: 'posicion', aliases: ['posicion', 'puesto'], required: false },
  { dbField: 'cargo', aliases: ['cargo'], required: false },
  { dbField: 'genero', aliases: ['genero', 'sexo'], required: false },
  { dbField: 'comentarios', aliases: ['comentarios', 'observaciones', 'notas'], required: false },
];
