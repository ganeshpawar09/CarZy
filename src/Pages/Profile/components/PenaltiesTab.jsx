import { useState, useEffect } from "react";
import { Calendar, DollarSign, AlertCircle, RefreshCw, Shield, CreditCard } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function PenaltiesTab() {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPenalty, setSelectedPenalty] = useState(null);

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      
      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_ENDPOINTS.PENALTIES}/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch penalties");
      }
      const data = await response.json();
      setPenalties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReasonLabel = (reason) => {
    const reasonMap = {
      'cancelled_by_owner': 'Cancelled by Owner',
      'late_return': 'Late Return',
      'damage': 'Property Damage',
      'rule_violation': 'Rule Violation',
      'other': 'Other'
    };
    
    return reasonMap[reason] || reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Calculate total penalties
  const totalPenaltyAmount = penalties.reduce((sum, penalty) => sum + penalty.amount, 0);

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      <span className="ml-3 text-gray-600">Loading penalties...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      {penalties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Penalties</p>
                <p className="text-2xl font-bold">₹ {totalPenaltyAmount.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="h-10 w-10 text-red-500 opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Penalty Count</p>
                <p className="text-2xl font-bold">{penalties.length}</p>
              </div>
              <Shield className="h-10 w-10 text-orange-500 opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Last Penalty</p>
                <p className="text-lg font-medium">
                  {penalties.length > 0 
                    ? new Date(Math.max(...penalties.map(p => new Date(p.created_at)))).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {penalties.length === 0 ? (
        <div className="bg-white text-center py-16 rounded-lg shadow">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-medium">No Penalties!</h3>
          <p className="text-gray-500 mt-2">You don't have any penalties on your account.</p>
          <p className="text-gray-400 text-sm mt-1">Keep up the good work!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Penalty History</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {penalties.map((penalty) => (
                  <tr key={penalty.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{penalty.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(penalty.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">#{penalty.booking_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {getReasonLabel(penalty.reason)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">₹ {penalty.amount.toLocaleString('en-IN')}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}