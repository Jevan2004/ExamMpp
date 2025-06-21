let candidates = [
  {
    id: 1,
    nume: "Nicușor Dan",
    descriere: "Sunt matematician",
    partid: "Independent",
    imagine: "nicusor.jpeg",
  },
  {
    id: 2,
    nume: "George Simion",
    descriere: "Sparg calorifere",
    partid: "AUR",
    imagine: "images.jpeg",
  },
  {
    id: 3,
    nume: "Cabral",
    descriere: "Romania o va duce bine cu mine",
    partid: "Independent",
    imagine: "cabral.jpg",
  },
  {
    id: 4,
    nume: "Dog",
    descriere: "We are cooked",
    partid: "Cainii poporului",
    imagine: "dog.jpg",
  },
];

export function getAllCandidates() {
  return candidates;
}

export function getCandidateById(id) {
  return candidates.find((c) => c.id === Number(id));
}

export function addCandidate(candidate) {
  const newId = candidates.length ? Math.max(...candidates.map(c => c.id)) + 1 : 1;
  const newCandidate = { ...candidate, id: newId };
  candidates = [newCandidate, ...candidates];
  return newCandidate;
}

export function updateCandidate(id, updated) {
  candidates = candidates.map((c) => c.id === Number(id) ? { ...c, ...updated, id: Number(id) } : c);
  return getCandidateById(id);
}

export function deleteCandidate(id) {
  const before = candidates.length;
  candidates = candidates.filter((c) => c.id !== Number(id));
  return candidates.length < before;
}

export function getPartyCounts() {
  return candidates.reduce((acc, c) => {
    acc[c.partid] = (acc[c.partid] || 0) + 1;
    return acc;
  }, {});
} 