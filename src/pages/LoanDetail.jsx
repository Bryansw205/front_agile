import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiFileUrl, apiPatch } from '../lib/api.js';
import { formatDate } from '../lib/date.js';

export default function LoanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await apiGet(`/loans/${id}`);
      setLoan(data);
    } catch (e) {
      setError('No se pudo cargar el prÃ©stamo');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const togglePaid = async (row, paid) => {
    try {
      setSavingId(row.id);
      await apiPatch(`/loans/${loan.id}/schedules/${row.id}`, { paid, paidAt: paid ? new Date().toISOString() : null });
      await load();
    } catch (e) {
      alert('No se pudo actualizar la cuota');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="badge badge-red">{error}</div>;
  if (!loan) return null;

  const labelInstallmentStatus = (s) => ({
    PAGADO: 'Pagada',
    ATRASADO: 'Atrasada',
    PENDIENTE: 'Pendiente',
    ACTIVO: 'Activa',
  })[s] || s;

  return (
    <div className="section">
      <div className="card mb-4">
        <div className="mb-3">
          <button className="btn" onClick={() => navigate(-1)}>Volver</button>
        </div>
        <h4 style={{marginTop:0}}>Préstamo #{loan.id}</h4>
        <div className="mb-2">
          Cliente: {loan.client.firstName} {loan.client.lastName} (DNI {loan.client.dni})
        </div>
        <div className="mb-2">Creado por: {loan.createdBy?.username || '-'}</div>
        <div className="mb-2">Total a pagar: S/ {(() => { try { return (loan.schedules||[]).reduce((a,r)=> a + Number(r.installmentAmount||0), 0).toFixed(2); } catch { return '0.00'; } })()}</div>
        <div className="mb-2">
          Monto: S/ {Number(loan.principal).toFixed(2)} | Tasa anual: {(Number(loan.interestRate) * 100).toFixed(2)}% | Plazo: {loan.termCount} {loan.termCount === 1 ? 'mes' : 'meses'}</div>
        <a className="btn" href={apiFileUrl(`/loans/${loan.id}/schedule.pdf?token=${encodeURIComponent(localStorage.getItem('token') || '')}`)} target="_blank" rel="noreferrer">Descargar PDF</a>
      </div>

      <div className="card table-flush">
      <table className="table">
        <thead>
          <tr>
            <th>Cuota</th>
            <th>Fecha</th>
            <th>Cuota (S/)</th>
            <th>Interés</th>
            <th>Capital</th>
            <th>Saldo</th>
            <th>Fecha de Pago</th>
            <th>Estado</th>
            <th>Días Mora</th>
            <th>Pagada</th>
          </tr>
        </thead>
        <tbody>
          {loan.schedules.map(row => (
            <tr key={row.id}>
              <td>{row.installmentNumber}</td>
              <td>{formatDate(row.dueDate)}</td>
              <td>{Number(row.installmentAmount).toFixed(2)}</td>
              <td>{Number(row.interestAmount).toFixed(2)}</td>
              <td>{Number(row.principalAmount).toFixed(2)}</td>
              <td>{Number(row.remainingBalance).toFixed(2)}</td>
              <td>{row.paidAt ? formatDate(row.paidAt) : '-'}</td>
              <td>
                {(() => {
                  const st = row.computedStatus || row.status;
                  const cls = {
                    'PAGADO': 'status-badge status-ok',
                    'ATRASADO': 'status-badge status-over',
                    'PENDIENTE': 'status-badge status-pending',
                    'ACTIVO': 'status-badge status-active'
                  }[st] || 'status-badge';
                  return <span className={cls}>{labelInstallmentStatus(st)}</span>;
                })()}
              </td>
              <td style={{ color: (row.daysOverdue > 0 ? 'red' : undefined) }}>{row.daysOverdue || 0}</td>
              <td>
                <input type="checkbox" checked={row.status === 'PAGADO'} disabled={savingId === row.id}
                  onChange={(e) => togglePaid(row, e.target.checked)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}






