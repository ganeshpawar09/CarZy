import { useState, useEffect } from "react";
import { Calendar, DollarSign, Tag, AlertCircle } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const userId = JSON.parse(localStorage.getItem("user"))?.id;
        
        if (!userId) {
          setError("User not found. Please login again.");
          setLoading(false);
          return;
        }
        const response = await fetch(`${API_ENDPOINTS.PAYMENTS}/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }
        const data = await response.json();
        setPayments(data.reverse()); // Reverse the order to show latest payments first
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Calculate the actual discount amount based on percentage
  const calculateDiscountAmount = (payment) => {
    const baseAmount = payment.total_hours * payment.price_per_hour;
    return (baseAmount * payment.coupon_discount) / 100;
  };

  // Calculate the subtotal before discount
  const calculateSubtotal = (payment) => {
    return payment.total_hours * payment.price_per_hour;
  };

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading payments...</span>
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

  const totalPaid = payments.reduce((sum, payment) => 
    payment.status.toLowerCase() === "paid" ? sum + payment.total_amount : sum, 0);

  return (
    <div className="space-y-6">
      {/* Header with summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-2xl font-bold">₹ {totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-500 opacity-80" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
            <Calendar className="h-10 w-10 text-green-500 opacity-80" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Hours Booked</p>
              <p className="text-2xl font-bold">{payments.reduce((sum, p) => sum + p.total_hours, 0)}</p>
            </div>
            <Tag className="h-10 w-10 text-purple-500 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-10 bg-gray-50">
            <p className="text-gray-500">No payment records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => {
                  const subtotal = calculateSubtotal(payment);
                  const discountAmount = calculateDiscountAmount(payment);
                  const formattedDate = new Date(payment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{payment.booking_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formattedDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div className="flex justify-between">
                            <span>Hours:</span>
                            <span className="font-medium">{payment.total_hours} hrs</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rate:</span>
                            <span>₹ {payment.price_per_hour}/hr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          {payment.coupon_discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount ({payment.coupon_discount}%):</span>
                              <span>- ₹ {discountAmount.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Security Deposit:</span>
                            <span>₹ {payment.security_deposit.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">₹ {payment.total_amount.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${payment.status.toLowerCase() === "paid" ? "bg-green-100 text-green-800" : 
                            payment.status.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}