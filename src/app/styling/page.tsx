"use client";
import { useState } from "react";
import Button from "@/components/styling/Button";
import Card from "@/components/cards/Card";
import Badge from "@/components/styling/Badge";
import Input from "@/components/styling/Input";
export default function LabPage() {
    const [buttonLoading, setButtonLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [notice, setNotice] = useState("");
    const handleButtonClick = () => {
        setButtonLoading(true);
        setTimeout(() => {
            setButtonLoading(false);
            setNotice("¡Acción completada!");
        }, 2000);
    };
    const validateEmail = (value: string) => {
        setEmail(value);
        setEmailError(value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? "Email inválido"
            : "");
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailError && name.trim() && email) {
            setNotice(`Formulario enviado: ${name} (${email})`);
        }
    };
    return (<main className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <p className="text-purple-600 font-semibold tracking-widest text-sm mb-3">
            LABORATORIO 11 · EJERCICIO 1
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Componentes Reutilizables
          </h1>
          <p className="text-xl text-gray-600">CSS Modules + Tailwind CSS</p>
        </header>
        {notice && (<div role="status" className="mb-6 rounded-lg border border-green-200 bg-green-50 text-green-800 p-4 flex justify-between gap-3">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Cerrar aviso">
              ✕
            </button>
          </div>)}
        <Card title="1. Botones con CSS Modules" subtitle="Efectos complejos usando CSS Modules para animaciones personalizadas" className="mb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">
                Small Primary
              </Button>
              <Button variant="secondary" size="md">
                Medium Secondary
              </Button>
              <Button variant="outline" size="lg">
                Large Outline
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading={buttonLoading} onClick={handleButtonClick}>
                Click para cargar
              </Button>
              <Button variant="secondary" disabled>
                Disabled Button
              </Button>
              <div className="w-full">
                <Button variant="primary" fullWidth>
                  Full Width Button
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
              <strong>CSS Modules usado para:</strong> efecto de onda al hacer
              clic, animación de carga, gradientes y transiciones hover.
            </div>
          </div>
        </Card>
        <Card title="2. Badges con Tailwind" subtitle="Componentes simples usando solo clases utilitarias de Tailwind" className="mb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success" size="sm" rounded>
                Small
              </Badge>
              <Badge variant="error" size="md" rounded>
                Medium
              </Badge>
              <Badge variant="warning" size="lg" rounded>
                Large
              </Badge>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-green-800 text-sm">
              <strong>Tailwind usado para:</strong> colores, tamaños, bordes y
              espaciado.
            </div>
          </div>
        </Card>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card title="Card Simple" subtitle="Solo con Tailwind">
            <p>
              Este card usa únicamente Tailwind CSS para todos sus estilos.
              Perfecto para componentes estándar.
            </p>
          </Card>
          <Card title="Card con Imagen" image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900" footer={<div className="flex justify-between items-center">
                <Badge variant="info" size="sm">
                  Desarrollo
                </Badge>
                <span className="text-sm text-gray-500">Hace 2 horas</span>
              </div>}>
            <p>Imagen con efecto hover y footer personalizado.</p>
          </Card>
          <Card title="Card Interactivo" subtitle="Con acciones" footer={<Button variant="primary" size="sm" fullWidth onClick={() => setNotice("¡Card interactivo seleccionado!")}>
                Ver más
              </Button>}>
            <p className="mb-3">Card con botón de acción en el footer.</p>
            <div className="flex gap-2">
              <Badge variant="success" size="sm">
                React
              </Badge>
              <Badge variant="info" size="sm">
                Next.js
              </Badge>
            </div>
          </Card>
        </div>
        <Card title="3. Formulario con Inputs (Combinación)" subtitle="CSS Modules para animaciones + Tailwind para estructura" className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nombre completo" value={name} onChange={setName} required helperText="Ingresa tu nombre y apellido" icon={<span>♙</span>}/>
            <Input label="Email" type="email" value={email} onChange={validateEmail} error={emailError} required icon={<span>✉</span>}/>
            <Button type="submit" fullWidth>
              Enviar Formulario
            </Button>
            <div className="bg-purple-50 p-4 rounded-lg text-sm text-purple-800">
              <strong>Combinación efectiva:</strong> CSS Modules para label
              flotante, animación de error y focus. Tailwind para layout,
              colores y responsive.
            </div>
          </form>
        </Card>
        <Card title="Resumen de Técnicas Usadas">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg text-purple-600 mb-3">
                CSS Modules
              </h4>
              <ul className="space-y-2 text-sm">
                {[
            "Animaciones complejas: onda, shake y spin",
            "Pseudo-elementos ::before y ::after",
            "Gradientes y sombras",
            "Keyframes personalizados",
            "Labels flotantes",
        ].map((x) => (<li key={x}>✓ {x}</li>))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg text-blue-600 mb-3">
                Tailwind CSS
              </h4>
              <ul className="space-y-2 text-sm">
                {[
            "Layout y grid",
            "Colores y fondos",
            "Espaciado",
            "Responsive design",
            "Hover y estados simples",
        ].map((x) => (<li key={x}>✓ {x}</li>))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </main>);
}
