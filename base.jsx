import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  List, 
  Users, 
  CreditCard, 
  Info, 
  CheckCircle2, 
  MapPin, 
  Ticket, 
  User,
  AlertCircle,
  Split,
  Merge,
  Lock,
  Plus
} from 'lucide-react';

export default function EventTicketConfigurator() {
  // --- STATE MANAGEMENT ---
  
  // Modos de venta: 'MAP' (A), 'LIST_TICKET' (B1), 'LIST_PERSON' (B2)
  const [salesMode, setSalesMode] = useState('MAP');

  // Estado para controlar el desglose de precios
  const [isPriceBrokenDown, setIsPriceBrokenDown] = useState(false);

  const [formData, setFormData] = useState({
    // Capacidad (Siempre por mesa)
    minPax: 4,
    maxPax: 6,
    stock: 50, // Siempre cantidad de mesas
    
    // Reglas de Compra (Caso A)
    minQtyPurchase: 1,
    maxQtyPurchase: 1,

    // Combinación de Mesas (Casos B1 y B2)
    allowCombine: false,
    maxCombine: 2,

    // Precios (Componentes)
    totalPrice: 200,   // Precio manual unificado (Por defecto)
    entryFee: 50,      // Cargo de entrada (Oculto si no está desglosado)
    minConsumption: 150, // Consumo mínimo (Oculto si no está desglosado)
    pricePerPerson: 60, // Solo para Caso B2 (100% Prepago)

    // Prepago (Afecta al precio de la MESA)
    prepayType: 'percent', // 'percent' | 'fixed'
    prepayValue: 20,
  });

  // Cálculo Dinámico del Total Base de la MESA
  const totalBasePrice = isPriceBrokenDown 
    ? (parseFloat(formData.entryFee || 0) + parseFloat(formData.minConsumption || 0))
    : parseFloat(formData.totalPrice || 0);
  
  // --- LÓGICA DE PREPAGO ---
  
  // 1. Prepago derivado de la MESA (Sujeto a % o Fijo)
  const calculateTablePrepay = () => {
    let base = totalBasePrice;
    if (formData.prepayType === 'fixed') return parseFloat(formData.prepayValue || 0);
    return (base * (parseFloat(formData.prepayValue || 0) / 100));
  };

  const tablePrepayAmount = calculateTablePrepay();

  // 2. Prepago derivado de la PERSONA (Siempre 100%)
  const personPrepayAmount = salesMode === 'LIST_PERSON' 
    ? parseFloat(formData.pricePerPerson || 0) 
    : 0;

  // 3. Total a pagar ahora (Suma de ambos)
  const totalPayNow = tablePrepayAmount + personPrepayAmount;

  // Handler genérico
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler para cambiar modo de desglose
  const togglePriceBreakdown = () => {
    if (!isPriceBrokenDown) {
        // De Simple -> Desglosado
        setFormData(prev => ({
            ...prev,
            minConsumption: prev.totalPrice,
            entryFee: 0
        }));
    } else {
        // De Desglosado -> Simple
        setFormData(prev => ({
            ...prev,
            totalPrice: (parseFloat(prev.entryFee || 0) + parseFloat(prev.minConsumption || 0))
        }));
    }
    setIsPriceBrokenDown(!isPriceBrokenDown);
  };

  // --- UI COMPONENTS ---

  const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="mb-6 border-b pb-4">
      <div className="flex items-center gap-2 mb-1 text-slate-800">
        <Icon className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-sm text-slate-500 ml-7">{description}</p>
    </div>
  );

  const InputField = ({ label, name, type = "number", suffix, prefix, help, disabled, min }) => (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</label>
      <div className={`flex items-center border rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition-all ${disabled ? 'bg-slate-100 text-slate-400' : ''}`}>
        {prefix && <span className="text-slate-400 mr-2">{prefix}</span>}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={disabled}
          min={min}
          className="w-full outline-none bg-transparent text-slate-800 font-medium"
        />
        {suffix && <span className="text-slate-400 ml-2 text-sm">{suffix}</span>}
      </div>
      {help && <p className="text-xs text-slate-400 mt-1">{help}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Configuración de Reservados VIP</h1>
          <p className="text-slate-500 mt-2">Define las reglas de venta, capacidad y precios para tus zonas exclusivas.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: EDITOR FORM --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. SELECCIÓN DE TIPO */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <SectionHeader 
                icon={LayoutGrid} 
                title="Tipo de Venta" 
                description="¿Cómo seleccionará el cliente su reservado?"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => setSalesMode('MAP')}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${salesMode === 'MAP' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                      <MapPin className={`w-5 h-5 ${salesMode === 'MAP' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    {salesMode === 'MAP' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <h4 className="font-bold text-slate-800">Selección en Plano</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-tight">El usuario elige una mesa específica visualmente sobre el mapa del local.</p>
                </button>

                <button 
                  onClick={() => setSalesMode('LIST_TICKET')}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${salesMode.startsWith('LIST') ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                      <List className={`w-5 h-5 ${salesMode.startsWith('LIST') ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    {salesMode.startsWith('LIST') && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <h4 className="font-bold text-slate-800">Venta por Listado (Card)</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-tight">Venta general sin ubicación específica.</p>
                </button>
              </div>

              {salesMode.startsWith('LIST') && (
                <div className="bg-white border border-indigo-100 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-3 block">Modalidad de precio en listado:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="listType" 
                        checked={salesMode === 'LIST_TICKET'} 
                        onChange={() => setSalesMode('LIST_TICKET')}
                        className="text-indigo-600 focus:ring-indigo-500" 
                      />
                      <span className="text-sm font-medium">Por Mesa Completa (Ticket)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="listType" 
                        checked={salesMode === 'LIST_PERSON'} 
                        onChange={() => setSalesMode('LIST_PERSON')}
                        className="text-indigo-600 focus:ring-indigo-500" 
                      />
                      <span className="text-sm font-medium">Por Persona (Individual)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 2. CAPACIDAD Y REGLAS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <SectionHeader 
                icon={Users} 
                title="Capacidad y Aforo" 
                description="Define las reglas de ocupación y disponibilidad."
              />

              <div className="grid grid-cols-2 gap-6 mb-6">
                <InputField label="Mín. Personas (Por Mesa)" name="minPax" suffix="pax" />
                <InputField label="Máx. Personas (Por Mesa)" name="maxPax" suffix="pax" />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 mb-6">
                {salesMode === 'MAP' ? (
                   <div className="flex items-start gap-3">
                     <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                     <div>
                       <h5 className="text-sm font-bold text-slate-700">Stock controlado por el Plano</h5>
                       <p className="text-xs text-slate-500 mt-1">La cantidad disponible dependerá del número de mesas de este tipo que dibujes en el editor de planos.</p>
                     </div>
                   </div>
                ) : (
                   <InputField 
                    label="Cantidad Disponible (Stock)" 
                    name="stock"
                    suffix="mesas"
                    help="Número total de mesas/reservados de este tipo a la venta." 
                   />
                )}
              </div>

              {salesMode === 'MAP' && (
                 <div className="grid grid-cols-2 gap-6 border-t pt-4">
                    <div className="col-span-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Límites por compra (Solo Plano)</span>
                    </div>
                    <InputField label="Mín. Mesas x Compra" name="minQtyPurchase" />
                    <InputField label="Máx. Mesas x Compra" name="maxQtyPurchase" />
                 </div>
              )}

              {salesMode.startsWith('LIST') && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700">Permitir combinar mesas</label>
                      <p className="text-xs text-slate-500">¿El usuario puede juntar varios reservados?</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="allowCombine" 
                            id="toggle" 
                            checked={formData.allowCombine}
                            onChange={handleChange}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-indigo-600"
                            style={{right: formData.allowCombine ? 0 : 'auto', left: formData.allowCombine ? 'auto' : 0}}
                        />
                        <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.allowCombine ? 'bg-indigo-600' : 'bg-slate-300'}`}></label>
                    </div>
                  </div>
                  
                  {formData.allowCombine && (
                    <div className="bg-indigo-50 p-4 rounded-md animate-in fade-in slide-in-from-top-1">
                        <InputField label="Máximo de mesas combinables" name="maxCombine" suffix="mesas" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. MOTOR DE PRECIOS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <SectionHeader 
                icon={CreditCard} 
                title="Estructura de Precios" 
                description="Define el valor del reservado."
              />

              {/* CASO B2: Precio por Persona */}
              {salesMode === 'LIST_PERSON' && (
                <div className="mb-6 bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex items-start gap-4">
                    <div className="flex-1">
                      <InputField 
                          label="Precio por Persona (PVP)" 
                          name="pricePerPerson" 
                          prefix="€" 
                          help="Este importe se cobrará íntegro (100% prepago) por cada asistente."
                      />
                    </div>
                    <div className="hidden md:flex h-full items-center pt-6 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5 mr-1" />
                        <span className="text-xs font-bold uppercase">Pago al momento</span>
                    </div>
                </div>
              )}

              {/* TOGGLE PARA DESGLOSE */}
              <div className="flex justify-end mb-2">
                <button 
                    onClick={togglePriceBreakdown}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full"
                >
                    {isPriceBrokenDown ? (
                        <>
                            <Merge className="w-3.5 h-3.5" />
                            Unificar en precio total
                        </>
                    ) : (
                        <>
                            <Split className="w-3.5 h-3.5" />
                            Desglosar en cargo entrada y consumo
                        </>
                    )}
                </button>
              </div>

              {/* LOGICA CONDICIONAL DE PRECIOS */}
              {!isPriceBrokenDown ? (
                // MODO SIMPLE (Total Manual)
                <div className="mb-6">
                    <InputField 
                        label="Valor Total de la Mesa/Reservado" 
                        name="totalPrice" 
                        prefix="€" 
                        help="Precio total base para reservar la mesa (independiente de las personas)."
                    />
                </div>
              ) : (
                // MODO DESGLOSADO (Inputs + Auto-Suma)
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6 animate-in fade-in slide-in-from-top-1">
                        <InputField 
                            label="Cargo Entrada (Fee)" 
                            name="entryFee" 
                            prefix="€" 
                            help="Coste del espacio"
                        />
                        <div className="text-center pb-8 text-slate-400 font-bold text-xl">+</div>
                        <InputField 
                            label="Consumo Mínimo" 
                            name="minConsumption" 
                            prefix="€" 
                            help="Crédito en barra"
                        />
                    </div>

                    <div className="bg-slate-900 text-white p-4 rounded-lg flex justify-between items-center mb-6">
                        <div>
                            <span className="text-xs text-slate-400 uppercase font-bold block">Valor Total de la Mesa</span>
                            <span className="text-xs text-slate-500">(Suma automática)</span>
                        </div>
                        <div className="text-2xl font-mono font-bold">
                            {totalBasePrice.toFixed(2)} €
                        </div>
                    </div>
                </>
              )}

              {/* PREPAGO */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-baseline mb-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Política de Prepago (Sobre la Mesa)</label>
                    {salesMode === 'LIST_PERSON' && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            + 100% del Precio por Persona
                        </span>
                    )}
                </div>
                
                {/* PREPAGO DE MESA SIEMPRE ACTIVO */}
                <div className="flex gap-4 items-start">
                    <select 
                        name="prepayType" 
                        value={formData.prepayType} 
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2 bg-white text-sm h-[42px] focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="percent">Porcentaje (%)</option>
                        <option value="fixed">Importe Fijo (€)</option>
                    </select>
                    
                    <div className="flex-1">
                        <input
                        type="number"
                        name="prepayValue"
                        value={formData.prepayValue}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 h-[42px] focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <div className="mt-2 text-xs text-slate-500">
                           <p>
                                Prepago de la mesa: <strong>{tablePrepayAmount.toFixed(2)} €</strong>.
                           </p>
                           {salesMode === 'LIST_PERSON' && (
                               <p className="mt-1 text-slate-400 italic">
                                   (Se sumará al precio por persona en el checkout)
                               </p>
                           )}
                        </div>
                    </div>
                </div>
              </div>

            </div>

          </div>

          {/* --- RIGHT COLUMN: LIVE PREVIEW --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Vista Previa (App Cliente)</h3>
              
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 transform transition-all hover:scale-[1.02]">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center relative">
                    {salesMode === 'MAP' && <MapPin className="text-white/30 w-16 h-16 absolute -bottom-2 -right-2" />}
                    {salesMode !== 'MAP' && <Ticket className="text-white/30 w-16 h-16 absolute -bottom-2 -right-2" />}
                    
                    <div className="text-center text-white">
                        <span className="inline-block px-3 py-1 bg-black/20 rounded-full text-xs font-bold mb-1 backdrop-blur-sm">
                            {salesMode === 'MAP' ? 'RESERVA EN PLANO' : 'ENTRADA GENERAL'}
                        </span>
                        <h3 className="font-bold text-lg">Mesa VIP Gold</h3>
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">
                            {formData.minPax} - {formData.maxPax} Personas
                        </span>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm text-slate-500">
                                {salesMode === 'LIST_PERSON' ? 'Precio Ticket' : 'Precio Total'}
                            </span>
                            <span className="text-xl font-bold text-slate-900">
                                {salesMode === 'LIST_PERSON' 
                                    ? `${formData.pricePerPerson} € /pers`
                                    : `${totalBasePrice} €`
                                }
                            </span>
                        </div>
                        
                        {/* En B2, mostramos también el coste de mesa si existe */}
                        {salesMode === 'LIST_PERSON' && (
                             <div className="flex justify-between items-baseline text-xs text-slate-500 border-t border-dashed pt-2">
                                <span>+ Coste Mesa (Reserva)</span>
                                <span className="font-medium">{totalBasePrice} €</span>
                            </div>
                        )}

                        {/* Muestra desglose SOLO si está activado */}
                        {isPriceBrokenDown && (
                            <div className="bg-slate-50 p-3 rounded-md text-xs space-y-1 text-slate-500 animate-in fade-in zoom-in-95">
                                <div className="flex justify-between">
                                    <span>Incluye consumo:</span>
                                    <span className="font-medium text-slate-700">{formData.minConsumption} €</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cargo servicio:</span>
                                    <span className="font-medium text-slate-700">{formData.entryFee} €</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
                        <div className="w-full">
                            <p className="text-xs font-bold text-indigo-900 uppercase mb-0.5">A pagar ahora</p>
                            <p className="text-2xl font-bold text-indigo-700">
                                {totalPayNow.toFixed(2)} € 
                            </p>
                            
                            {/* Desglose explicativo en B2 para el usuario */}
                            {salesMode === 'LIST_PERSON' && (
                                <p className="text-[10px] text-indigo-600/80 mt-1 leading-tight">
                                    ({formData.pricePerPerson}€ Entrada + {tablePrepayAmount.toFixed(2)}€ Señal Mesa)
                                </p>
                            )}
                        </div>
                    </div>

                    {(salesMode.startsWith('LIST') && formData.allowCombine) && (
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                            <AlertCircle className="w-3 h-3" />
                            <span>Combinable hasta {formData.maxCombine} mesas</span>
                        </div>
                    )}
                </div>

                <div className="px-5 pb-5">
                    <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                        {salesMode === 'MAP' ? 'Seleccionar en Mapa' : 'Añadir al Carrito'}
                    </button>
                </div>

              </div>

              <div className="mt-8 p-4 border border-dashed border-slate-300 rounded-lg opacity-50 text-[10px] font-mono text-slate-500">
                <p className="font-bold mb-2">DEBUG STATE:</p>
                <p>Mode: {salesMode}</p>
                <p>BrokenDown: {isPriceBrokenDown ? 'YES' : 'NO'}</p>
                <p>Table Total: {totalBasePrice}</p>
                <p>PayNow: {totalPayNow}</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}