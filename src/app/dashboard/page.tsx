"use client";
import { useMemo, useState } from "react";
import styles from "./TangerineV2.module.css";
import { AlertCircle, CalendarDays, CheckCircle2, FolderKanban, ListTodo, Plus, Settings2, Trash2, Users, Eye, Pencil, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    memberIds: string[];
}
interface Member {
    userId: string;
    role: string;
    name: string;
    email: string;
    position: string;
    birthdate: string;
    phone: string;
    projectId: string;
    isActive: boolean;
}
interface Task {
    id: string;
    description: string;
    projectId: string;
    status: string;
    priority: string;
    userId: string;
    dateline: string;
}
type Kind = "project" | "member" | "task";
type FormState = Record<string, string>;
const initialProjects: Project[] = [
    { id: "p1", name: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", status: "En progreso", progress: 65, memberIds: ["u1", "u2"] },
    { id: "p2", name: "Mobile App", description: "Aplicación móvil con React Native", status: "En revisión", progress: 90, memberIds: ["u3"] },
    { id: "p3", name: "API Gateway", description: "Servicios y despliegue de API", status: "Planificado", progress: 20, memberIds: ["u4"] },
];
const initialMembers: Member[] = [
    { userId: "u1", role: "Desarrollador", name: "María García", email: "maria@example.com", position: "Frontend", birthdate: "1998-07-18", phone: "987654321", projectId: "p1", isActive: true },
    { userId: "u2", role: "Desarrollador", name: "Juan Pérez", email: "juan@example.com", position: "Backend", birthdate: "1997-03-14", phone: "987654322", projectId: "p1", isActive: true },
    { userId: "u3", role: "Diseñador", name: "Ana López", email: "ana@example.com", position: "UI/UX", birthdate: "1999-11-06", phone: "987654323", projectId: "p2", isActive: true },
    { userId: "u4", role: "DevOps", name: "Carlos Ruiz", email: "carlos@example.com", position: "Infraestructura", birthdate: "1996-02-11", phone: "987654324", projectId: "p3", isActive: false },
];
const initialTasks: Task[] = [
    { id: "t1", description: "Implementar autenticación", projectId: "p1", status: "En progreso", priority: "Alta", userId: "u1", dateline: "2026-11-15" },
    { id: "t2", description: "Optimizar consultas", projectId: "p1", status: "Pendiente", priority: "Media", userId: "u2", dateline: "2026-11-20" },
    { id: "t3", description: "Diseñar pantalla principal", projectId: "p2", status: "Completado", priority: "Alta", userId: "u3", dateline: "2026-11-10" },
    { id: "t4", description: "Configurar CI/CD", projectId: "p3", status: "Pendiente", priority: "Urgente", userId: "u4", dateline: "2026-11-21" },
    { id: "t5", description: "Revisar despliegue", projectId: "p3", status: "En progreso", priority: "Media", userId: "u4", dateline: "2026-11-24" },
    { id: "t6", description: "Documentar los endpoints", projectId: "p3", status: "Pendiente", priority: "Baja", userId: "u2", dateline: "2026-11-27" },
];
const empty: Record<Kind, FormState> = {
    project: { name: "", description: "", status: "Planificado", progress: "0", memberIds: "" },
    member: { role: "Desarrollador", name: "", email: "", position: "", birthdate: "", phone: "", projectId: "none", isActive: "true" },
    task: { description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" },
};
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dateFrom = (s: string) => s ? new Date(`${s}T12:00:00`) : undefined;
export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTab, setActiveTab] = useState("overview");
    const [modal, setModal] = useState<{
        kind: Kind;
        id?: string;
        view?: boolean;
    } | null>(null);
    const [form, setForm] = useState<FormState>({});
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [settings, setSettings] = useState({ displayName: "Administrador", email: "admin@example.com", notifications: true, compact: false });
    const [dateOpen, setDateOpen] = useState(false);
    const perPage = 4;
    const maxPage = Math.max(1, Math.ceil(tasks.length / perPage));
    const visibleTasks = useMemo(() => tasks.slice((Math.min(page, maxPage) - 1) * perPage, Math.min(page, maxPage) * perPage), [tasks, page, maxPage]);
    const projectName = (id: string) => projects.find(p => p.id === id)?.name || "Sin proyecto";
    const memberName = (id: string) => members.find(m => m.userId === id)?.name || "Sin asignar";
    const field = (name: string, value: string) => setForm(current => ({ ...current, [name]: value }));
    const show = (kind: Kind, record?: Project | Member | Task, view = false) => {
        let values = { ...empty[kind] };
        if (record) {
            values = Object.fromEntries(Object.entries(record).filter(([k]) => !["id", "userId"].includes(k)).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)]));
            if (kind === "member")
                values.userId = (record as Member).userId;
            if (kind === "task")
                values.userId = (record as Task).userId;
        }
        setForm(values);
        setError("");
        setNotice("");
        setDateOpen(false);
        setModal({ kind, id: record ? ("id" in record ? record.id : record.userId) : undefined, view });
    };
    const close = () => { setModal(null); setError(""); setDateOpen(false); };
    const save = () => {
        if (!modal)
            return;
        const { kind, id } = modal;
        if (kind === "project") {
            if (!form.name?.trim() || !form.description?.trim())
                return setError("Completa el nombre y la descripción del proyecto.");
            const memberIds = (form.memberIds || "").split(",").filter(Boolean);
            const item: Project = { id: id || crypto.randomUUID(), name: form.name.trim(), description: form.description.trim(), status: form.status || "Planificado", progress: Math.min(100, Math.max(0, Number(form.progress) || 0)), memberIds };
            setProjects(old => id ? old.map(p => p.id === id ? item : p) : [...old, item]);
            setMembers(old => old.map(m => ({ ...m, projectId: memberIds.includes(m.userId) ? item.id : m.projectId === item.id ? "none" : m.projectId })));
        }
        if (kind === "member") {
            if (!form.name?.trim() || !/^\S+@\S+\.\S+$/.test(form.email || "") || !form.role?.trim() || !form.position?.trim() || !form.birthdate || !form.phone?.trim())
                return setError("Completa los campos y escribe un email válido.");
            const userId = id || crypto.randomUUID();
            const item: Member = { userId, name: form.name.trim(), email: form.email.trim(), role: form.role.trim(), position: form.position.trim(), phone: form.phone.trim(), birthdate: form.birthdate, projectId: form.projectId || "none", isActive: form.isActive === "true" };
            setMembers(old => id ? old.map(m => m.userId === id ? item : m) : [...old, item]);
            setProjects(old => old.map(p => ({ ...p, memberIds: p.id === item.projectId ? [...new Set([...p.memberIds, userId])] : p.memberIds.filter(mid => mid !== userId) })));
        }
        if (kind === "task") {
            if (!form.description?.trim() || !form.projectId || !form.userId || !form.dateline)
                return setError("Completa la descripción, proyecto, responsable y fecha límite.");
            if (!projects.some(p => p.id === form.projectId) || !members.some(m => m.userId === form.userId))
                return setError("Selecciona un proyecto y miembro válidos.");
            const item: Task = { id: id || crypto.randomUUID(), description: form.description.trim(), projectId: form.projectId, status: form.status, priority: form.priority, userId: form.userId, dateline: form.dateline };
            setTasks(old => id ? old.map(t => t.id === id ? item : t) : [...old, item]);
        }
        close();
        setNotice(`${kind === "project" ? "Proyecto" : kind === "member" ? "Miembro" : "Tarea"} ${id ? "actualizado" : "creado"} correctamente.`);
        if (kind === "task")
            setPage(1);
    };
    const remove = (kind: Kind, id: string) => {
        if (!window.confirm("¿Eliminar este registro? Esta acción no se puede deshacer."))
            return;
        if (kind === "project") {
            setProjects(old => old.filter(p => p.id !== id));
            setTasks(old => old.filter(t => t.projectId !== id));
            setMembers(old => old.map(m => m.projectId === id ? { ...m, projectId: "none" } : m));
        }
        if (kind === "member") {
            setMembers(old => old.filter(m => m.userId !== id));
            setProjects(old => old.map(p => ({ ...p, memberIds: p.memberIds.filter(mid => mid !== id) })));
            setTasks(old => old.map(t => t.userId === id ? { ...t, userId: "" } : t));
        }
        if (kind === "task")
            setTasks(old => old.filter(t => t.id !== id));
        setNotice("Registro eliminado correctamente.");
    };
    const simulate = () => { setLoading(true); setNotice(""); window.setTimeout(() => { setLoading(false); setNotice("Petición simulada completada. Datos cargados desde la memoria."); }, 900); };
    const stats = [
        { title: "Proyectos", value: projects.length, icon: FolderKanban, detail: `${projects.filter(p => p.status === "Completado").length} completados` },
        { title: "Tareas totales", value: tasks.length, icon: ListTodo, detail: `${tasks.filter(t => t.status === "Completado").length} completadas` },
        { title: "Miembros activos", value: members.filter(m => m.isActive).length, icon: Users, detail: `De ${members.length} registrados` },
        { title: "Progreso promedio", value: `${projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0}%`, icon: CheckCircle2, detail: "De todos los proyectos" },
    ];
    const actions = (kind: Kind, item: Project | Member | Task) => {
        const id = kind === "member" ? (item as Member).userId : (item as Project | Task).id;
        return <div className="flex flex-wrap gap-1">
      {kind === "project" && <Button size="sm" variant="outline" onClick={() => show(kind, item, true)}><Eye className="mr-1 size-4"/>Detalles</Button>}
      <Button size="sm" variant="outline" onClick={() => show(kind, item)}><Pencil className="mr-1 size-4"/>Editar</Button>
      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => remove(kind, id)}><Trash2 className="mr-1 size-4"/>Eliminar</Button>
    </div>;
    };
    const actionButton = (kind: Kind) => <Button onClick={() => show(kind)}><Plus className="mr-2 size-4"/>{kind === "project" ? "Nuevo proyecto" : kind === "member" ? "Nuevo miembro" : "Nueva tarea"}</Button>;
    const selector = (name: string, options: {
        value: string;
        label: string;
    }[], placeholder = "Seleccionar") => (<Select value={form[name] ?? ""} onValueChange={(value) => field(name, value ?? "")}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}/>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (<SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>))}
      </SelectContent>
    </Select>);
    const textField = (name: string, label: string, type = "text") => <div className="space-y-2"><Label htmlFor={`f-${name}`}>{label}</Label><Input id={`f-${name}`} type={type} value={form[name] || ""} onChange={e => field(name, e.target.value)}/></div>;
    return <main className={styles.dashboard}>
    <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}><FolderKanban size={24}/></div>
          <div><strong>WORKSPACE<span>.</span></strong><small>Project management</small></div>
        </div>
        <p className={styles.navigationLabel}>ESPACIO DE TRABAJO</p>
        <TabsList className={styles.sideNav}>
          <TabsTrigger value="overview"><FolderKanban size={18}/> Resumen</TabsTrigger>
          <TabsTrigger value="projects"><FolderKanban size={18}/> Proyectos</TabsTrigger>
          <TabsTrigger value="team"><Users size={18}/> Equipo</TabsTrigger>
          <TabsTrigger value="tasks"><ListTodo size={18}/> Tareas</TabsTrigger>
          <TabsTrigger value="settings"><Settings2 size={18}/> Configuración</TabsTrigger>
        </TabsList>
        <div className={styles.sidebarBottom}>
          <span className={styles.statusDot}/> LABORATORIO 11
          <p>Panel administrativo · React + shadcn/ui</p>
        </div>
      </aside>
      <section className={styles.content}>
        <header className={styles.topBar}>
          <div><span className={styles.eyebrow}>MI ESPACIO / DASHBOARD</span><h1>Gestión de proyectos</h1></div>
          <div className={styles.profile}><span className={styles.profileAvatar}>AD</span><span><strong>{settings.displayName}</strong><small>Administrador</small></span></div>
        </header>
        <div className={styles.contentInner}>
          <div className={styles.welcome}>
            <div className={styles.welcomeText}>
              <span>GESTIÓN INTELIGENTE DE EQUIPOS</span>
              <h2>Haz que las ideas<br />se conviertan en <em>resultados.</em></h2>
              <p>Organiza tus proyectos, miembros y tareas desde un mismo lugar.</p>
              <Button variant="secondary" onClick={simulate} disabled={loading}>{loading ? <Spinner className="mr-2"/> : <RotateCcw className="mr-2 size-4"/>}{loading ? "Cargando..." : "Simular backend"}</Button>
            </div>
            <div className={styles.welcomeArt} aria-hidden="true"><span /><span /><span /><b>↗</b></div>
          </div>
          {notice && <Alert className={styles.notice}><CheckCircle2 className="size-4"/><AlertTitle>Operación completada</AlertTitle><AlertDescription>{notice}</AlertDescription></Alert>}
        <TabsContent value="overview" className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(s => <Card key={s.title} className="border-slate-200"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-slate-600">{s.title}</CardTitle><s.icon className="size-5 text-blue-600"/></CardHeader><CardContent><p className="text-3xl font-bold">{s.value}</p><p className="mt-2 text-xs text-slate-500">{s.detail}</p></CardContent></Card>)}</div>
          <Card><CardHeader><CardTitle>Estado de los proyectos</CardTitle><CardDescription>Se actualiza cuando creas, editas o eliminas registros</CardDescription></CardHeader><CardContent className="space-y-5">{projects.length === 0 ? <p className="text-slate-500">No hay proyectos todavía.</p> : projects.map(p => <div key={p.id}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-medium">{p.name}</span><span>{p.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${p.progress}%` }}/></div></div>)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4"><div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-bold">Proyectos</h2>{actionButton("project")}</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map(p => <Card key={p.id}><CardHeader><div className="flex flex-wrap items-center justify-between gap-2"><CardTitle className="text-lg">{p.name}</CardTitle><Badge variant={p.status === "Completado" ? "default" : "secondary"}>{p.status}</Badge></div><CardDescription>{p.description}</CardDescription></CardHeader><CardContent className="space-y-4"><p className="text-sm text-slate-500">{p.memberIds.length} miembros · {tasks.filter(t => t.projectId === p.id).length} tareas</p><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-blue-600" style={{ width: `${p.progress}%` }}/></div><p className="text-sm font-medium">Progreso: {p.progress}%</p>{actions("project", p)}</CardContent></Card>)}</div>{projects.length === 0 && <p className="text-slate-500">Agrega tu primer proyecto.</p>}</TabsContent>
        <TabsContent value="team" className="space-y-4"><div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-bold">Equipo</h2>{actionButton("member")}</div><div className="grid gap-4 md:grid-cols-2">{members.map(m => <Card key={m.userId}><CardHeader><div className="flex flex-wrap justify-between gap-2"><CardTitle>{m.name}</CardTitle><Badge variant={m.isActive ? "default" : "secondary"}>{m.isActive ? "Activo" : "Inactivo"}</Badge></div><CardDescription>{m.position} · {m.role}</CardDescription></CardHeader><CardContent className="space-y-2 text-sm"><p>{m.email} · {m.phone}</p><p className="text-slate-500">Proyecto: {projectName(m.projectId)}</p><p className="text-slate-500">Nacimiento: {m.birthdate}</p>{actions("member", m)}</CardContent></Card>)}</div></TabsContent>
        <TabsContent value="tasks" className="space-y-4"><div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-bold">Tareas</h2>{actionButton("task")}</div><Card><CardContent className="overflow-x-auto pt-6"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b text-slate-500"><tr>{["Descripción", "Proyecto", "Estado", "Prioridad", "Responsable", "Fecha límite", "Acciones"].map(h => <th className="px-3 py-3 font-semibold" key={h}>{h}</th>)}</tr></thead><tbody>{visibleTasks.map(t => <tr key={t.id} className="border-b last:border-0"><td className="px-3 py-4 font-medium">{t.description}</td><td className="px-3 py-4">{projectName(t.projectId)}</td><td className="px-3 py-4"><Badge variant={t.status === "Completado" ? "default" : "secondary"}>{t.status}</Badge></td><td className="px-3 py-4">{t.priority}</td><td className="px-3 py-4">{memberName(t.userId)}</td><td className="px-3 py-4">{t.dateline}</td><td className="px-3 py-4">{actions("task", t)}</td></tr>)}</tbody></table>{tasks.length === 0 && <p className="py-7 text-center text-slate-500">No hay tareas.</p>}</CardContent></Card><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">Página {Math.min(page, maxPage)} de {maxPage} · {tasks.length} tareas</p><Pagination className="mx-0 w-auto"><PaginationContent><PaginationItem><PaginationPrevious href="#" onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}/></PaginationItem>{Array.from({ length: maxPage }, (_, i) => <PaginationItem key={i}><PaginationLink href="#" isActive={Math.min(page, maxPage) === i + 1} onClick={e => { e.preventDefault(); setPage(i + 1); }}>{i + 1}</PaginationLink></PaginationItem>)}<PaginationItem><PaginationNext href="#" onClick={e => { e.preventDefault(); setPage(p => Math.min(maxPage, p + 1)); }}/></PaginationItem></PaginationContent></Pagination></div></TabsContent>
        <TabsContent value="settings"><Card className="max-w-2xl"><CardHeader><CardTitle className="flex items-center gap-2"><Settings2 className="size-5 text-blue-600"/>Configuración</CardTitle><CardDescription>Preferencias simuladas en memoria (no se envían a un servidor)</CardDescription></CardHeader><CardContent><form onSubmit={e => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(settings.email) || !settings.displayName.trim())
        return setNotice("Verifica el nombre y correo de configuración."); simulate(); }} className="space-y-5"><div className="space-y-2"><Label>Nombre visible</Label><Input value={settings.displayName} onChange={e => setSettings(s => ({ ...s, displayName: e.target.value }))}/></div><div className="space-y-2"><Label>Correo de notificaciones</Label><Input type="email" value={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))}/></div><div className="flex items-center justify-between gap-4"><div><Label>Notificaciones</Label><p className="text-sm text-slate-500">Recibir novedades del Dashboard</p></div><Switch checked={settings.notifications} onCheckedChange={v => setSettings(s => ({ ...s, notifications: v }))}/></div><div className="flex items-center justify-between gap-4"><div><Label>Vista compacta</Label><p className="text-sm text-slate-500">Preferencia de visualización de ejemplo</p></div><Switch checked={settings.compact} onCheckedChange={v => setSettings(s => ({ ...s, compact: v }))}/></div><Button type="submit" disabled={loading}>{loading && <Spinner className="mr-2"/>}Guardar configuración</Button></form></CardContent></Card></TabsContent>
        </div>
      </section>
    </Tabs>
    <Dialog open={Boolean(modal)} onOpenChange={open => { if (!open)
        close(); }}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>{modal?.view ? "Detalle de proyecto" : `${modal?.id ? "Editar" : "Crear"} ${modal?.kind === "project" ? "proyecto" : modal?.kind === "member" ? "miembro" : "tarea"}`}</DialogTitle><DialogDescription>{modal?.view ? "Información y miembros asignados al proyecto" : "Completa los datos y guarda los cambios."}</DialogDescription></DialogHeader>
      {modal?.view ? <div className="space-y-4"><p className="text-lg font-semibold">{form.name}</p><p>{form.description}</p><p>Estado: {form.status} · Progreso: {form.progress}%</p><h3 className="font-semibold">Equipo asignado</h3><div className="flex flex-wrap gap-2">{(form.memberIds || "").split(",").filter(Boolean).map(mid => <Badge key={mid} variant="outline">{memberName(mid)}</Badge>)}{!form.memberIds && <p className="text-slate-500">Sin miembros asignados.</p>}</div><p className="text-sm text-slate-500">Tareas del proyecto: {tasks.filter(t => t.projectId === modal.id).length}</p></div> : modal && <div className="space-y-4">
        {modal.kind === "project" && <>{textField("name", "Nombre del proyecto")}{textField("description", "Descripción")}<div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Estado</Label>{selector("status", ["Planificado", "En progreso", "En revisión", "Completado"].map(v => ({ value: v, label: v })))}</div>{textField("progress", "Progreso (0–100)", "number")}</div><div className="space-y-2"><Label>Miembros del equipo</Label><div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border p-3">{members.map(m => <label key={m.userId} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-blue-600" checked={(form.memberIds || "").split(",").includes(m.userId)} onChange={e => { const ids = new Set((form.memberIds || "").split(",").filter(Boolean)); if (e.target.checked)
            ids.add(m.userId);
        else
            ids.delete(m.userId); field("memberIds", [...ids].join(",")); }}/>{m.name}</label>)}</div></div></>}
        {modal.kind === "member" && <>{textField("name", "Nombre")}{textField("email", "Correo electrónico", "email")}<div className="grid gap-4 sm:grid-cols-2">{textField("role", "Rol")}{textField("position", "Cargo / posición")}</div><div className="grid gap-4 sm:grid-cols-2">{textField("phone", "Teléfono", "tel")}<div className="space-y-2"><Label>Proyecto</Label>{selector("projectId", [{ value: "none", label: "Sin proyecto" }, ...projects.map(p => ({ value: p.id, label: p.name }))])}</div></div><div className="space-y-2"><Label>Fecha de nacimiento</Label><div className="flex items-center gap-2"><Input type="date" value={form.birthdate || ""} onChange={e => field("birthdate", e.target.value)}/><Button type="button" size="icon" variant="outline" onClick={() => setDateOpen(v => !v)}><CalendarDays className="size-4"/></Button></div>{dateOpen && <div className="w-fit rounded-xl border bg-white p-2 shadow-sm"><Calendar mode="single" selected={dateFrom(form.birthdate || "")} onSelect={date => { if (date) {
            field("birthdate", iso(date));
            setDateOpen(false);
        } }} captionLayout="dropdown"/></div>}</div><div className="space-y-2"><Label>Estado</Label>{selector("isActive", [{ value: "true", label: "Activo" }, { value: "false", label: "Inactivo" }])}</div></>}
        {modal.kind === "task" && <>{textField("description", "Descripción de la tarea")}<div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Proyecto</Label>{selector("projectId", projects.map(p => ({ value: p.id, label: p.name })))}</div><div className="space-y-2"><Label>Responsable</Label>{selector("userId", members.map(m => ({ value: m.userId, label: m.name })))}</div><div className="space-y-2"><Label>Estado</Label>{selector("status", ["Pendiente", "En progreso", "Completado"].map(v => ({ value: v, label: v })))}</div><div className="space-y-2"><Label>Prioridad</Label>{selector("priority", ["Baja", "Media", "Alta", "Urgente"].map(v => ({ value: v, label: v })))}</div></div><div className="space-y-2"><Label>Fecha límite (Calendar)</Label><Button type="button" variant="outline" className="w-full justify-start" onClick={() => setDateOpen(v => !v)}><CalendarDays className="mr-2 size-4"/>{form.dateline || "Seleccionar fecha"}</Button>{dateOpen && <div className="w-fit rounded-xl border bg-white p-2 shadow-sm"><Calendar mode="single" selected={dateFrom(form.dateline || "")} onSelect={date => { if (date) {
            field("dateline", iso(date));
            setDateOpen(false);
        } }}/></div>}</div></>}
        {error && <Alert variant="destructive"><AlertCircle className="size-4"/><AlertTitle>Revisa el formulario</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      </div>}
      <DialogFooter>{!modal?.view && <Button onClick={save}>Guardar cambios</Button>}<Button type="button" variant="outline" onClick={close}>Cerrar</Button></DialogFooter>
    </DialogContent></Dialog>
  </main>;
}
