import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'roads',
    name: 'Roads & Pathways',
    icon: '🛣️',
    color: '#F59E0B',
    department: 'Public Works Department',
    keywords: ['road', 'pothole', 'crack', 'pathway', 'sidewalk', 'pavement', 'street', 'damaged', 'broken', 'highway', 'lane', 'footpath'],
    subCategories: [
      { id: 'damaged_road', name: 'Damaged Road', description: 'Major road damage or complete breakdown of road surface', defaultPriority: 'high', isEmergency: false },
      { id: 'pothole', name: 'Pothole', description: 'Holes or pits in road surface causing hazard', defaultPriority: 'medium', isEmergency: false },
      { id: 'road_leakage', name: 'Road Leakage / Waterlogging', description: 'Water accumulation or leakage on roads', defaultPriority: 'high', isEmergency: false },
      { id: 'road_cracks', name: 'Road Cracks', description: 'Surface cracks that may worsen over time', defaultPriority: 'low', isEmergency: false },
      { id: 'missing_road_divider', name: 'Missing Road Divider', description: 'Road dividers damaged or missing', defaultPriority: 'medium', isEmergency: false },
      { id: 'footpath_damage', name: 'Footpath / Sidewalk Damage', description: 'Damaged footpath or broken tiles on walkways', defaultPriority: 'low', isEmergency: false },
      { id: 'road_collapse', name: 'Road Collapse / Sinkhole', description: 'Major road sinking or collapse - emergency', defaultPriority: 'emergency', isEmergency: true },
    ]
  },
  {
    id: 'sanitation',
    name: 'Sanitation & Waste',
    icon: '🗑️',
    color: '#10B981',
    department: 'Sanitation Department',
    keywords: ['garbage', 'waste', 'trash', 'drain', 'sewage', 'dirty', 'filth', 'litter', 'stench', 'dumping', 'blocked drain', 'overflow', 'cleanliness'],
    subCategories: [
      { id: 'garbage_accumulation', name: 'Garbage Accumulation', description: 'Uncollected garbage or waste buildup in public areas', defaultPriority: 'medium', isEmergency: false },
      { id: 'overflowing_drain', name: 'Overflowing Drain', description: 'Drains overflowing with water or sewage', defaultPriority: 'high', isEmergency: false },
      { id: 'blocked_sewage', name: 'Blocked Sewage Line', description: 'Sewage line blocked causing overflow', defaultPriority: 'high', isEmergency: false },
      { id: 'illegal_dumping', name: 'Illegal Dumping', description: 'Illegal waste disposal in public spaces', defaultPriority: 'medium', isEmergency: false },
      { id: 'drain_cleaning', name: 'Drain Cleaning Required', description: 'Drain needs regular cleaning or maintenance', defaultPriority: 'low', isEmergency: false },
      { id: 'sewage_leak', name: 'Sewage Leakage', description: 'Raw sewage leaking on roads or public areas', defaultPriority: 'emergency', isEmergency: true },
    ]
  },
  {
    id: 'electricity',
    name: 'Electricity & Lighting',
    icon: '⚡',
    color: '#3B82F6',
    department: 'Electricity Department',
    keywords: ['light', 'electric', 'power', 'outage', 'wire', 'streetlight', 'bulb', 'lamp', 'transformer', 'pole', 'blackout', 'spark', 'shock'],
    subCategories: [
      { id: 'streetlight_out', name: 'Street Light Not Working', description: 'Public street lights not functioning', defaultPriority: 'medium', isEmergency: false },
      { id: 'power_outage', name: 'Power Outage / Blackout', description: 'Complete loss of power in area', defaultPriority: 'high', isEmergency: false },
      { id: 'fallen_wire', name: 'Fallen Electrical Wire', description: 'Downed power lines posing danger - emergency', defaultPriority: 'emergency', isEmergency: true },
      { id: 'broken_pole', name: 'Broken Electrical Pole', description: 'Damaged or broken electrical pole', defaultPriority: 'high', isEmergency: false },
      { id: 'transformer_issue', name: 'Transformer Issue', description: 'Transformer malfunction or damage', defaultPriority: 'high', isEmergency: false },
      { id: 'meter_issue', name: 'Electricity Meter Issue', description: 'Faulty or damaged electricity meter', defaultPriority: 'low', isEmergency: false },
    ]
  },
  {
    id: 'water',
    name: 'Water Supply',
    icon: '💧',
    color: '#06B6D4',
    department: 'Water Supply Department',
    keywords: ['water', 'pipe', 'supply', 'leakage', 'pressure', 'tap', 'reservoir', 'tank', 'sewage', 'drinking water', 'municipal water'],
    subCategories: [
      { id: 'no_water', name: 'No Water Supply', description: 'Complete absence of water supply', defaultPriority: 'high', isEmergency: false },
      { id: 'low_pressure', name: 'Low Water Pressure', description: 'Water supply at extremely low pressure', defaultPriority: 'medium', isEmergency: false },
      { id: 'pipe_leakage', name: 'Pipe Leakage', description: 'Water pipe burst or leaking on street', defaultPriority: 'high', isEmergency: false },
      { id: 'water_contamination', name: 'Water Contamination', description: 'Contaminated or dirty water supply - emergency', defaultPriority: 'emergency', isEmergency: true },
      { id: 'water_wastage', name: 'Water Wastage / Open Tap', description: 'Public tap left open or water being wasted', defaultPriority: 'medium', isEmergency: false },
      { id: 'broken_hydrant', name: 'Broken Fire Hydrant', description: 'Fire hydrant damaged or leaking', defaultPriority: 'high', isEmergency: false },
    ]
  },
  {
    id: 'infrastructure',
    name: 'Public Infrastructure',
    icon: '🏗️',
    color: '#8B5CF6',
    department: 'Municipal Corporation',
    keywords: ['park', 'bench', 'bus', 'shelter', 'public', 'building', 'broken', 'damaged', 'facility', 'playground', 'garden', 'sign', 'signal'],
    subCategories: [
      { id: 'broken_bench', name: 'Broken Public Bench/Seating', description: 'Damaged public seating areas', defaultPriority: 'low', isEmergency: false },
      { id: 'park_damage', name: 'Park / Garden Damage', description: 'Public parks or gardens in poor condition', defaultPriority: 'low', isEmergency: false },
      { id: 'bus_shelter', name: 'Bus Shelter Damage', description: 'Damaged bus stop or shelter', defaultPriority: 'medium', isEmergency: false },
      { id: 'traffic_signal', name: 'Traffic Signal Issue', description: 'Malfunctioning traffic lights', defaultPriority: 'high', isEmergency: false },
      { id: 'public_toilet', name: 'Public Toilet Issue', description: 'Damaged or non-functional public toilet', defaultPriority: 'medium', isEmergency: false },
      { id: 'bridge_damage', name: 'Bridge / Overpass Damage', description: 'Structural damage to bridges - potential emergency', defaultPriority: 'emergency', isEmergency: true },
    ]
  },
  {
    id: 'trees',
    name: 'Trees & Green Spaces',
    icon: '🌳',
    color: '#22C55E',
    department: 'Horticulture Department',
    keywords: ['tree', 'branch', 'fallen', 'overgrown', 'garden', 'plant', 'grass', 'vegetation', 'forest', 'wood'],
    subCategories: [
      { id: 'fallen_tree', name: 'Fallen Tree', description: 'Tree fallen on road or public space', defaultPriority: 'high', isEmergency: false },
      { id: 'overgrown_tree', name: 'Overgrown Tree / Branches', description: 'Tree branches obstructing traffic or visibility', defaultPriority: 'medium', isEmergency: false },
      { id: 'dead_tree', name: 'Dead Tree / Safety Risk', description: 'Dead tree posing fall risk', defaultPriority: 'high', isEmergency: false },
      { id: 'illegal_tree_cutting', name: 'Illegal Tree Cutting', description: 'Unauthorized removal of public trees', defaultPriority: 'high', isEmergency: false },
    ]
  },
  {
    id: 'health',
    name: 'Public Health & Safety',
    icon: '🏥',
    color: '#EF4444',
    department: 'Health Department',
    keywords: ['health', 'disease', 'mosquito', 'stagnant', 'rats', 'pest', 'epidemic', 'contamination', 'hazard', 'toxic', 'smoke', 'fire'],
    subCategories: [
      { id: 'stagnant_water', name: 'Stagnant Water / Mosquito Breeding', description: 'Standing water promoting mosquito breeding', defaultPriority: 'high', isEmergency: false },
      { id: 'pest_infestation', name: 'Pest / Rodent Infestation', description: 'Rat or pest infestation in public spaces', defaultPriority: 'medium', isEmergency: false },
      { id: 'illegal_burning', name: 'Illegal Burning / Smoke Hazard', description: 'Open burning causing air pollution', defaultPriority: 'medium', isEmergency: false },
      { id: 'fire', name: 'Fire Outbreak', description: 'Fire in public area - EMERGENCY', defaultPriority: 'emergency', isEmergency: true },
    ]
  }
];

export const DEPARTMENTS = [
  'Public Works Department',
  'Sanitation Department',
  'Electricity Department',
  'Water Supply Department',
  'Municipal Corporation',
  'Horticulture Department',
  'Health Department',
  'Traffic Police',
  'Town Planning',
];

// NLP Keyword mapping for auto-categorization
export function detectCategory(text: string): { category: Category | null; subCategory: string | null; confidence: number; priority: string } {
  const lowerText = text.toLowerCase();
  let bestMatch: { category: Category; score: number } | null = null;

  for (const cat of CATEGORIES) {
    let score = 0;
    for (const keyword of cat.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        score += keyword.length > 5 ? 3 : 1;
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { category: cat, score };
    }
  }

  if (!bestMatch) return { category: null, subCategory: null, confidence: 0, priority: 'medium' };

  // Detect sub-category
  const cat = bestMatch.category;
  let bestSubCat: string | null = null;
  let subScore = 0;
  for (const sub of cat.subCategories) {
    const subWords = sub.name.toLowerCase().split(/[\s/]+/);
    const matches = subWords.filter(w => lowerText.includes(w)).length;
    if (matches > subScore) {
      subScore = matches;
      bestSubCat = sub.id;
    }
  }

  // Emergency detection
  const emergencyWords = ['fire', 'collapse', 'emergency', 'urgent', 'danger', 'hazard', 'fallen wire', 'contamination', 'explosion', 'flood'];
  const isEmergency = emergencyWords.some(w => lowerText.includes(w));
  const priority = isEmergency ? 'emergency' : bestMatch.score > 5 ? 'high' : 'medium';

  const confidence = Math.min(95, 40 + bestMatch.score * 8);

  return {
    category: bestMatch.category,
    subCategory: bestSubCat,
    confidence,
    priority
  };
}
