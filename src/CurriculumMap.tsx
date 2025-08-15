import React, { useMemo, useState, useEffect } from "react";
import { BookOpenText, Info, Download, Upload, Filter } from "lucide-react";

/**
 * UNAD LiLEI – Curriculum Map (Interactive)
 * - "Periodo" → Semestre
 * - Semestres 1–10 primero
 * - Select para agregar electivas por semestre (límite global 27 cr)
 * - Botón Ocultar/Mostrar por semestre
 * - Badges (tipo) y "Cursada/Quitar" siempre dentro del recuadro
 */

// ---------------- Types ----------------
export type TipoCurso = "Obligatorio" | "Electivo";
export interface Curso {
  id: string;
  codigo: string;
  curso: string;
  creditos: number;
  tipo: TipoCurso;
  clasificacion: string; // FC | IBC | DC | DE | otros
  periodo?: number; // semestre
  prereqs?: string[];
}

// -------------- UI helpers --------------
const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

type DivProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };
type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { className?: string; variant?: "secondary" | "outline" };
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { className?: string };

const Card: React.FC<DivProps> = ({ className = "", ...rest }) => (
  <div className={cn("rounded-2xl border bg-white/90 shadow-sm", className)} {...rest} />
);
const CardHeader: React.FC<DivProps> = ({ className = "", ...rest }) => (
  <div className={cn("px-4 pt-4", className)} {...rest} />
);
const CardTitle: React.FC<DivProps> = ({ className = "", ...rest }) => (
  <div className={cn("text-sm font-medium text-rose-900", className)} {...rest} />
);
const CardContent: React.FC<DivProps> = ({ className = "", ...rest }) => (
  <div className={cn("px-4 pb-4", className)} {...rest} />
);

const Badge: React.FC<SpanProps> = ({ className = "", variant = "outline", ...rest }) => {
  const base = "inline-flex items-center rounded-xl px-2 py-0.5 text-xs";
  const styles = variant === "secondary" ? "bg-rose-100 text-rose-900" : "border border-rose-300 text-rose-700";
  return <span className={cn(base, styles, className)} {...rest} />;
};

const Button: React.FC<ButtonProps> = ({ className = "", children, ...rest }) => (
  <button className={cn("inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-900 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-300", className)} {...rest}>{children}</button>
);

const Input: React.FC<InputProps> = ({ className = "", ...rest }) => (
  <input className={cn("w-full rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-rose-300", className)} {...rest} />
);

// -------------- DATA --------------
// Obligatorios reorganizados por semestre según tu indicación + correcciones.
const DATA: Curso[] = [
  // Semestre 1
  { id: "503438689", codigo: "503438689", curso: "Elementary English", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 1 },
  { id: "503438688", codigo: "503438688", curso: "Introducción a la Licenciatura en Lenguas Extranjeras con énfasis en Inglés", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 1 },
  { id: "80017", codigo: "80017", curso: "Cátedra Unadista", creditos: 3, tipo: "Obligatorio", clasificacion: "Acogida/Integración", periodo: 1 },
  { id: "40003", codigo: "40003", curso: "Competencias Comunicativas", creditos: 3, tipo: "Obligatorio", clasificacion: "IBC", periodo: 1 },
  { id: "40002", codigo: "40002", curso: "Ética y ciudadanía", creditos: 3, tipo: "Obligatorio", clasificacion: "IBC", periodo: 1 },

  // Semestre 2 (Créditos: 16)
  { id: "518002", codigo: "518002", curso: "English I", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 2 },
  { id: "520027", codigo: "520027", curso: "Epistemología e historia de la pedagogía", creditos: 4, tipo: "Obligatorio", clasificacion: "DC", periodo: 2 },
  { id: "700004", codigo: "700004", curso: "Prestación servicio social unadista (Requisito de grado)", creditos: 0, tipo: "Obligatorio", clasificacion: "Requisito de grado", periodo: 2 },
  { id: "517031", codigo: "517031", curso: "Matemáticas para la Resolución de Problemas", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 2 },
  { id: "200611", codigo: "200611", curso: "Pensamiento Lógico y Matemático", creditos: 3, tipo: "Obligatorio", clasificacion: "IBC", periodo: 2 },
  { id: "200610", codigo: "200610", curso: "Herramientas digitales para la gestión del conocimiento", creditos: 3, tipo: "Obligatorio", clasificacion: "IBC", periodo: 2 },

  // Semestre 3 (Créditos: 16)
  { id: "518007", codigo: "518007", curso: "English II", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 3, prereqs: ["518002"] },
  { id: "517022", codigo: "517022", curso: "Teorías del Aprendizaje", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 3 },
  { id: "150001", codigo: "150001", curso: "Fundamentos y Generalidades de la Investigación", creditos: 3, tipo: "Obligatorio", clasificacion: "IBC", periodo: 3 },
  { id: "503438691", codigo: "503438691", curso: "Introduction to Linguistics", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 3 },
  { id: "518015", codigo: "518015", curso: "Foreign Language Acquisition and Learning", creditos: 2, tipo: "Obligatorio", clasificacion: "DE", periodo: 3 },
  { id: "518003", codigo: "518003", curso: "Lengua Materna", creditos: 2, tipo: "Obligatorio", clasificacion: "DE", periodo: 3 },

  // Semestre 4 (Créditos: 16)
  { id: "518008", codigo: "518008", curso: "English III", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 4, prereqs: ["518007"] },
  { id: "520026", codigo: "520026", curso: "Evaluación", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 4 },
  { id: "517020", codigo: "517020", curso: "Didáctica", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 4 },
  { id: "518014", codigo: "518014", curso: "English Phonetics", creditos: 2, tipo: "Obligatorio", clasificacion: "DE", periodo: 4 },
  { id: "520025", codigo: "520025", curso: "Ética de la Profesión Docente", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 4 },
  // + Curso Electivo FC

  // Semestre 5 (Créditos: 18)
  { id: "518009", codigo: "518009", curso: "English IV", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 5, prereqs: ["518008"] },
  { id: "517021", codigo: "517021", curso: "Enfoques Curriculares", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 5 },
  { id: "518005", codigo: "518005", curso: "Methodology in Foreign Language Teaching", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 5 },
  { id: "503438690", codigo: "503438690", curso: "Didactics of English", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 5 },
  { id: "500001", codigo: "500001", curso: "Administración y Gestión Educativas", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 5 },
  // + Curso Electivo IBC

  // Semestre 6 (Créditos: 17)
  { id: "518010", codigo: "518010", curso: "English V", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 6, prereqs: ["518009"] },
  { id: "517027", codigo: "517027", curso: "Educación para la Transformación Social", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 6 },
  { id: "518004", codigo: "518004", curso: "Teaching English to Children, Adolescents and Adults", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 6 },
  { id: "503438692", codigo: "503438692", curso: "Materials Design in EFL", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 6 },
  // + Curso Electivo DE
  // + Curso Electivo IBC

  // Semestre 7 (Créditos: 17)
  { id: "518011", codigo: "518011", curso: "English VI", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 7, prereqs: ["518010"] },
  { id: "517028", codigo: "517028", curso: "Escenarios Educativos Inclusivos", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 7 },
  { id: "518006", codigo: "518006", curso: "Technology in Foreign Language Teaching", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 7 },
  { id: "503438693", codigo: "503438693", curso: "Intercultural Competence in ELT", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 7 },
  { id: "518023", codigo: "518023", curso: "Testing and Evaluation in ELT", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 7 },
  // + Curso Electivo DE

  // Semestre 8 (Créditos: 17)
  { id: "518012", codigo: "518012", curso: "English VII - English Conversation", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 8, prereqs: ["518011"] },
  { id: "517023", codigo: "517023", curso: "Investigación Educativa y Pedagógica", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 8 },
  { id: "518018", codigo: "518018", curso: "Integral Pedagogical Practice", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 8 },
  { id: "518021", codigo: "518021", curso: "Teacher Development", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 8 },
  // + Curso Electivo DE
  // + Curso Electivo DC

  // Semestre 9 (Créditos: 16)
  { id: "503438694", codigo: "503438694", curso: "English VIII - Academic Writing", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 9 },
  { id: "518024", codigo: "518024", curso: "Educational Research", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 9 },
  { id: "518019", codigo: "518019", curso: "Research Pedagogical Practice", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 9 },
  // + Curso Electivo DE
  // + Curso Electivo FC
  // + Curso Electivo DC

  // Semestre 10 (Créditos: 12)
  { id: "517018_TIC", codigo: "517018", curso: "Prácticas educativas mediadas por TIC", creditos: 3, tipo: "Obligatorio", clasificacion: "DC", periodo: 10 },
  { id: "503438695", codigo: "503438695", curso: "Research Project", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 10, prereqs: ["518024"] },
  { id: "518020", codigo: "518020", curso: "Pedagogical Practice in Online Environments", creditos: 3, tipo: "Obligatorio", clasificacion: "DE", periodo: 10 },
  { id: "OPCGRADO", codigo: "OPC", curso: "Opción de Grado (Requisito)", creditos: 0, tipo: "Obligatorio", clasificacion: "Requisito de grado", periodo: 10 },
  // + Curso Electivo DE

  // ============= ELECTIVAS (seleccionables por semestre) =============
  // FC (Formación Complementaria)
  { id: "300040", codigo: "300040", curso: "Hoja de Vida", creditos: 1, tipo: "Electivo", clasificacion: "FC" },
  { id: "80003", codigo: "80003", curso: "Salud Oral", creditos: 2, tipo: "Electivo", clasificacion: "FC" },
  { id: "80005", codigo: "80005", curso: "Guitarra", creditos: 1, tipo: "Electivo", clasificacion: "FC" },
  { id: "80008", codigo: "80008", curso: "Pedagogía para la Solución de Conflictos", creditos: 2, tipo: "Electivo", clasificacion: "FC" },
  { id: "80011", codigo: "80011", curso: "Discapacidad y Sexualidad", creditos: 2, tipo: "Electivo", clasificacion: "FC" },
  { id: "80002", codigo: "80002", curso: "Proyecto de Vida", creditos: 2, tipo: "Electivo", clasificacion: "FC" },
  { id: "80004", codigo: "80004", curso: "La Persona como Ser Trascendente", creditos: 2, tipo: "Electivo", clasificacion: "FC" },
  { id: "80007", codigo: "80007", curso: "Protocolo", creditos: 1, tipo: "Electivo", clasificacion: "FC" },
  { id: "80010", codigo: "80010", curso: "Teatro", creditos: 1, tipo: "Electivo", clasificacion: "FC" },
  { id: "80012", codigo: "80012", curso: "Danza", creditos: 2, tipo: "Electivo", clasificacion: "FC" },
  
  // IBC
  { id: "ELE_A1", codigo: "ELE-A1", curso: "Curso Electivo de Lengua Extranjera A1", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "ELE_A2", codigo: "ELE-A2", curso: "Curso Electivo de Lengua Extranjera A2", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "40004", codigo: "40004", curso: "Inclusión Social", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "40006", codigo: "40006", curso: "Sostenibilidad, Desarrollo y Calidad de Vida", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "90007", codigo: "90007", curso: "Cultura Política", creditos: 2, tipo: "Electivo", clasificacion: "IBC" },
  { id: "105020", codigo: "105020", curso: "Emprendimiento Solidario", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "204040", codigo: "204040", curso: "Estadística Descriptiva", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "40005", codigo: "40005", curso: "Sujeto, Comunidad e Interacción Social", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "358028", codigo: "358028", curso: "Educación Ambiental", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "112001", codigo: "112001", curso: "Fundamentos de Gestión Integral", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "120002", codigo: "120002", curso: "Responsabilidad Social Empresarial", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  { id: "105019", codigo: "105019", curso: "Investigación Cualitativa", creditos: 3, tipo: "Electivo", clasificacion: "IBC" },
  
  // DC
  { id: "50003", codigo: "50003", curso: "Diseño de Ambientes de Aprendizaje", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "50017", codigo: "50017", curso: "Comunicación Escrita", creditos: 2, tipo: "Electivo", clasificacion: "DC" },
  { id: "50020", codigo: "50020", curso: "Razonamiento Cuantitativo", creditos: 2, tipo: "Electivo", clasificacion: "DC" },
  { id: "514520", codigo: "514520", curso: "Desarrollo Psicobiológico de la Infancia y la Adolescencia", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "518025", codigo: "518025", curso: "Modelos Pedagógicos", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "520024", codigo: "520024", curso: "Legislación Educativa", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "50011", codigo: "50011", curso: "Educación Inclusiva en Ambientes de Aprendizaje", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "50018", codigo: "50018", curso: "Competencias Ciudadanas", creditos: 2, tipo: "Electivo", clasificacion: "DC" },
  { id: "401432", codigo: "401432", curso: "Etnografía", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "514521", codigo: "514521", curso: "Innovación e Investigación en Educación", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "520028", codigo: "520028", curso: "Pensamiento Crítico y Ciudadanía", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "511001", codigo: "511001", curso: "Latex", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "50016", codigo: "50016", curso: "Competencias Comunicativas Docentes", creditos: 2, tipo: "Electivo", clasificacion: "DC" },
  { id: "50019", codigo: "50019", curso: "Lectura Crítica", creditos: 2, tipo: "Electivo", clasificacion: "DC" },
  { id: "514519", codigo: "514519", curso: "Lectura y Escritura Académicas", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "517032", codigo: "517032", curso: "Pedagogía Social Solidaria", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  { id: "712003", codigo: "712003", curso: "Resiliencia", creditos: 3, tipo: "Electivo", clasificacion: "DC" },
  
  // DE
  { id: "ELE_B1", codigo: "ELE-B1", curso: "Curso Electivo de Lengua Extranjera B1", creditos: 3, tipo: "Electivo", clasificacion: "DE" },
  { id: "ELE_B1P", codigo: "ELE-B1+", curso: "Curso Electivo de Lengua Extranjera B1+", creditos: 3, tipo: "Electivo", clasificacion: "DE" },
  { id: "551002_E", codigo: "551002", curso: "Lengua Materna II", creditos: 2, tipo: "Electivo", clasificacion: "DE" },
  { id: "551030", codigo: "551030", curso: "Educational Management", creditos: 2, tipo: "Electivo", clasificacion: "DE" },
  { id: "551033", codigo: "551033", curso: "Didactics of Science", creditos: 3, tipo: "Electivo", clasificacion: "DE" },
  { id: "551036", codigo: "551036", curso: "Language and Culture", creditos: 2, tipo: "Electivo", clasificacion: "DE" },
  { id: "450073", codigo: "450073", curso: "English Composition I", creditos: 2, tipo: "Electivo", clasificacion: "DE" },
  { id: "551029", codigo: "551029", curso: "English Literature", creditos: 2, tipo: "Electivo", clasificacion: "DE" },
  { id: "551032", codigo: "551032", curso: "Didactics of Mathematics", creditos: 3, tipo: "Electivo", clasificacion: "DE" },
  { id: "503438696", codigo: "503438696", curso: "Educational Governance in a Global Context", creditos: 3, tipo: "Electivo", clasificacion: "DE" },
  { id: "551038", codigo: "551038", curso: "Teaching English for Specific Purposes", creditos: 3, tipo: "Electivo", clasificacion: "DE" },
  { id: "551031", codigo: "551031", curso: "Qualitative and Quantitative Research", creditos: 2, tipo: "Electivo", clasificacion: "DE" },
  { id: "503438697", codigo: "503438697", curso: "Foundations of Bilingual Education", creditos: 3, tipo: "Electivo", clasificacion: "DE" },
  { id: "551037", codigo: "551037", curso: "Translation Techniques", creditos: 2, tipo: "Electivo", clasificacion: "DE" },
  { id: "450058", codigo: "450058", curso: "English Composition II", creditos: 3, tipo: "Electivo", clasificacion: "DE" },
];

const SEMESTRES: number[] = [1,2,3,4,5,6,7,8,9,10];
const CLASIFICACIONES = ["Todas", ...Array.from(new Set(DATA.map((d) => d.clasificacion)))];
const TIPOS = ["Todos", "Obligatorio", "Electivo"];
const TOTAL_CREDITOS_PLAN = 160;
const TOTAL_OBLIGATORIOS_PLAN = 133;
const TOTAL_ELECTIVOS_PLAN = 27;

const sumCreditos = (items: Curso[]) => items.reduce((acc, c) => acc + (Number(c.creditos) || 0), 0);

export default function CurriculumMap() {
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState<string>("Todos");
  const [clasif, setClasif] = useState<string>("Todas");
  const [selectedId, setSelectedId] = useState<string | null>(DATA.find(x=>x.tipo==="Obligatorio")?.id ?? null);

  const [completed, setCompleted] = useState<Set<string>>(() => {
    try { const raw = localStorage.getItem("lilei_completed_v1"); return new Set(raw ? (JSON.parse(raw) as string[]) : []); } catch { return new Set(); }
  });
  useEffect(() => { try { localStorage.setItem("lilei_completed_v1", JSON.stringify(Array.from(completed))); } catch {} }, [completed]);

  const [asignaciones, setAsignaciones] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem("lilei_electivas_asignadas_v3")||"{}"); } catch { return {}; }
  });
  useEffect(() => { try { localStorage.setItem("lilei_electivas_asignadas_v3", JSON.stringify(asignaciones)); } catch {} }, [asignaciones]);

  // Estados de despliegue
  const [openSemestre, setOpenSemestre] = useState<Record<number, boolean>>(()=> Object.fromEntries(SEMESTRES.map(s=>[s, true])) as Record<number, boolean>);
  const [openPool, setOpenPool] = useState<Record<string, boolean>>(()=> ({ FC: false, IBC: false, DC: false, DE: false }));

  const obligatoriosBase = DATA.filter(c=>c.tipo==="Obligatorio");
  const electivasBase = DATA.filter(c=>c.tipo==="Electivo");

  const searchMatch = (c: Curso) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [c.curso, c.codigo, c.clasificacion].some(v=>String(v).toLowerCase().includes(q));
  };

  // Cursos por semestre = obligatorios fijos + electivas asignadas a ese semestre
  const porSemestre = useMemo(() => {
    const map = new Map<number, Curso[]>(); SEMESTRES.forEach(p=>map.set(p, []));
    obligatoriosBase.filter(searchMatch).forEach(c=>{ (map.get(c.periodo!)!).push(c); });
    electivasBase.filter(searchMatch).forEach(e=>{
      const p = asignaciones[e.id];
      if (p && SEMESTRES.includes(Number(p))) (map.get(Number(p))!).push({ ...e, periodo: Number(p) });
    });
    SEMESTRES.forEach(p => map.set(p, (map.get(p) || []).sort((a,b)=> a.curso.localeCompare(b.curso))));
    return map;
  }, [obligatoriosBase, electivasBase, asignaciones, query]);

  const idsAsignados = new Set(Object.keys(asignaciones).filter(id => asignaciones[id]));
  const electivasDisponibles = electivasBase.filter(e=>!idsAsignados.has(e.id));

  const creditosCompletados = sumCreditos(DATA.filter(c => completed.has(c.id)));
  const progresoPct = Math.min(Math.round((creditosCompletados / TOTAL_CREDITOS_PLAN) * 100), 100);

  const creditosObligatorios = sumCreditos(obligatoriosBase);
  const creditosElectivosAsignados = sumCreditos(electivasBase.filter(e=>asignaciones[e.id]).map(e=>e));
  const electivosRestantes = Math.max(TOTAL_ELECTIVOS_PLAN - creditosElectivosAsignados, 0);

  const selected = selectedId ? DATA.find(c=>c.id===selectedId) ?? null : null;

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({DATA, asignaciones}, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "lilei_malla_config.json"; a.click(); URL.revokeObjectURL(url);
  };
  const importJSON = () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = ".json";
    input.onchange = async ()=>{ const f = input.files?.[0]; if(!f) return; try{ const t = await f.text(); const obj = JSON.parse(t) as { asignaciones?: Record<string,string>}; if(obj.asignaciones){ setAsignaciones(obj.asignaciones); alert("Electivas asignadas importadas."); } else { alert("JSON sin 'asignaciones'."); } }catch(e:any){ alert("Archivo inválido: "+e.message); } };
    input.click();
  };

  // Selector de electivas por semestre con tope de 27 cr
  const SemestreSelectElectiva: React.FC<{ s: number; filtro?: string; label?: string }> = ({ s, filtro, label }) => {
    const opciones = electivasDisponibles
      .filter(e => !filtro || e.clasificacion === filtro)
      .filter(e => (tipo === "Todos" || e.tipo === tipo) && (clasif === "Todas" || e.clasificacion === clasif))
      .filter(e => e.creditos <= electivosRestantes)
      .map(e => ({ id: e.id, label: `${e.curso} — ${e.clasificacion} (${e.creditos} cr)` }));

    const onAdd = (id: string) => {
      if (!id) return;
      const curso = electivasBase.find(x => x.id === id);
      if (!curso) return;
      if (curso.creditos > electivosRestantes) {
        alert(`No puedes superar los ${TOTAL_ELECTIVOS_PLAN} créditos electivos. Te quedan ${electivosRestantes}.`);
        return;
      }
      setAsignaciones(a => ({ ...a, [id]: String(s) }));
    };

    const disabled = electivosRestantes <= 0;

    return (
      <select disabled={disabled} defaultValue="" onChange={(e)=>{ onAdd(e.target.value); e.currentTarget.value = ""; }}
        className={cn("w-full rounded-xl border border-rose-200 bg-white px-2 py-1 text-xs shadow-sm focus:ring-2 focus:ring-rose-300", disabled && "opacity-50 cursor-not-allowed") }>
        <option value="">{disabled ? `Límite de electivos (${TOTAL_ELECTIVOS_PLAN} cr) alcanzado` : (label || "Agregar electiva…")}</option>
        {opciones.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    );
  };

  return (
    <div className="min-h-screen w-full bg-rose-50 text-neutral-900">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-rose-900">Malla Curricular – Licenciatura en Lenguas Extranjeras (Énfasis en Inglés)</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-rose-800/80">
              <Info className="h-4 w-4" /> Malla interactiva (160 créditos). Marca cursadas y agrega electivas por semestre.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={exportJSON} title="Exportar JSON"><Download className="mr-1 h-4 w-4" /> Exportar JSON</Button>
            <Button onClick={importJSON} title="Importar JSON"><Upload className="mr-1 h-4 w-4" /> Importar JSON</Button>
          </div>
        </div>

        {/* STATS + CONTROLS */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card className="col-span-1 border-rose-200 md:col-span-2">
            <CardHeader className="py-3"><CardTitle className="text-sm font-medium">Progreso del plan</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-rose-900">{progresoPct}%</div>
              <div className="mt-2 text-sm text-neutral-700">Créditos cursados: <span className="font-semibold">{creditosCompletados}</span> / {TOTAL_CREDITOS_PLAN}</div>
              <div className="mt-1 text-xs text-neutral-600">Obligatorios: <b>{TOTAL_OBLIGATORIOS_PLAN}</b> &nbsp;|&nbsp; Electivos: <b>{TOTAL_ELECTIVOS_PLAN}</b> &nbsp;|&nbsp; Asignados: <b>{creditosElectivosAsignados}</b></div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded bg-rose-100"><div className="h-2 bg-rose-400" style={{ width: `${progresoPct}%` }} /></div>
              <div className="mt-3 flex gap-2"><Button onClick={() => setCompleted(new Set())}>Reiniciar</Button></div>
            </CardContent>
          </Card>

          <Card className="col-span-1 border-rose-200"><CardHeader className="py-3"><CardTitle className="text-sm font-medium">Obligatorios (catálogo)</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{creditosObligatorios}</CardContent></Card>
          <Card className="col-span-1 border-rose-200"><CardHeader className="py-3"><CardTitle className="text-sm font-medium">Electivos asignados</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{creditosElectivosAsignados} / {TOTAL_ELECTIVOS_PLAN}</CardContent></Card>
          <Card className="col-span-1 border-rose-200"><CardHeader className="py-3"><CardTitle className="text-sm font-medium">Electivos restantes</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{electivosRestantes}</CardContent></Card>

          <Card className="col-span-1 border-rose-200 md:col-span-5">
            <CardHeader className="py-3"><CardTitle className="flex items-center gap-2 text-sm font-medium"><Filter className="h-4 w-4" /> Filtros</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <select value={tipo} onChange={(e)=>setTipo(e.target.value)} className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-rose-300">
                {TIPOS.map(t=> <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={clasif} onChange={(e)=>setClasif(e.target.value)} className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-rose-300">
                {CLASIFICACIONES.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex-1" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-4"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre, código o clasificación…" /></div>

        {/* SEMESTRES 1..10 (primero) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* LEFT: details */}
          <Card className="sticky top-4 h-fit border-rose-200 lg:col-span-1">
            <CardHeader className="pb-2"><CardTitle className="text-base">Información del curso</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {selected ? (
                <>
                  <div className="flex items-start gap-3"><BookOpenText className="h-5 w-5" /><div><div className="font-semibold leading-tight">{selected.curso}</div><div className="text-neutral-600">Código: {selected.codigo}</div></div></div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-rose-100 text-rose-900">{selected.tipo}</Badge>
                    <Badge variant="outline" className="border-rose-300 text-rose-700">{selected.clasificacion}</Badge>
                    <Badge variant="outline" className="border-rose-300 text-rose-700">{selected.creditos} crédito(s)</Badge>
                    {selected.periodo ? <Badge variant="outline" className="border-rose-300 text-rose-700">Semestre {selected.periodo}</Badge> : null}
                  </div>
                  {selected.prereqs?.length ? (
                    <div>
                      <div className="mb-1 text-xs uppercase tracking-wide text-neutral-500">Prerrequisitos</div>
                      <div className="flex flex-col gap-1">
                        {selected.prereqs.map((pid) => {
                          const c = DATA.find((x) => x.id === pid);
                          return (<div key={pid} className="flex items-center gap-2 text-neutral-700">• {c ? `${c.curso} (${c.codigo})` : pid}</div>);
                        })}
                      </div>
                    </div>
                  ) : (<div className="text-neutral-500">Sin prerrequisitos especificados.</div>)}
                  <div className="pt-2 text-xs text-neutral-500">Consejo: marca “Cursada” en la tarjeta de cada curso para que cuente al progreso.</div>
                </>
              ) : (<div className="text-neutral-500">Selecciona un curso para ver los detalles.</div>)}
            </CardContent>
          </Card>

          {/* RIGHT: grilla de semestres */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {SEMESTRES.map((s) => {
                const lista = (porSemestre.get(s)||[]).filter(c => (tipo === "Todos" || c.tipo === tipo) && (clasif === "Todas" || c.clasificacion === clasif));
                return (
                  <Card key={s} className="border-rose-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>Semestre {s}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-normal text-neutral-500">Créditos: {sumCreditos(lista)}</span>
                          <Button className="px-3 py-1 text-xs" onClick={()=> setOpenSemestre(o=>({ ...o, [s]: !o[s] }))}>{openSemestre[s] ? 'Ocultar' : 'Mostrar'}</Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    {openSemestre[s] && (
                      <CardContent>
                        <div className="mb-3">
                          <SemestreSelectElectiva s={s} label="Agregar electiva…" />
                        </div>
                        <div className="flex flex-col gap-2">
                          {lista.map((c) => {
                            const isDone = completed.has(c.id);
                            const esElectiva = c.tipo === "Electivo";
                            return (
                              <div key={c.id} className={cn("relative w-full rounded-2xl border p-3 pr-24 text-left transition overflow-hidden", isDone && "bg-rose-50 border-rose-300")} title={`Código ${c.codigo} · ${c.creditos} crédito(s)`}>
                                <Badge variant={c.tipo === "Obligatorio" ? 'secondary' : 'outline'} className={cn("absolute right-2 top-2 z-10", c.tipo === "Obligatorio" ? "bg-rose-100 text-rose-900" : "border-rose-300 text-rose-700")}>{c.tipo}</Badge>

                                <div className="flex items-start justify-between gap-3">
                                  <div onClick={()=>setSelectedId(c.id)} className="cursor-pointer">
                                    <div className={cn("font-medium leading-tight", isDone && "line-through text-neutral-600")}>{c.curso}</div>
                                    <div className="mt-1 text-xs text-neutral-500">{c.codigo} • {c.clasificacion} • {c.creditos} cr</div>
                                    {c.prereqs?.length ? (
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {c.prereqs.map((pid) => {
                                          const p = DATA.find((x) => x.id === pid);
                                          return (<Badge key={pid} variant="outline" className="text-[10px]">↳ {p ? p.codigo : pid}</Badge>);
                                        })}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="absolute bottom-2 right-2 flex items-center gap-3">{esElectiva && (<button className="text-xs text-rose-700 underline" onClick={()=> setAsignaciones(a=>{ const copy={...a}; delete copy[c.id]; return copy; })} title="Quitar electiva de este semestre">Quitar</button>)}<label className="flex items-center gap-2 text-xs text-neutral-700"><input type="checkbox" checked={isDone} onChange={()=>{ setCompleted(prev=>{ const next = new Set(prev); if(next.has(c.id)) next.delete(c.id); else next.add(c.id); return next; }); }} /> Cursada</label></div>
                              </div>
                            );
                          })}
                          {!lista.length && <div className="text-sm text-neutral-400">(Sin cursos en este semestre con los filtros actuales)</div>}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* POOLS de electivas (plegables) */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(["FC","IBC","DC","DE"] as const).map((tipoPool)=> (
            <Card key={tipoPool} className="border-rose-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Listado de electivas {tipoPool}</CardTitle>
                  <Button className="px-3 py-1 text-xs" onClick={()=> setOpenPool(p=> ({...p, [tipoPool]: !p[tipoPool]}))}>{openPool[tipoPool] ? 'Ocultar' : 'Mostrar'}</Button>
                </div>
              </CardHeader>
              {openPool[tipoPool] && (
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {DATA.filter(e=>e.tipo==="Electivo" && e.clasificacion===tipoPool)
                      .filter(searchMatch)
                      .map(e => (
                        <div key={e.id} className="rounded-2xl border border-rose-200 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium leading-tight">{e.curso}</div>
                              <div className="mt-1 text-xs text-neutral-500">{e.codigo} • {e.clasificacion} • {e.creditos} cr</div>
                            </div>
                            <Badge variant="outline">{asignaciones[e.id] ? `S${asignaciones[e.id]}` : "Sin asignar"}</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <footer className="mt-10 text-xs text-neutral-500"><p>Este visor es un prototipo no oficial para uso académico. Verifica la malla vigente y equivalencias con la UNAD.</p></footer>
      </div>
    </div>
  );
}
