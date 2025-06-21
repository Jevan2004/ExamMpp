import { NextResponse } from "next/server";
import { addCandidate } from "../data";
import { predefinedCandidates } from "../predefined";

let predefinedIndex = 0;

export async function POST() {
  const candidate = predefinedCandidates[predefinedIndex];
  predefinedIndex = (predefinedIndex + 1) % predefinedCandidates.length;
  const newCandidate = addCandidate(candidate);
  return NextResponse.json(newCandidate, { status: 201 });
} 