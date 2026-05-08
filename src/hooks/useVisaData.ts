import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

export interface VisaType {
  id: string;
  code: string;
  purpose: string;
  purpose_en: string;
  description: string;
  description_en: string;
  sort_order: number;
  is_active: boolean;
}

export interface VisaDocument {
  id: string;
  visa_code: string;
  section: 'general' | 'special';
  icon: string;
  doc_title: string;
  doc_title_en: string;
  doc_description: string;
  doc_description_en: string;
  link_url?: string;
  sort_order: number;
  is_required: boolean;
}

export function useVisaTypes() {
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    fetchVisaTypes();
  }, []);

  const fetchVisaTypes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visa_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (!error && data) {
      setVisaTypes(data);
    }
    setLoading(false);
  };

  return { visaTypes, loading, refetch: fetchVisaTypes };
}

export function useVisaDocuments(visaCode: string) {
  const [documents, setDocuments] = useState<{ general: VisaDocument[]; special: VisaDocument[] }>({
    general: [],
    special: []
  });
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    if (visaCode) {
      fetchDocuments();
    }
  }, [visaCode, language]);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visa_documents')
      .select('*')
      .eq('visa_code', visaCode)
      .order('section', { ascending: true })
      .order('sort_order');
    
    if (!error && data) {
      const general = data.filter(d => d.section === 'general');
      const special = data.filter(d => d.section === 'special');
      setDocuments({ general, special });
    }
    setLoading(false);
  };

  return { documents, loading, refetch: fetchDocuments };
}
