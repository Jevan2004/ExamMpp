"use client"
import Link from "next/link";
import "./page.css"; // Import the CSS file
import { useState, useRef, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const predefinedCandidates = [
  {
    nume: "Ion Popescu",
    descriere: "Vreau să schimb România în bine!",
    partid: "Independent",
    imagine: "dog.jpg"
  },
  {
    nume: "Maria Ionescu",
    descriere: "Educația este prioritatea mea.",
    partid: "AUR",
    imagine: "dog.jpg"
  },
  {
    nume: "Vasile Georgescu",
    descriere: "Sănătatea pentru toți!",
    partid: "PSD",
    imagine: "cabral.jpg"
  },
  {
    nume: "Elena Dumitru",
    descriere: "Susțin tinerii antreprenori.",
    partid: "Independent",
    imagine: "cabral.jpg"
  },
  {
    nume: "Radu Mihai",
    descriere: "Un oraș mai curat pentru toți.",
    partid: "Cainii poporului",
    imagine: "images.jpg"
  },
  {
    nume: "Simona Petrescu",
    descriere: "Transparență și corectitudine.",
    partid: "AUR",
    imagine: "images.jpg"
  },
  {
    nume: "Cristian Stan",
    descriere: "Infrastructură modernă acum!",
    partid: "Progresul Infrastructurii",
    imagine: "cristian.jpg"
  },
  {
    nume: "Ana Pop",
    descriere: "Sprijin pentru familii.",
    partid: "Familia Înainte",
    imagine: "ana.jpg"
  },
  {
    nume: "Mihai Tudor",
    descriere: "Digitalizarea administrației.",
    partid: "Digital România",
    imagine: "mihai.jpg"
  },
  {
    nume: "Gabriela Dobre",
    descriere: "Cultură și tradiție.",
    partid: "Cultura Românească",
    imagine: "gabriela.jpg"
  }
];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nume: "",
    descriere: "",
    partid: "",
    imagine: ""
  });
  const [editId, setEditId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const intervalRef = useRef(null);
  const predefinedIndex = useRef(0);
  const [loading, setLoading] = useState(true);

  // Fetch all candidates on mount
  useEffect(() => {
    fetchCandidates();
    return () => stopGenerating();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    const res = await fetch("/api/candidates");
    const data = await res.json();
    setCandidates(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nume || !form.descriere || !form.partid || !form.imagine) return;
    if (editId !== null) {
      await fetch(`/api/candidates/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ nume: "", descriere: "", partid: "", imagine: "" });
    setShowForm(false);
    fetchCandidates();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sigur vrei să ștergi acest candidat?')) {
      await fetch(`/api/candidates/${id}`, { method: "DELETE" });
      fetchCandidates();
    }
  };

  const handleEdit = (candidate) => {
    setForm({
      nume: candidate.nume,
      descriere: candidate.descriere,
      partid: candidate.partid,
      imagine: candidate.imagine
    });
    setEditId(candidate.id);
    setShowForm(true);
  };

  const startGenerating = () => {
    if (intervalRef.current) return;
    setGenerating(true);
    intervalRef.current = setInterval(async () => {
      await fetch("/api/candidates/generate", { method: "POST" });
      fetchCandidates();
    }, 1000);
  };

  const stopGenerating = () => {
    setGenerating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleGenerateClick = () => {
    if (generating) {
      stopGenerating();
    } else {
      startGenerating();
    }
  };

  // Compute party counts from candidates
  const partyCounts = candidates.reduce((acc, c) => {
    acc[c.partid] = (acc[c.partid] || 0) + 1;
    return acc;
  }, {});
  const chartData = {
    labels: Object.keys(partyCounts),
    datasets: [
      {
        label: 'Număr candidați',
        data: Object.values(partyCounts),
        backgroundColor: '#2563eb',
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Candidați per partid' },
    },
    scales: {
      y: { beginAtZero: true, precision: 0 }
    }
  };

  return (
    <div className="candidates-container">
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: 8 }}>Candidații:</h1>
          <p style={{ color: "#6b7280" }}>Descoperă candidații și alege-ți reprezentantul</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleGenerateClick}
            style={{ padding: '10px 18px', fontSize: 16, background: generating ? '#e11d48' : '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
          >
            {generating ? 'Oprește generarea' : 'Generează mulți candidați'}
          </button>
          <button
            onClick={() => {
              setShowForm(v => !v);
              setEditId(null);
              setForm({ nume: "", descriere: "", partid: "", imagine: "" });
            }}
            style={{ padding: '10px 18px', fontSize: 16, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
          >
            {showForm && editId === null ? 'Renunță' : (editId !== null ? 'Renunță editare' : 'Adaugă candidat')}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 32, background: '#f3f4f6', padding: 24, borderRadius: 12, maxWidth: 600 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <input
              name="nume"
              placeholder="Nume"
              value={form.nume}
              onChange={handleChange}
              style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
              required
            />
            <input
              name="partid"
              placeholder="Partid"
              value={form.partid}
              onChange={handleChange}
              style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <input
              name="imagine"
              placeholder="Imagine (ex: poza.jpg)"
              value={form.imagine}
              onChange={handleChange}
              style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
              required
            />
            <input
              name="descriere"
              placeholder="Descriere"
              value={form.descriere}
              onChange={handleChange}
              style={{ flex: 2, minWidth: 180, padding: 8, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
              required
            />
          </div>
          <button
            type="submit"
            style={{ marginTop: 18, padding: '10px 18px', fontSize: 16, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
          >{editId !== null ? 'Salvează modificările' : 'Adaugă'}</button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', margin: 40 }}>Se încarcă...</div>
      ) : (
        <>
          <div className="candidates-grid">
            {candidates.map((candidate) => (
              <div key={candidate.id} style={{ position: 'relative' }}>
                <Link
                  href={`/candidates/${candidate.id}`}
                  className="candidate-card"
                  style={{ paddingTop: 36 }}
                >
                  <img
                    src={candidate.imagine.startsWith('http') ? candidate.imagine : `/images/${candidate.imagine}`}
                    alt={candidate.nume}
                  />
                  <h2>{candidate.nume}</h2>
                  <p>{candidate.descriere}</p>
                  <span className="partid">{candidate.partid}</span>
                  <span className="arrow">→</span>
                </Link>
                <button
                  onClick={() => handleDelete(candidate.id)}
                  title="Șterge"
                  style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', color: '#e11d48', fontSize: 20, cursor: 'pointer', zIndex: 2 }}
                >🗑️</button>
                <button
                  onClick={() => handleEdit(candidate)}
                  title="Editează"
                  style={{ position: 'absolute', top: 6, right: 36, background: 'none', border: 'none', color: '#2563eb', fontSize: 20, cursor: 'pointer', zIndex: 2 }}
                >✏️</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
}