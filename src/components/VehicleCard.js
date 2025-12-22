// components/VehicleCard.js
export default function VehicleCard({ image, name, price, type }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 border border-blue-200">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{name}</h3>
        <p className="text-slate-600 mb-2 text-sm">{type}</p>
        <p className="text-gold-500 font-semibold text-sm">{price}/day</p>
        <button className="mt-4 w-full bg-gold-500 hover:bg-gold-600 py-3 rounded-lg text-slate-900 font-semibold transition-colors text-sm">
          Rent Now
        </button>
      </div>
    </div>
  );
}