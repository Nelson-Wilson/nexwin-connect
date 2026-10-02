import { Construction } from 'lucide-react';

export default function ComingSoonPage({ title, sprint }: { title: string; sprint: number }) {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
      <div className="ui-card rounded-xl p-10 mt-6 text-center">
        <Construction className="mx-auto text-blue-600 mb-4" size={32} />
        <p className="text-slate-900 font-semibold mb-1">Este módulo chega no Sprint {sprint}</p>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          A navegação, o contexto de negócio e os serviços já estão prontos — falta só a interface.
        </p>
      </div>
    </div>
  );
}
