import { ColumnDef } from '../column-mapper';

export const NOMINA_DOTACION_SHEET = ['dotacion activa', 'dotacion', 'nomina'];
export const NOMINA_ALTAS_BAJAS_SHEET = ['bajas y altas', 'altas y bajas', 'movimientos'];

export const nominaColumns: ColumnDef[] = [
  { dbField: 'legajo', aliases: ['legajo', 'nro legajo'], required: true },
  { dbField: 'apellido', aliases: ['apellido'], required: true },
  { dbField: 'nombre', aliases: ['nombre'], required: true },
  { dbField: 'jefe_directo', aliases: ['jefe directo', 'jefe', 'supervisor'], required: false },
  { dbField: 'compania', aliases: ['compania', 'empresa', 'sociedad'], required: false },
  { dbField: 'gerencia', aliases: ['gerencia'], required: false },
  { dbField: 'gerencia_depto_region', aliases: ['gerencia depto/region', 'gerencia depto', 'region'], required: false },
  { dbField: 'departamento', aliases: ['departamento', 'depto'], required: false },
  { dbField: 'division_personal', aliases: ['division de personal', 'division personal', 'division'], required: false },
  { dbField: 'subdivision_personal', aliases: ['subdivision de personal', 'subdivision personal', 'subdivision'], required: false },
  { dbField: 'centro_costo', aliases: ['centro de costo (ceco)', 'centro de costo', 'ceco', 'centro costo'], required: false },
  { dbField: 'posicion', aliases: ['posicion'], required: false },
  { dbField: 'nombre_posicion', aliases: ['nombre de la posicion', 'nombre posicion', 'desc posicion'], required: false },
  { dbField: 'funcion', aliases: ['funcion', 'rol'], required: false },
  { dbField: 'grupo_empleado', aliases: ['grupo de empleado', 'grupo empleado'], required: false },
  { dbField: 'subgrupo_empleado', aliases: ['subgrupo de empleado', 'subgrupo empleado'], required: false },
  { dbField: 'fecha_ingreso', aliases: ['datos de ingreso fecha de ingreso', 'fecha de ingreso', 'fecha ingreso', 'f.ingreso'], required: false },
  { dbField: 'fecha_antiguedad', aliases: ['datos de ingreso fecha de antiguedad reconocida', 'fecha antiguedad', 'antiguedad reconocida'], required: false },
  { dbField: 'antiguedad', aliases: ['antiguedad', 'antig'], required: false },
  { dbField: 'fecha_nacimiento', aliases: ['fecha de nacimiento', 'fecha nacimiento', 'f.nacimiento'], required: false },
  { dbField: 'edad', aliases: ['edad'], required: false },
  { dbField: 'email', aliases: ['email laboral', 'email', 'direccion de email', 'correo'], required: false },
  { dbField: 'cargo', aliases: ['cargo'], required: false },
];

export const altasBajasColumns: ColumnDef[] = [
  { dbField: 'legajo', aliases: ['legajo', 'nro legajo'], required: true },
  { dbField: 'apellido_nombre', aliases: ['apellido y nombre', 'apellido nombre', 'nombre completo'], required: false },
  { dbField: 'clase_medida', aliases: ['cm', 'clase medida'], required: false },
  { dbField: 'descr_clase_medida', aliases: ['descr.clase medida', 'descripcion clase medida', 'desc clase medida'], required: false },
  { dbField: 'motivo_medida', aliases: ['mm', 'motivo medida'], required: false },
  { dbField: 'descr_motivo_medida', aliases: ['descripcion motivo de medida', 'descripcion motivo medida', 'desc motivo'], required: false },
  { dbField: 'tipo', aliases: ['a/b', 'tipo', 'alta/baja'], required: false },
  { dbField: 'fecha_ingreso', aliases: ['f.ingreso', 'fecha ingreso', 'fecha de ingreso'], required: false },
  { dbField: 'cod_ingreso', aliases: ['cd.ingr', 'cod ingreso', 'codigo ingreso'], required: false },
  { dbField: 'fecha_egreso', aliases: ['f.egreso', 'fecha egreso', 'fecha de egreso'], required: false },
  { dbField: 'cod_egreso', aliases: ['cd.egres', 'cod egreso', 'codigo egreso'], required: false },
  { dbField: 'cuil', aliases: ['nro. c.u.i.l.', 'cuil', 'cuit'], required: false },
  { dbField: 'gerencia', aliases: ['gerencia'], required: false },
  { dbField: 'clave_organizacional', aliases: ['clave organiz.', 'clave organizacional', 'clave org'], required: false },
  { dbField: 'descr_clave_organizacional', aliases: ['descripcion clave organizac.', 'descripcion clave organizacional', 'desc clave org'], required: false },
];
