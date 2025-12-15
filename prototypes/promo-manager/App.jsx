import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Ticket,
  Users,
  Percent,
  ToggleLeft,
  ToggleRight,
  X,
  ChevronRight,
  ChevronDown,
  Check,
  AlertCircle,
  Calendar,
  Euro,
  Copy,
  Layers,
  Globe,
  MapPin,
  ShoppingBag,
  Briefcase
} from 'lucide-react';

export default function PromotionsModule() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  // --- MOCK DATA ---
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Campaña RRPP Verano",
      type: "batch",
      codeDisplay: "RRPP-...",
      discount: "20%",
      scope: "Entrada + Compl.",
      usage: 45,
      limit: 100,
      status: "active",
      revenueImpact: 1250
    },
    {
      id: 2,
      name: "Influencer: MariaG",
      type: "single",
      codeDisplay: "MARIAG-VIP",
      discount: "10€",
      scope: "Solo Cover",
      usage: 12,
      limit: null,
      status: "active",
      revenueImpact: 120
    }
  ]);

  // --- WIZARD STATE ---
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mode: 'single', // single | batch
    codeSingle: '',
    
    // Batch specific fields
    promotionTeam: '', // Nuevo campo obligatorio
    batchPrefix: '',
    batchQty: 50,
    
    valueType: 'percent', // percent | fixed
    valueAmount: '',
    
    // Nueva estructura de alcance
    productScope: 'total_bundle', // ticket_only | addon_only | total_bundle
    componentScope: {
        totalPrice: true,
        perPerson: false,
        coverCharge: false,
        minSpend: false,
        prepay: false
    },
    
    globalLimit: '',
    buyerLimit: 1,
    startDate: '',
    endDate: '',
    
    // Asignación Jerárquica
    selectedWebs: [],
    selectedVenues: [],
    selectedEvents: [],
    selectedProducts: []
  });

  // Handler para checkboxes de componentes
  const toggleComponent = (key) => {
    setFormData(prev => ({
        ...prev,
        componentScope: {
            ...prev.componentScope,
            [key]: !prev.componentScope[key]
        }
    }));
  };

  const handleCreate = () => {
    // Simula creación
    const newCampaign = {
      id: campaigns.length + 1,
      name: formData.name || "Nueva Campaña",
      type: formData.mode,
      codeDisplay: formData.mode === 'single' ? formData.codeSingle : `${formData.batchPrefix}-...`,
      discount: formData.valueType === 'percent' ? `${formData.valueAmount}%` : `${formData.valueAmount}€`,
      scope: formData.productScope === 'ticket_only' ? 'Solo Entrada' : 'Entrada + Compl.',
      usage: 0,
      limit: formData.globalLimit || '∞',
      status: 'active',
      revenueImpact: 0
    };
    setCampaigns([newCampaign, ...campaigns]);
    setIsWizardOpen(false);
    setStep(1);
    // Reset form...
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- HEADER SUPERIOR --- */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promociones y Descuentos</h1>
          <p className="text-sm text-slate-500">Gestiona códigos promocionales, campañas de influencers y reglas de precios.</p>
        </div>
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm active:transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Crear Campaña
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        
        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Campañas Activas" value="2" icon={Ticket} color="text-indigo-600" bg="bg-indigo-50" />
          <KpiCard title="Códigos Canjeados" value="57" icon={Users} color="text-emerald-600" bg="bg-emerald-50" sub="Esta semana" />
          <KpiCard title="Total Descontado" value="1,370€" icon={Euro} color="text-amber-600" bg="bg-amber-50" sub="Impacto Global" />
          <KpiCard title="Retorno (ROI)" value="12.5x" icon={Percent} color="text-blue-600" bg="bg-blue-50" sub="Ingresos generados" />
        </div>

        {/* --- TABLE CONTROLS --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* ... (Table controls remain same) ... */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {['active', 'expired', 'all'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'active' ? 'Activas' : tab === 'expired' ? 'Finalizadas' : 'Todas'}
                </button>
              ))}
            </div>
            </div>

          {/* --- CAMPAIGNS TABLE --- */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Nombre Campaña</th>
                <th className="px-6 py-4">Identificador</th>
                <th className="px-6 py-4">Beneficio</th>
                <th className="px-6 py-4">Alcance</th>
                <th className="px-6 py-4">Uso / Límite</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{camp.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      camp.type === 'batch' 
                      ? 'bg-purple-50 text-purple-700 border-purple-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {camp.type === 'batch' ? 'BATCH (PROMOTORES)' : 'CÓDIGO ÚNICO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      {camp.codeDisplay}
                      <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700">{camp.discount}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {camp.scope}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${camp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} 
                          style={{ width: `${camp.limit ? (camp.usage / camp.limit) * 100 : 50}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{camp.usage} / {camp.limit || '∞'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${camp.status === 'active' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${camp.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- WIZARD MODAL --- */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Nueva Campaña</h2>
                <p className="text-sm text-slate-500 mt-1">Configura las reglas de tu promoción en 3 pasos.</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stepper */}
            <div className="px-8 pt-6 pb-2">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
                <StepIndicator num={1} title="Identidad" current={step} />
                <StepIndicator num={2} title="Reglas" current={step} />
                <StepIndicator num={3} title="Asignación" current={step} />
              </div>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="p-8 overflow-y-auto flex-1">
              
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <InputGroup label="Nombre Interno de la Campaña" placeholder="Ej: Influencers Verano 2024" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700">Tipo de Generación</label>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectableCard 
                        selected={formData.mode === 'single'} 
                        onClick={() => setFormData({...formData, mode: 'single'})}
                        icon={Ticket}
                        title="Código Único"
                        desc="Una sola palabra para todos (ej. HOLA20)"
                      />
                      <SelectableCard 
                        selected={formData.mode === 'batch'} 
                        onClick={() => setFormData({...formData, mode: 'batch'})}
                        icon={Users} // Changed icon to Users for RRPP context
                        title="Lote para Promotores (Batch)"
                        desc="Generar múltiples códigos para repartir entre RRPP."
                      />
                    </div>
                  </div>

                  {formData.mode === 'single' ? (
                     <InputGroup label="Código Promocional" placeholder="Ej: VERANO2024" value={formData.codeSingle} onChange={(e) => setFormData({...formData, codeSingle: e.target.value.toUpperCase()})} />
                  ) : (
                    <div className="space-y-4">
                        {/* SELECCIÓN DE EQUIPO OBLIGATORIA */}
                        <div className="w-full">
                            <label className="text-sm font-bold text-slate-700 mb-1.5 block">Equipo de Promoción <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <select 
                                    className="w-full border border-slate-300 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white cursor-pointer"
                                    value={formData.promotionTeam}
                                    onChange={(e) => setFormData({...formData, promotionTeam: e.target.value})}
                                >
                                    <option value="">Seleccionar equipo responsable...</option>
                                    <option value="rrpp_noche">Equipo RRPP Noche (25 promotores)</option>
                                    <option value="rrpp_tarde">Equipo Tardeo & Brunch (12 promotores)</option>
                                    <option value="ambassadors">Embajadores Universitarios (50 miembros)</option>
                                    <option value="external_agency">Agencia Externa "EventoTop"</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Se generarán códigos únicos vinculados a cada miembro de este equipo.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                            <InputGroup label="Prefijo Promotor" placeholder="Ej: RRPP-" value={formData.batchPrefix} onChange={(e) => setFormData({...formData, batchPrefix: e.target.value})} />
                            <InputGroup label="Cantidad (por miembro)" type="number" placeholder="50" value={formData.batchQty} onChange={(e) => setFormData({...formData, batchQty: e.target.value})} />
                        </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: RULES */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  
                  {/* Descuento Valor */}
                  <div className="flex gap-6">
                    <div className="w-1/3">
                        <label className="text-sm font-bold text-slate-700 mb-2 block">Tipo Descuento</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setFormData({...formData, valueType: 'percent'})}
                                className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-1 ${formData.valueType === 'percent' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                            >
                                <Percent className="w-4 h-4" /> %
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, valueType: 'fixed'})}
                                className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-1 ${formData.valueType === 'fixed' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                            >
                                <Euro className="w-4 h-4" /> €
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <InputGroup label="Valor del Descuento" type="number" placeholder={formData.valueType === 'percent' ? "20" : "10"} value={formData.valueAmount} onChange={(e) => setFormData({...formData, valueAmount: e.target.value})} suffix={formData.valueType === 'percent' ? "%" : "€"} />
                    </div>
                  </div>

                  {/* Alcance Financiero Detallado */}
                  <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-lg space-y-4">
                    <label className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                        <Euro className="w-4 h-4" />
                        Alcance Financiero
                    </label>

                    {/* Nivel 1: Producto */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-indigo-800 uppercase">1. ¿Qué productos afecta?</p>
                        <div className="flex gap-2">
                            {['ticket_only', 'addon_only', 'total_bundle'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({...formData, productScope: opt})}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                                        formData.productScope === opt 
                                        ? 'bg-indigo-600 text-white border-indigo-600' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                                    }`}
                                >
                                    {opt === 'ticket_only' && 'Solo Entrada'}
                                    {opt === 'addon_only' && 'Solo Complementos'}
                                    {opt === 'total_bundle' && 'Entrada + Complementos'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nivel 2: Componentes */}
                    <div className="space-y-2 pt-2 border-t border-indigo-100">
                        <p className="text-xs font-bold text-indigo-800 uppercase">2. ¿Qué componentes del precio?</p>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                             <CheckboxLabel label="Precio Total" checked={formData.componentScope.totalPrice} onChange={() => toggleComponent('totalPrice')} />
                             <CheckboxLabel label="Adelantos (Prepago)" checked={formData.componentScope.prepay} onChange={() => toggleComponent('prepay')} />
                             <CheckboxLabel label="Precio por Persona" checked={formData.componentScope.perPerson} onChange={() => toggleComponent('perPerson')} />
                             <CheckboxLabel label="Cover Charge (Fee)" checked={formData.componentScope.coverCharge} onChange={() => toggleComponent('coverCharge')} />
                             <CheckboxLabel label="Min Spend (Consumo)" checked={formData.componentScope.minSpend} onChange={() => toggleComponent('minSpend')} />
                        </div>
                        <p className="text-[10px] text-indigo-400 italic mt-1">* Se aplicará a todos los seleccionados que existan en el producto.</p>
                    </div>
                  </div>

                  {/* Límites y Fechas */}
                  <div className="grid grid-cols-2 gap-6">
                     <InputGroup label="Límite Global de Usos (Opcional)" placeholder="Vacío = Ilimitado" value={formData.globalLimit} />
                     <InputGroup label="Límite por Comprador" placeholder="1" value={formData.buyerLimit} />
                     
                     <InputGroup label="Válido desde (Fecha)" type="date" value={formData.startDate} icon={Calendar} />
                     <InputGroup label="Válido hasta (Fecha)" type="date" value={formData.endDate} icon={Calendar} />
                  </div>
                </div>
              )}

              {/* STEP 3: TARGETING (Hierarchical) */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  
                  <div className="bg-amber-50 p-3 rounded-md text-xs text-amber-800 flex gap-2">
                     <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                     <span>La selección es en cascada: Si seleccionas un Venue, se aplicará a todos sus Eventos y Productos automáticamente.</span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                            <h4 className="font-bold text-sm text-slate-700">Asignación Jerárquica</h4>
                        </div>
                        
                        {/* Simulación de Árbol */}
                        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                            
                            {/* Nivel 1: Web */}
                            <HierarchyItem icon={Globe} title="Web de Ventas Principal" level={0} isOpenDefault={true}>
                                {/* Nivel 2: Venue */}
                                <HierarchyItem icon={MapPin} title="Sala Kapital" level={1} isOpenDefault={true}>
                                    
                                    {/* Nivel 3: Eventos */}
                                    <HierarchyItem icon={Calendar} title="Evento: Viernes Noche" level={2} isOpenDefault={true}>
                                        {/* Nivel 4: Productos */}
                                        <div className="pl-6 space-y-2 pt-1">
                                            <SimpleCheckbox label="Entrada General" checked={true} />
                                            <SimpleCheckbox label="Mesa VIP Gold (4pax)" checked={true} />
                                            <SimpleCheckbox label="Mesa VIP Silver" checked={false} />
                                            <SimpleCheckbox label="Parking (Complemento)" checked={true} isAddon />
                                        </div>
                                    </HierarchyItem>

                                    <HierarchyItem icon={Calendar} title="Evento: Sábado Tardeo" level={2}>
                                        <div className="pl-6 text-xs text-slate-400 italic">Desplegar para ver productos...</div>
                                    </HierarchyItem>

                                </HierarchyItem>

                                <HierarchyItem icon={MapPin} title="Terraza de Verano" level={1}>
                                    <div className="pl-6 text-xs text-slate-400 italic">Desplegar para ver eventos...</div>
                                </HierarchyItem>
                            </HierarchyItem>
                            
                        </div>
                   </div>

                   <div className="bg-indigo-50 p-4 rounded-lg flex gap-3 items-start">
                        <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-indigo-900">
                            <p className="font-bold">Resumen:</p>
                            <p className="opacity-80">El descuento se aplicará en <strong>3 productos</strong> del evento "Viernes Noche".</p>
                        </div>
                   </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-slate-100 p-6 flex justify-between items-center">
              {step > 1 ? (
                 <button onClick={() => setStep(step - 1)} className="text-slate-500 font-medium hover:text-slate-800 px-4 py-2">Atrás</button>
              ) : (
                 <div></div>
              )}
              
              <button 
                onClick={() => step < 3 ? setStep(step + 1) : handleCreate()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm shadow-indigo-200 flex items-center gap-2"
              >
                {step < 3 ? (
                    <>Siguiente <ChevronRight className="w-4 h-4" /></>
                ) : (
                    'Crear Campaña'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// --- SUBCOMPONENTS ---

function HierarchyItem({ icon: Icon, title, level, children, isOpenDefault }) {
    const [isOpen, setIsOpen] = useState(isOpenDefault || false);
    const indent = level * 24;

    return (
        <div className="select-none">
            <div 
                className="flex items-center gap-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer"
                style={{ paddingLeft: `${indent}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="p-0.5 rounded hover:bg-slate-200 transition-colors">
                    {children ? (
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                </div>
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" onClick={(e) => e.stopPropagation()} />
                <Icon className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{title}</span>
            </div>
            {isOpen && children && (
                <div className="border-l border-slate-100 ml-[11px]" style={{ marginLeft: `${indent + 11}px` }}>
                    <div style={{ marginLeft: `-${indent + 11}px` }}>
                    {children}
                    </div>
                </div>
            )}
        </div>
    )
}

function SimpleCheckbox({ label, checked, isAddon }) {
    return (
        <label className="flex items-center gap-3 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked={checked} />
            <div className="flex items-center gap-2">
                {isAddon ? <ShoppingBag className="w-3.5 h-3.5 text-slate-400" /> : <Ticket className="w-3.5 h-3.5 text-slate-400" />}
                <span className="text-sm text-slate-600">{label}</span>
                {isAddon && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Complemento</span>}
            </div>
        </label>
    )
}

function CheckboxLabel({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-indigo-100/50">
            <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 rounded border-indigo-200 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-indigo-900">{label}</span>
        </label>
    )
}

function KpiCard({ title, value, icon: Icon, color, bg, sub }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-3 rounded-lg ${bg} ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

function StepIndicator({ num, title, current }) {
    const isActive = current >= num;
    const isCurrent = current === num;
    return (
        <div className="flex flex-col items-center gap-2 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-slate-400'
            }`}>
                {num}
            </div>
            <span className={`text-xs font-medium ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>{title}</span>
        </div>
    )
}

function InputGroup({ label, type = "text", placeholder, value, onChange, suffix, icon: Icon }) {
    return (
        <div className="w-full">
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">{label}</label>
            <div className="relative flex items-center">
                {Icon && <Icon className="absolute left-3 w-4 h-4 text-slate-400" />}
                <input 
                    type={type} 
                    className={`w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${Icon ? 'pl-9' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {suffix && <span className="absolute right-3 text-slate-400 text-sm font-medium">{suffix}</span>}
            </div>
        </div>
    )
}

function SelectableCard({ selected, onClick, icon: Icon, title, desc }) {
    return (
        <div 
            onClick={onClick}
            className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:border-indigo-300 ${selected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'}`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${selected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className={`font-bold text-sm ${selected ? 'text-indigo-900' : 'text-slate-700'}`}>{title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
            </div>
        </div>
    )
}