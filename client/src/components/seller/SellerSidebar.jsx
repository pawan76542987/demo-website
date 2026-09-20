import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  Package,
  Boxes,
  Store,
  Settings,
  HelpCircle
} from 'lucide-react';

export const SellerSidebar = () => {
  const navItems = [
    { to: '/seller', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/seller/products', label: 'My Products', icon: Layers },
    { to: '/seller/products/new', label: 'Add Product', icon: PlusCircle },
    { to: '/seller/orders', label: 'Customer Orders', icon: Package },
    { to: '/seller/inventory', label: 'Inventory Stock', icon: Boxes },
    { to: '/seller/store', label: 'Store Profile', icon: Store },
    { to: '/seller/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Merchant Management
          </p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Seller Tips Widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 text-xs">
        <div className="flex items-center gap-1.5 text-brand-700 font-bold mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Seller Pro-Tip</span>
        </div>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          Keep stock levels updated to avoid order cancellations and maintain a 4.8+ merchant trust badge.
        </p>
      </div>
    </aside>
  );
};
