import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// PDF exports
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Icons
import { Pencil, Trash2 } from 'lucide-react';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('');

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5001/api/feedback');
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const normalize = (s) => (s || '').toString().toLowerCase();

  const filtered = useMemo(() => {
    return feedbacks.filter(fb => {
      const q = normalize(search);
      const matches =
        !q ||
        normalize(fb.email).includes(q) ||
        normalize(fb.name).includes(q) ||
        normalize(fb.comments).includes(q);
      const ratingOk = !minRating || Number(fb.serviceRating) >= Number(minRating);
      return matches && ratingOk;
    });
  }, [feedbacks, search, minRating]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const dist = {1:0,2:0,3:0,4:0,5:0};
    let sum = 0;
    filtered.forEach(f => { dist[f.serviceRating]++; sum += f.serviceRating; });
    return {
      total,
      avg: total ? (sum/total).toFixed(2) : 0,
      dist
    };
  }, [filtered]);

  const exportCSV = () => {
    if (!filtered.length) { toast('No feedbacks to export'); return; }
    const header = ['Email','Name','Rating','Comments','Created At'];
    const rows = filtered.map(f => [
      f.email, f.name || 'Anonymous', f.serviceRating, (f.comments || '').replace(/\s+/g, ' ').trim(),
      f.createdAt ? new Date(f.createdAt).toLocaleString() : ''
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback-report-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!filtered.length) { toast('No feedbacks to export'); return; }

    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const now = new Date();

    doc.setFontSize(16);
    doc.text('Feedback Report', 40, 40);
    doc.setFontSize(10);
    doc.text(`Generated: ${now.toLocaleString()}`, 40, 58);

    const summary = [
      `Total: ${stats.total}`,
      `Average Rating: ${stats.avg}`,
      `5★: ${stats.dist[5]} | 4★: ${stats.dist[4]} | 3★: ${stats.dist[3]} | 2★: ${stats.dist[2]} | 1★: ${stats.dist[1]}`,
    ].join('   •   ');
    doc.setFontSize(11);
    doc.text(summary, 40, 80);

    const head = [['Email', 'Name', 'Rating', 'Comments', 'Created At']];
    const body = filtered.map(f => [
      f.email || '',
      f.name || 'Anonymous',
      String(f.serviceRating ?? ''),
      (f.comments || '').replace(/\s+/g, ' ').trim(),
      f.createdAt ? new Date(f.createdAt).toLocaleString() : ''
    ]);

    autoTable(doc, {
      startY: 100,
      head,
      body,
      styles: { fontSize: 10, cellPadding: 6, overflow: 'linebreak' },
      headStyles: { fillColor: [191, 219, 254], textColor: [30, 64, 175] },
      columnStyles: {
        0: { cellWidth: 160 },
        1: { cellWidth: 120 },
        2: { cellWidth: 60 },
        3: { cellWidth: 220 },
        4: { cellWidth: 140 },
      },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.setFontSize(9);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageSize.width - 80, pageHeight - 20);
      },
    });

    doc.save(`feedback-report-${now.toISOString().slice(0,10)}.pdf`);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this feedback? This cannot be undone.');
    if (!ok) return;
    try {
      await axios.delete(`http://localhost:5001/api/feedback/${id}`);
      setFeedbacks(prev => prev.filter(f => f._id !== id));
      toast.success('Feedback deleted');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete');
    }
  };

  const startEdit = (fb) => {
    setEditing({
      _id: fb._id,
      email: fb.email || '',
      name: fb.name || '',
      serviceRating: Number(fb.serviceRating) || 1,
      comments: fb.comments || '',
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editing?._id) return;
    const { _id, email, name, serviceRating, comments } = editing;
    const ratingNum = Number(serviceRating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }

    try {
      setSaving(true);
      const res = await axios.put(`http://localhost:5001/api/feedback/${_id}`, {
        email,
        name,
        serviceRating: ratingNum,
        comments,
      });
      const updated = res.data?.feedback || null;

      if (updated) {
        setFeedbacks(prev => prev.map(f => (f._id === _id ? { ...f, ...updated } : f)));
      } else {
        await fetchFeedbacks();
      }

      toast.success('Feedback updated');
      setEditOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-feedback-container min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A] p-6">
      <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">
        Feedback Management
      </h2>

      <div className="filters flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by email, name or comments"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] shadow-sm"
        />
        <select
          value={minRating}
          onChange={e => setMinRating(e.target.value)}
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] shadow-sm"
        >
          <option value="">All ratings</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5 only</option>
        </select>
        <button
          onClick={fetchFeedbacks}
          className="rounded-lg bg-[#3B82F6] hover:bg-[#1D4ED8] text-white px-4 py-2 text-sm font-semibold shadow"
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
        <button
          onClick={exportCSV}
          className="rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-4 py-2 text-sm font-semibold shadow"
        >
          Export CSV
        </button>
        <button
          onClick={exportPDF}
          className="rounded-lg bg-[#0F172A] hover:bg-[#111827] text-white px-4 py-2 text-sm font-semibold shadow"
        >
          Export PDF
        </button>
      </div>

      <div className="stats-bar flex flex-wrap gap-6 mb-6 text-sm text-[#1E3A8A]">
        <span>
          Total: <b className="text-[#1E40AF]">{stats.total}</b>
        </span>
        <span>
          Average Rating: <b className="text-[#1E40AF]">{stats.avg}</b>
        </span>
        <span className="text-[#1E3A8A]">
          5★: <span className="text-[#22C55E]">{stats.dist[5]}</span> | 4★: <span className="text-[#22C55E]">{stats.dist[4]}</span> | 3★: <span className="text-[#FACC15]">{stats.dist[3]}</span> | 2★: <span className="text-[#F59E0B]">{stats.dist[2]}</span> | 1★: <span className="text-[#EF4444]">{stats.dist[1]}</span>
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#BFDBFE] bg-[#DBEAFE] shadow-sm">
        <table className="feedback-table w-full text-sm text-left">
          <thead className="bg-[#BFDBFE] text-[#1E40AF]">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2">Comments</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr
                key={f._id}
                className="border-b border-[#BFDBFE] hover:bg-[#EFF6FF]"
              >
                <td className="px-4 py-2 text-[#1E3A8A]">{f.email}</td>
                <td className="px-4 py-2 text-[#1E3A8A]">{f.name || 'Anonymous'}</td>
                <td className="px-4 py-2 text-[#1E40AF] font-semibold">{f.serviceRating}</td>
                <td className="px-4 py-2 text-[#1E3A8A]">{f.comments}</td>
                <td className="px-4 py-2 text-[#1E3A8A]">
                  {new Date(f.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    {/* <button
                      onClick={() => startEdit(f)}
                      className="inline-flex items-center gap-1 rounded-md bg-[#10B981] hover:bg-[#059669] text-white px-3 py-1"
                      aria-label="Edit feedback"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button> */}
                    <button
                      onClick={() => handleDelete(f._id)}
                      className="inline-flex items-center gap-1 rounded-md bg-[#EF4444] hover:bg-[#DC2626] text-white px-3 py-1"
                      aria-label="Delete feedback"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td
                  colSpan="6"
                  className="no-feedback px-4 py-6 text-center text-[#1E3A8A]"
                >
                  No feedbacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editOpen && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-lg rounded-xl bg-white text-[#1E3A8A] shadow-xl border border-[#BFDBFE]">
            <div className="px-5 py-4 border-b border-[#BFDBFE] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1E40AF]">Edit Feedback</h3>
              <button
                onClick={() => { setEditOpen(false); setEditing(null); }}
                className="text-[#1E3A8A] hover:text-[#1E40AF]"
              >
                ✕
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  value={editing.email}
                  onChange={e => setEditing(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  value={editing.name}
                  onChange={e => setEditing(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Rating (1–5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editing.serviceRating}
                  onChange={e => setEditing(prev => ({ ...prev, serviceRating: e.target.value }))}
                  className="w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Comments</label>
                <textarea
                  rows={4}
                  value={editing.comments}
                  onChange={e => setEditing(prev => ({ ...prev, comments: e.target.value }))}
                  className="w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#BFDBFE] flex items-center justify-end gap-2">
              <button
                onClick={() => { setEditOpen(false); setEditing(null); }}
                className="rounded-lg px-4 py-2 text-sm bg-[#E5E7EB] hover:bg-[#CBD5E1] text-[#1E3A8A]"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="rounded-lg px-4 py-2 text-sm bg-[#3B82F6] hover:bg-[#1D4ED8] text-white"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;
