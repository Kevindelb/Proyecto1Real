import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// combina clases de tailwind de forma segura evitando duplicados
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

