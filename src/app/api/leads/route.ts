import { NextResponse } from 'next/server';

// Simple in-memory store (for demo purposes)
// In production, replace with Vercel Postgres, Upstash Redis, or your own API
const leads = [
  { id: 1, company_name: 'Baltimore Heating & Cooling', phone: '+1-410-555-0123', address: '123 Main St', city: 'Baltimore', state: 'MD', industry: 'HVAC', website: 'www.baltimorehvac.com', rating: 4.5, review_count: 32, quality_score: 8, status: 'researched', message_sent: 0, responded: 0, created_at: '2026-02-15' },
  { id: 2, company_name: 'Pro Plumbing Services', phone: '+1-410-555-0456', address: '456 Oak Ave', city: 'Baltimore', state: 'MD', industry: 'Plumbing', website: null, rating: 4.2, review_count: 18, quality_score: 7, status: 'researched', message_sent: 0, responded: 0, created_at: '2026-02-15' },
  { id: 3, company_name: 'Elite Roofing Co', phone: '+1-410-555-0789', address: '789 Pine Rd', city: 'Towson', state: 'MD', industry: 'Roofing', website: 'www.eliteroofing.com', rating: 4.8, review_count: 56, quality_score: 9, status: 'drafted', message_sent: 0, responded: 0, created_at: '2026-02-15' },
  { id: 4, company_name: 'Quick Fix HVAC', phone: '+1-410-555-0321', address: '321 Elm St', city: 'Baltimore', state: 'MD', industry: 'HVAC', website: null, rating: 3.9, review_count: 8, quality_score: 5, status: 'new', message_sent: 0, responded: 0, created_at: '2026-02-16' },
  { id: 5, company_name: 'Reliable Drain Cleaners', phone: '+1-410-555-0654', address: '654 Maple Dr', city: 'Baltimore', state: 'MD', industry: 'Plumbing', website: null, rating: 4.0, review_count: 12, quality_score: 6, status: 'new', message_sent: 0, responded: 0, created_at: '2026-02-16' },
  { id: 6, company_name: 'Top Tier Electric', phone: '+1-410-555-0987', address: '987 Cedar Ln', city: 'Lutherville', state: 'MD', industry: 'Electrical', website: 'www.toptierelectric.com', rating: 4.6, review_count: 41, quality_score: 8, status: 'sent', message_sent: 1, responded: 0, created_at: '2026-02-16' },
  { id: 7, company_name: 'Fresh Air Systems', phone: '+1-410-555-0147', address: '147 Birch Way', city: 'Baltimore', state: 'MD', industry: 'HVAC', website: 'www.freshairsystems.com', rating: 3.8, review_count: 6, quality_score: 4, status: 'new', message_sent: 0, responded: 0, created_at: '2026-02-16' },
];

export async function GET() {
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    researched: leads.filter((l) => l.status === 'researched').length,
    drafted: leads.filter((l) => l.status === 'drafted').length,
    sent: leads.filter((l) => l.message_sent === 1).length,
    responded: leads.filter((l) => l.responded === 1).length,
    avgQuality: 0,
  };

  const scoredLeads = leads.filter((l) => l.quality_score !== null);
  if (scoredLeads.length > 0) {
    const sum = scoredLeads.reduce((acc, l) => acc + l.quality_score, 0);
    stats.avgQuality = sum / scoredLeads.length;
  }

  return NextResponse.json({ leads, stats });
}
