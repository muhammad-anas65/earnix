export const dynamic = 'force-dynamic';

import { FileText, Download, Filter } from 'lucide-react';

export default function AdminPaymentsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments Ledger</h1>
          <p className="text-gray-500 mt-1">Audit log of all financial transactions flowing through Earnix.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition">
              <Filter className="w-4 h-4" /> Filter
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg font-medium transition shadow-lg">
              <Download className="w-4 h-4" /> Export CSV
           </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
              <FileText className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Automated Ledger Integration</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              The real-time transaction ledger is synchronizing with the user backend. All processed payouts and subscription plan purchases will be securely audited here.
            </p>
        </div>
      </div>
    </div>
  );
}
