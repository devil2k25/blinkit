import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    deliveryFee: 20,
    minOrderAmount: 99,
    maxDeliveryRadius: 5,
    estimatedDeliveryTime: 10,
    maintenanceMode: false,
    allowNewRegistrations: true,
  });

  const save = () => toast.success('Settings saved!');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">Configure app-wide settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 border-b pb-3">Delivery Settings</h3>
          {[
            { key: 'deliveryFee', label: 'Delivery Fee (₹)', type: 'number' },
            { key: 'minOrderAmount', label: 'Minimum Order Amount (₹)', type: 'number' },
            { key: 'maxDeliveryRadius', label: 'Max Delivery Radius (km)', type: 'number' },
            { key: 'estimatedDeliveryTime', label: 'Estimated Delivery Time (mins)', type: 'number' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={settings[key]} onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 border-b pb-3">App Settings</h3>
          {[
            { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable the app for users' },
            { key: 'allowNewRegistrations', label: 'Allow Registrations', desc: 'Allow new user signups' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <button onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
                className={`w-12 h-6 rounded-full transition-colors ${settings[key] ? 'bg-green-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow mx-1 transition-transform ${settings[key] ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium">
        Save Settings
      </button>
    </div>
  );
}
