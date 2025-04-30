import { useState, useEffect } from "react";
import { ArrowUpDown, Calendar, DollarSign, AlertCircle, Tag } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function CouponsTab() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      
      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
        const response = await fetch(`${API_ENDPOINTS.COUPONS}/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }
        const data = await response.json();
        setCoupons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (loading) return <div className="text-center py-10">Loading coupons...</div>;
  if (error) return <div className="text-red-500 py-10">Error: {error}</div>;

  // Separate active and used coupons
  const activeCoupons = coupons.filter(coupon => !coupon.used);
  const usedCoupons = coupons.filter(coupon => coupon.used);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Coupons</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Tag className="mr-2 h-5 w-5 text-green-600" />
          Active Coupons
        </h3>
        
        {activeCoupons.length === 0 ? (
          
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No active coupons available.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {activeCoupons.map((coupon) => (
            <div key={coupon.id} className="border rounded-lg overflow-hidden bg-white shadow-sm relative">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm rounded-bl-lg">
                ACTIVE
              </div>
              <div className="p-4">
                <div className="text-center mb-3">
                  <span className="text-3xl font-bold text-green-600">{coupon.discount_percentage}%</span>
                  <p className="text-sm text-gray-500">Discount</p>
                </div>
                    
                {/* Prominent coupon code display */}
                <div className="mt-3 bg-gray-100 p-2 rounded-md text-center">
                  <div className="text-xs text-gray-500 mb-1">Coupon Code</div>
                  <div className="font-mono font-medium select-all">{coupon.id}</div>
                </div>
                    
                {coupon.issued_for_reason && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Reason:</span> {coupon.issued_for_reason}
                  </div>
                )}
                
                <div className="mt-3 text-xs text-gray-500">
                  Issued on {new Date(coupon.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Tag className="mr-2 h-5 w-5 text-gray-400" />
          Used Coupons
        </h3>
        
        {usedCoupons.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No used coupons.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {usedCoupons.map((coupon) => (
            <div key={coupon.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <div className="p-3">
                <div className="text-center">
                  <span className="text-2xl font-medium text-gray-400">{coupon.discount_percentage}%</span>
                  <div className="mt-2 text-gray-400 font-mono text-sm">
                    {coupon.id}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Used • Issued on {new Date(coupon.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}