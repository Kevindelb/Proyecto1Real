import * as React from "react";
import { cn } from "./utils";

// contenedor principal de la tarjeta
function Card({ className, ...props }) {
    return (<div data-slot="card" className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border", className)} {...props}/>);
}

// cabecera de la tarjeta para titulos y acciones
function CardHeader({ className, ...props }) {
    return (<div data-slot="card-header" className={cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)} {...props}/>);
}

// titulo de la tarjeta
function CardTitle({ className, ...props }) {
    return (<h4 data-slot="card-title" className={cn("leading-none", className)} {...props}/>);
}

// descripcion corta de la tarjeta
function CardDescription({ className, ...props }) {
    return (<p data-slot="card-description" className={cn("text-muted-foreground", className)} {...props}/>);
}

// boton o accion extra en la esquina superior
function CardAction({ className, ...props }) {
    return (<div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props}/>);
}

// cuerpo principal de la tarjeta
function CardContent({ className, ...props }) {
    return (<div data-slot="card-content" className={cn("px-6 [&:last-child]:pb-6", className)} {...props}/>);
}

// pie de la tarjeta para botones o enlaces
function CardFooter({ className, ...props }) {
    return (<div data-slot="card-footer" className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)} {...props}/>);
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, };

