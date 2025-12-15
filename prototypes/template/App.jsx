import React, { useState, useEffect } from 'react';
import { 
  Rocket,
  MousePointerClick
} from 'lucide-react';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                <div className="mb-4 flex justify-center text-indigo-600">
                        <Rocket size={48} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Nuevo Prototipo</h1>
                <p className="text-slate-500 mb-6">
                    Pega tu código React aquí (reemplazando este componente).
                </p>
                
                <button 
                    onClick={() => setCount(c => c + 1)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 mx-auto w-full"
                >
                    <MousePointerClick size={18} />
                    Clicks: {count}
                </button>
            </div>
        </div>
    );
}
