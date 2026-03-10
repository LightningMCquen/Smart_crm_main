import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MapPin, Mic, Camera, Loader2, CheckCircle, AlertTriangle, X, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { Button, Input, Textarea, Select, Card, Badge } from '../../components/ui';
import { CATEGORIES, detectCategory } from '../../data/categories';
import { TicketPriority } from '../../types';

const priorityOptions = [
  { value: 'low', label: '🟢 Low Priority' },
  { value: 'medium', label: '🟡 Medium Priority' },
  { value: 'high', label: '🔴 High Priority' },
  { value: 'emergency', label: '🚨 EMERGENCY' },
];

export const SubmitComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addTicket } = useTicketStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    priority: 'medium' as TicketPriority,
    address: '',
    ward: user?.ward || '',
    pincode: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{ category: string; subCategory: string; priority: string; confidence: number } | null>(null);
  const [isListening, setIsListening] = useState(false);

  const setField = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const selectedCategory = CATEGORIES.find(c => c.id === form.category);

  const handleDescriptionChange = (val: string) => {
    setField('description', val);
    // Auto-detect category after 50 chars
    if (val.length > 50 && !form.category) {
      setTimeout(() => {
        setAiAnalyzing(true);
        setTimeout(() => {
          const result = detectCategory(val);
          if (result.category) {
            setAiResult({
              category: result.category.id,
              subCategory: result.subCategory || '',
              priority: result.priority,
              confidence: result.confidence,
            });
          }
          setAiAnalyzing(false);
        }, 1500);
      }, 500);
    }
  };

  const applyAiSuggestion = () => {
    if (aiResult) {
      setField('category', aiResult.category);
      setField('subCategory', aiResult.subCategory);
      setField('priority', aiResult.priority as TicketPriority);
      setAiResult(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setImages(prev => [...prev, result]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
    setErrors(e => ({ ...e, images: '' }));
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Please type your complaint.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setField('description', form.description + (form.description ? ' ' : '') + transcript);
    };
    recognition.start();
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Please enter a complaint title';
    if (!form.description.trim()) errs.description = 'Please describe the issue';
    if (!form.category) errs.category = 'Please select a category';
    if (!form.address.trim()) errs.address = 'Please enter the location';
    if (images.length === 0) errs.images = 'Please upload at least one photo';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    // Simulate AI image analysis
    await new Promise(r => setTimeout(r, 2000));

    const cat = CATEGORIES.find(c => c.id === form.category);
    const subCat = cat?.subCategories.find(s => s.id === form.subCategory);

    const ticket = addTicket({
      title: form.title,
      description: form.description,
      category: form.category,
      subCategory: form.subCategory,
      status: 'submitted',
      priority: form.priority,
      location: {
        address: form.address,
        lat: 19.0760 + Math.random() * 0.1,
        lng: 72.8777 + Math.random() * 0.1,
        ward: form.ward,
        pincode: form.pincode,
      },
      citizenId: user?.id || '',
      citizenName: user?.name || '',
      citizenPhone: user?.phone || '',
      images: images.slice(0, 3),
      aiDetectedCategory: aiResult?.category,
      aiConfidence: aiResult?.confidence,
      isEmergency: form.priority === 'emergency',
      assignedDepartment: cat?.department,
    });

    setTicketId(ticket.id);
    setTicketNumber(ticket.ticketNumber);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted!</h2>
        <p className="text-gray-500 mb-4">Your complaint has been registered and routed to the appropriate department.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">Your Ticket Number</p>
          <p className="text-2xl font-mono font-bold text-blue-700">{ticketNumber}</p>
          <p className="text-xs text-gray-400 mt-1">Save this for tracking your complaint</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/my-complaints')}>Track Complaint</Button>
          <Button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', category: '', subCategory: '', priority: 'medium', address: '', ward: user?.ward || '', pincode: '' }); setImages([]); }}>Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submit a Complaint</h1>
        <p className="text-gray-500 text-sm mt-1">Report an issue in your area. Photo is mandatory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* AI Analysis Banner */}
        <AnimatePresence>
          {aiAnalyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <Loader2 size={18} className="text-blue-600 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-800">AI analyzing your complaint...</p>
                <p className="text-xs text-blue-500">Detecting category and priority automatically</p>
              </div>
            </motion.div>
          )}

          {aiResult && !aiAnalyzing && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Zap size={18} className="text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-800">🤖 AI Detected Category</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Category: <strong>{CATEGORIES.find(c => c.id === aiResult.category)?.name}</strong> | 
                    Priority: <strong>{aiResult.priority}</strong> | 
                    Confidence: <strong>{aiResult.confidence}%</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={applyAiSuggestion}>Apply</Button>
                  <button onClick={() => setAiResult(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">Complaint Details</h3>
          <Input label="Complaint Title *" placeholder="Brief description of the issue" value={form.title} onChange={e => setField('title', e.target.value)} error={errors.title} />
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Description *</label>
              <button type="button" onClick={handleVoice}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors ${isListening ? 'bg-red-100 border-red-300 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                <Mic size={12} /> {isListening ? 'Listening...' : 'Voice Input'}
              </button>
            </div>
            <Textarea
              placeholder="Describe the issue in detail. AI will auto-detect category if not selected."
              value={form.description}
              onChange={e => handleDescriptionChange(e.target.value)}
              rows={4}
              error={errors.description}
            />
          </div>
        </Card>

        {/* Category Selection */}
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">Category (or let AI detect) </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setField('category', cat.id); setField('subCategory', ''); }}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
                  form.category === cat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
          {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}

          {selectedCategory && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCategory.subCategories.map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setField('subCategory', sub.id);
                      if (sub.isEmergency) setField('priority', 'emergency');
                      else if (sub.defaultPriority !== 'medium') setField('priority', sub.defaultPriority);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all text-sm ${
                      form.subCategory === sub.id ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {sub.isEmergency && <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />}
                    <div>
                      <p className="text-xs font-medium">{sub.name}</p>
                      <p className="text-xs text-gray-400">{sub.description.substring(0, 50)}...</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Priority */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Priority Level</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {priorityOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setField('priority', opt.value)}
                className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.priority === opt.value 
                    ? opt.value === 'emergency' ? 'border-red-500 bg-red-50 text-red-700' : 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {form.priority === 'emergency' && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-xs flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              Emergency tickets are immediately escalated to authorities and trigger SOS alerts.
            </div>
          )}
        </Card>

        {/* Location */}
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><MapPin size={16} /> Location</h3>
          <Input
            label="Full Address *"
            placeholder="Street, Area, City, Pincode"
            value={form.address}
            onChange={e => setField('address', e.target.value)}
            error={errors.address}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Ward Number" placeholder="e.g. Ward 42" value={form.ward} onChange={e => setField('ward', e.target.value)} />
            <Input label="Pincode" placeholder="6-digit pincode" value={form.pincode} onChange={e => setField('pincode', e.target.value)} />
          </div>
        </Card>

        {/* Photo Upload - MANDATORY */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <Camera size={16} /> Photo Evidence <span className="text-red-500">*</span>
            <Badge variant="danger" className="text-[10px]">MANDATORY</Badge>
          </h3>
          <p className="text-xs text-gray-500 mb-3">Photo is required for ticket submission. Upload clear images of the issue.</p>
          
          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleImageUpload} />
          
          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 cursor-pointer transition-colors"
            >
              <Upload size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 up to 10MB each</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={img} alt="evidence" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImages(i => i.filter((_, j) => j !== idx)); setImageFiles(f => f.filter((_, j) => j !== idx)); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors"
                  >
                    <Upload size={20} className="text-gray-400" />
                  </button>
                )}
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-700 font-medium">🤖 AI Image Analysis</p>
                <p className="text-xs text-purple-500">Image recognition will analyze your photos to confirm the issue type and severity.</p>
              </div>
            </div>
          )}
          {errors.images && <p className="mt-2 text-xs text-red-500">{errors.images}</p>}
        </Card>

        <Button type="submit" className="w-full" size="lg" loading={loading} icon={loading ? undefined : <CheckCircle size={18} />}>
          {loading ? 'Submitting & Analyzing...' : 'Submit Complaint'}
        </Button>
      </form>
    </div>
  );
};
