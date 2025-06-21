import { NextResponse } from "next/server";
import { getCandidateById, updateCandidate, deleteCandidate, addCandidate } from "../data";

export async function GET(_, { params }) {
  const candidate = getCandidateById(params.id);
  if (!candidate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(candidate);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const updated = updateCandidate(params.id, data);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_, { params }) {
  const ok = deleteCandidate(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function POST(request) {
  const data = await request.json();
  if (!data.nume || !data.descriere || !data.partid || !data.imagine) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const newCandidate = addCandidate(data);
  return NextResponse.json(newCandidate, { status: 201 });
} 