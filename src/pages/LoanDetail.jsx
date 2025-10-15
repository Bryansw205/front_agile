import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiFileUrl } from '../lib/api.js';
import { formatDate } from '../lib/date.js';

export default function LoanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet(`/loans/${id}`);
      setLoan(data);
    } catch (e) {
      setError('No se pudo cargar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="badge badge-red">{error}</div>;
  if (!loan) return null;

  const totalAPagar = (() => {
    try {
      return (loan.schedules || [])
        .reduce((a, r) => a + Number(r.installmentAmount || 0), 0)
        .toFixed(2);
    } catch {
      return '0.00';
    }
  })();

  return (
    <div className="section">
      <div className="card mb-4">
        <div className="mb-3">
          <button className="btn" onClick={() => navigate(-1)}>Volver</button>
        </div>
        <h4 style={{ marginTop: 0 }}>Préstamo #{loan.id}</h4>
        <div className="mb-2">
          Cliente: {loan.client.firstName} {loan.client.lastName} (DNI {loan.client.dni})
        </div>
        <div className="mb-2">Creado por: {loan.createdBy?.username || '-'}</div>
        <div className="mb-2">Total a pagar: S/ {totalAPagar}</div>
        <div className="mb-2">
          Monto: S/ {Number(loan.principal).toFixed(2)} | Tasa anual: {(Number(loan.interestRate) * 100).toFixed(2)}% | Plazo: {loan.termCount} {loan.termCount === 1 ? 'mes' : 'meses'}
        </div>
        <a
          className="btn"
          href={apiFileUrl(`/loans/${loan.id}/schedule.pdf?token=${encodeURIComponent(localStorage.getItem('token') || '')}`)}
          target="_blank"
          rel="noreferrer"
        >
          Descargar PDF
        </a>
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
            </tr>
          </thead>
          <tbody>
            {loan.schedules.map((row) => (
              <tr key={row.id}>
                <td>{row.installmentNumber}</td>
                <td>{formatDate(row.dueDate)}</td>
                <td>{Number(row.installmentAmount).toFixed(2)}</td>
                <td>{Number(row.interestAmount).toFixed(2)}</td>
                <td>{Number(row.principalAmount).toFixed(2)}</td>
                <td>{Number(row.remainingBalance).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

