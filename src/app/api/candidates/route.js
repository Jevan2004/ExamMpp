import { NextResponse } from "next/server";
import { getAllCandidates, addCandidate, getPartyCounts } from "./data";


export async function GET() {
  return NextResponse.json(getAllCandidates());
}

export async function POST(request) {
  const data = await request.json();
  if (!data.nume || !data.descriere || !data.partid || !data.imagine) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const newCandidate = addCandidate(data);
  broadcastPartyCounts(getPartyCounts());
  return NextResponse.json(newCandidate, { status: 201 });
} 