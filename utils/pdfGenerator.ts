
import { jsPDF } from 'jspdf';
import { DailyEntry, User, Mood } from '../types';

const moodToLabel = (mood: Mood) => {
  switch (mood) {
    case Mood.VERY_BAD: return 'Muito Triste';
    case Mood.BAD: return 'Triste';
    case Mood.NEUTRAL: return 'Neutro';
    case Mood.GOOD: return 'Bem';
    case Mood.EXCELLENT: return 'Muito Bem';
    default: return '';
  }
};

export const generateReportPDF = (user: User, entries: DailyEntry[]) => {
  const doc = new jsPDF();
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Header
  doc.setFontSize(22);
  doc.setTextColor(184, 134, 11); 
  doc.text('Psi.Aurilene - Relatório de Acompanhamento', 105, 20, { align: 'center' });

  // Patient Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Paciente: ${user.fullName}`, 20, 35);
  doc.text(`Data de Nascimento: ${new Date(user.birthDate).toLocaleDateString('pt-BR')}`, 20, 42);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 49);

  doc.setLineWidth(0.5);
  doc.line(20, 52, 190, 52);

  // Entries
  let y = 62;
  sortedEntries.forEach((entry) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Data: ${new Date(entry.date).toLocaleDateString('pt-BR')}`, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Humor: ${moodToLabel(entry.mood)}`, 140, y);

    y += 7;
    const splitNotes = doc.splitTextToSize(`Relato: ${entry.notes}`, 170);
    doc.text(splitNotes, 20, y);
    
    y += (splitNotes.length * 6) + 10;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y - 5, 190, y - 5);
  });

  return doc;
};
