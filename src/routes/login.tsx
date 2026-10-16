import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { DEMO_USERS, login } from '@/lib/sysagro-data';

export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Iniciar sesión — Sysagro' }, { name: 'description', content: 'Ingresá a tu cuenta de Sysagro para gestionar tu campo.' }, { property: 'og:title', content: 'Iniciar sesión — Sysagro' }, { property: 'og:description', content: 'Acceso al sistema de gestión agropecuaria Sysagro.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || pass.length < 6) { setErr('Ingresá un email válido y una contraseña de al menos 6 caracteres.'); return; }
    const s = login(email, pass);
    if (!s) { setErr('Email o contraseña incorrectos.'); return; }
    toast.success(`Bienvenido, ${s.nombre}`);
    nav({ to: '/demo' });
  };
  return <div className="min-h-screen bg-muted/55"><SiteHeader /><main className="mx-auto grid max-w-md px-5 py-16"><div className="panel p-7"><h1 className="font-display text-2xl font-bold">Iniciar sesión</h1><p className="mt-1 text-sm text-muted-foreground">Accedé al sistema de gestión de tu establecimiento.</p><form onSubmit={submit} className="mt-6 grid gap-4"><label className="text-sm font-semibold">Email<div className="relative mt-2"><Mail size={16} className="absolute left-3 top-3 text-muted-foreground" /><input value={email} onChange={e => setEmail(e.target.value)} type="email" className="h-10 w-full rounded-md border bg-background pl-9 pr-3 font-normal outline-none focus:ring-2 focus:ring-ring" /></div></label><label className="text-sm font-semibold">Contraseña<div className="relative mt-2"><Lock size={16} className="absolute left-3 top-3 text-muted-foreground" /><input value={pass} onChange={e => setPass(e.target.value)} type="password" className="h-10 w-full rounded-md border bg-background pl-9 pr-3 font-normal outline-none focus:ring-2 focus:ring-ring" /></div></label>{err && <p className="text-sm font-semibold text-destructive">{err}</p>}<Button type="submit" size="lg">Ingresar</Button></form><div className="mt-6 rounded-md bg-secondary p-4 text-xs"><p className="font-bold">Cuentas de prueba (contraseña: sysagro123)</p>{DEMO_USERS.map(u => <button key={u.email} type="button" onClick={() => { setEmail(u.email); setPass(u.password); }} className="mt-2 block text-left text-primary underline">{u.email} — Plan {u.plan === 'premium' ? 'Premium (con IA)' : 'Básico (sin IA)'}</button>)}</div></div></main></div>;
}
