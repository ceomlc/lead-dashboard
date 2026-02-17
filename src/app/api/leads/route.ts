import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('/Users/jaivienkendrick/.openclaw/data/leads.db');

export async function GET() {
  try {
    // Get all leads ordered by date
    const leads = db.prepare(`
      SELECT id, company_name, phone, address, city, state, industry, 
             website, rating, review_count, quality_score, status, 
             message_sent, responded, created_at
      FROM leads 
      ORDER BY created_at DESC
    `).all();

    // Calculate stats
    const stats = {
      total: leads.length,
      new: leads.filter((l: any) => l.status === 'new').length,
      researched: leads.filter((l: any) => l.status === 'researched').length,
      drafted: leads.filter((l: any) => l.status === 'drafted').length,
      sent: leads.filter((l: any) => l.message_sent === 1).length,
      responded: leads.filter((l: any) => l.responded === 1).length,
      avgQuality: 0,
    };

    // Calculate average quality score
    const scoredLeads = leads.filter((l: any) => l.quality_score !== null);
    if (scoredLeads.length > 0) {
      const sum = scoredLeads.reduce((acc: number, l: any) => acc + l.quality_score, 0);
      stats.avgQuality = sum / scoredLeads.length;
    }

    return NextResponse.json({ leads, stats });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
