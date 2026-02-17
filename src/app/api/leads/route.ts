import { NextResponse } from 'next/server';

const VPS_API = process.env.VPS_API_URL || 'http://72.60.172.54:3000';

export async function GET() {
  try {
    const res = await fetch(`${VPS_API}/api/leads?limit=100`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('VPS API error:', error);
    return NextResponse.json({ 
      leads: [], 
      stats: { total: 0, new: 0, researched: 0, drafted: 0, sent: 0, responded: 0, avgQuality: 0 },
      error: 'Failed to connect to VPS' 
    }, { status: 500 });
  }
}
