export default function VehicleCard({ image, name, price, type }) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <p className="text-gray-500 mb-2">{type}</p>
          <p className="text-black font-semibold">₹{price}/day</p>
          <button className="mt-4 w-full bg-yellow-400 py-2 rounded-lg text-black font-bold hover:bg-yellow-500 transition">
            Rent Now
          </button>
        </div>
      </div>
    );
  }
  