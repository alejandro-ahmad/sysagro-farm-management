import { Link } from '@tanstack/react-router';
import { Menu, Sprout, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Brand({ compact=false }: { compact?: boolean }) { return <Link to="/" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm"><Sprout size={20}/></span>{!compact && <span className="font-display text-xl font-bold text-foreground">Sysagro</span>}</Link> }
export function SiteHeader() {
 const [open,setOpen]=useState(false);
 const links=[['Inicio','/'],['Demo del sistema','/demo'],['Contacto','/contacto']] as const;
 return <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8"><Brand/><nav className="hidden items-center gap-1 md:flex">{links.map(([label,to])=><Link key={to} to={to} activeProps={{className:'nav-active'}} className="nav-link">{label}</Link>)}<Button asChild className="ml-3"><Link to="/demo">Acceder al sistema</Link></Button></nav><Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button></div>{open&&<nav className="border-t bg-background p-4 md:hidden">{links.map(([label,to])=><Link key={to} to={to} onClick={()=>setOpen(false)} className="block rounded-md px-4 py-3 font-medium hover:bg-muted">{label}</Link>)}</nav>}</header>
}
