import { ROADMAP_STAGES_00_03 } from "./etapas-00-03.js";
import { ROADMAP_STAGES_04_07 } from "./etapas-04-07.js";
import { ROADMAP_STAGES_08_11 } from "./etapas-08-11.js";

export const ROADMAP_DATA = {
  publicationTarget: "2027-01-22",
  projectStatus: "V3.13.1 publicada · desarrollo activo",
  projectStatusNote: "Estado obtenido del repositorio público el 6 de septiembre de 2026. Los elementos marcados como hechos se han comprobado en código y recursos; las pruebas de uso real siguen pendientes.",
  nextMilestone: { label: "Cerrar validación técnica y móvil", date: "2026-09-12", estimated: true },
  stages: [...ROADMAP_STAGES_00_03, ...ROADMAP_STAGES_04_07, ...ROADMAP_STAGES_08_11]
};
