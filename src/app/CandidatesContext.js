"use client";
import { createContext, useContext, useState } from "react";
import { candidates as initialCandidates } from "./candidatesData";

const CandidatesContext = createContext();

export function CandidatesProvider({ children }) {
  const [candidates, setCandidates] = useState(initialCandidates);

  const addCandidate = (candidate) => {
    setCandidates(prev => [
      { ...candidate, id: prev.length ? Math.max(...prev.map(c => c.id)) + 1 : 1 },
      ...prev
    ]);
  };

  const updateCandidate = (id, updated) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCandidate = (id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CandidatesContext.Provider value={{ candidates, addCandidate, updateCandidate, deleteCandidate }}>
      {children}
    </CandidatesContext.Provider>
  );
}

export function useCandidates() {
  return useContext(CandidatesContext);
} 