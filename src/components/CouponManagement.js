// components/CouponManagement.js
import React, { useState, useEffect } from "react";
import { couponsAPI } from "../services/apiService";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage", // percentage or fixed
    discountValue: 10,
    minAmount: 0,
    maxDiscount: 1000,
    validFrom: "",
    validUntil: "",
    usageLimit: 100,
    usageCount: 0,
    isActive: true,
    applicableTo: "all", // all, cars, bikes, specific_vehicle, city, subscription
    applicableVehicleType: "", // car, bike, or empty
    applicableCity: "", // specific city or empty
    applicableVehicleId: "", // specific vehicle id or empty
    applicableSubscription: false, // for subscription only
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponsAPI.getAllCoupons();
      // Assuming response has data array
      setCoupons(response.data || response);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await couponsAPI.updateCoupon(editingCoupon.id, formData);
      } else {
        await couponsAPI.createCoupon(formData);
      }
      
      await fetchCoupons();
      resetForm();
    } catch (err) {
      console.error("Error saving coupon:", err);
      setError("Failed to save coupon");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minAmount: 0,
      maxDiscount: 1000,
      validFrom: "",
      validUntil: "",
      usageLimit: 100,
      usageCount: 0,
      isActive: true,
      applicableTo: "all",
      applicableVehicleType: "",
      applicableCity: "",
      applicableVehicleId: "",
      applicableSubscription: false,
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleEdit = (coupon) => {
    setFormData(coupon);
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleDelete = async (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await couponsAPI.deleteCoupon(couponId);
        await fetchCoupons();
      } catch (err) {
        console.error("Error deleting coupon:", err);
        setError("Failed to delete coupon");
      }
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      await couponsAPI.updateCoupon(coupon.id, { 
        ...coupon, 
        isActive: !coupon.isActive 
      });
      await fetchCoupons();
    } catch (err) {
      console.error("Error updating coupon:", err);
      setError("Failed to update coupon status");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-4"></div>
        <p className="text-slate-600 text-sm">Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Coupon Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          + Create New Coupon
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-300 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Coupon Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>
            <button
              onClick={resetForm}
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  required
                  placeholder="HELLO2025"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  placeholder="First booking discount"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  required
                  min="0"
                />
              </div>

              {/* Min Amount */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Minimum Amount (₹)
                </label>
                <input
                  type="number"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  min="0"
                />
              </div>

              {/* Max Discount */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Maximum Discount (₹)
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  min="0"
                />
              </div>

              {/* Valid From */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Valid From
                </label>
                <input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                />
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Valid Until
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                />
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  min="0"
                />
              </div>

              {/* Applicable To */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Applicable To
                </label>
                <select
                  name="applicableTo"
                  value={formData.applicableTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                >
                  <option value="all">All Vehicles</option>
                  <option value="cars">All Cars</option>
                  <option value="bikes">All Bikes</option>
                  <option value="specific_vehicle">Specific Vehicle</option>
                  <option value="city">Specific City</option>
                  <option value="subscription">Subscription Only</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {formData.applicableTo === 'cars' || formData.applicableTo === 'bikes' ? (
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    name="applicableVehicleType"
                    value={formData.applicableVehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    placeholder={formData.applicableTo === 'cars' ? 'car' : 'bike'}
                    readOnly
                  />
                </div>
              ) : formData.applicableTo === 'city' ? (
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    City Name
                  </label>
                  <input
                    type="text"
                    name="applicableCity"
                    value={formData.applicableCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    placeholder="e.g., Bangalore"
                  />
                </div>
              ) : formData.applicableTo === 'specific_vehicle' ? (
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Vehicle ID
                  </label>
                  <input
                    type="text"
                    name="applicableVehicleId"
                    value={formData.applicableVehicleId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    placeholder="Vehicle ID"
                  />
                </div>
              ) : null}

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-gold-500 focus:ring-gold-500 rounded border-blue-300"
                />
                <label className="ml-2 text-slate-700 text-sm font-medium">
                  Active
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-slate-900 rounded-lg font-semibold transition-colors text-sm"
              >
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Coupon
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Applicable To
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {coupon.code}
                      </div>
                      <div className="text-xs text-slate-600">
                        {coupon.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`
                      }
                    </div>
                    {coupon.minAmount > 0 && (
                      <div className="text-xs text-slate-500">
                        Min: ₹{coupon.minAmount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800">
                      {coupon.applicableTo === 'all' && 'All Vehicles'}
                      {coupon.applicableTo === 'cars' && 'All Cars'}
                      {coupon.applicableTo === 'bikes' && 'All Bikes'}
                      {coupon.applicableTo === 'city' && `${coupon.applicableCity}`}
                      {coupon.applicableTo === 'specific_vehicle' && 'Specific Vehicle'}
                      {coupon.applicableTo === 'subscription' && 'Subscription Only'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800">
                      {coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : 'No start'}
                    </div>
                    <div className="text-xs text-slate-500">
                      to {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'No end'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800">
                      {coupon.usageCount || 0} / {coupon.usageLimit || '∞'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleCouponStatus(coupon)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-slate-400">🎫</div>
            <p className="text-slate-600 text-sm mb-2">No coupons created yet</p>
            <p className="text-slate-500 text-xs">Create your first coupon to start offering discounts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;