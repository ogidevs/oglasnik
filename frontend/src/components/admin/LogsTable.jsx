import React, { useEffect, useState } from 'react';
import { getLogs } from '../../services/adminService'; // your api call
import toast from 'react-hot-toast';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);   // 0-based page index
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (page) => {
    setLoading(true);
    try {
      const { data } = await getLogs({ page, size });
      setLogs(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (error) {
      toast.error('Failed to load logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

return (
    <div className="max-w-full w-full mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Logovi Korisnika</h2>

        {loading ? (
            <div className="text-center py-10">Učitavanje...</div>
        ) : (
            <>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-4 py-2 border-b">Korisničko ime</th>
                                <th className="text-left px-4 py-2 border-b">Akcija</th>
                                <th className="text-left px-4 py-2 border-b">Metod</th>
                                <th className="text-left px-4 py-2 border-b">Vreme</th>
                                <th className="text-left px-4 py-2 border-b">IP Adresa</th>
                                <th className="text-left px-4 py-2 border-b">Korisnički Agent</th>
                                <th className="text-left px-4 py-2 border-b">Detalji</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        Nema pronađenih logova
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, idx) => (
                                    <tr
                                        key={idx}
                                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                    >
                                        <td className="px-4 py-2 border-b">{log.username}</td>
                                        <td className="px-4 py-2 border-b">{log.action}</td>
                                        <td className="px-4 py-2 border-b">{log.method}</td>
                                        <td className="px-4 py-2 border-b">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 border-b">{log.ipAddress}</td>
                                        <td className="px-4 py-2 border-b truncate max-w-xs" title={log.userAgent}>
                                            {log.userAgent}
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            {log.details ? (
                                                <pre className="whitespace-pre-wrap break-words">{log.details}</pre>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Kontrole za paginaciju */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={prevPage}
                        disabled={page === 0}
                        className={`flex items-center space-x-1 px-3 py-1 rounded ${
                            page === 0
                                ? 'bg-gray-200 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        <FaChevronLeft /> <span>Prethodna</span>
                    </button>

                    <div className="text-sm text-gray-700">
                        Strana <strong>{page + 1}</strong> od <strong>{totalPages}</strong>
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={page >= totalPages - 1}
                        className={`flex items-center space-x-1 px-3 py-1 rounded ${
                            page >= totalPages - 1
                                ? 'bg-gray-200 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        <span>Sledeća</span> <FaChevronRight />
                    </button>
                </div>
            </>
        )}
    </div>
);
}
