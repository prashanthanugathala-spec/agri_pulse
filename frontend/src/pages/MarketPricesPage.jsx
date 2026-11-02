import React, { useState, useEffect } from 'react';
import { marketPriceService } from '../services/api';
import { mockMarketPrices } from '../services/mockData';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const MarketPricesPage = () => {
  const [prices, setPrices] = useState(mockMarketPrices || []);
  const [selectedCommodity, setSelectedCommodity] = useState(mockMarketPrices?.[0] || null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Revenue Calculator states
  const [calcQuantityQtl, setCalcQuantityQtl] = useState(50);
  const [selectedCalcCommodityId, setSelectedCalcCommodityId] = useState(mockMarketPrices?.[0]?.id || 1);

  const loadPrices = async () => {
    try {
      const res = await marketPriceService.getAllPrices();
      if (res && res.length > 0) {
        setPrices(res);
        setSelectedCommodity((prev) => prev || res[0]);
      }
    } catch {
      // Gracefully retain pre-populated market dataset
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const categories = ['ALL', 'Cereals', 'Cash Crops', 'Vegetables', 'Fruits', 'Spices', 'Oilseeds'];

  const filteredPrices = prices.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesQuery =
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mandi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const calcCommodity = prices.find((p) => p.id === Number(selectedCalcCommodityId)) || prices[0];
  const projectedMandiRevenue = calcCommodity ? calcCommodity.modalPrice * calcQuantityQtl : 0;
  const projectedMspRevenue = calcCommodity && calcCommodity.msp ? calcCommodity.msp * calcQuantityQtl : null;


  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <span className="font-label-caps text-[#6E6E73]">Live APMC & e-NAM Feeds</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight">
            Agricultural Market & Mandi Prices
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Real-time APMC wholesale rates, Minimum Support Price (MSP) benchmarks, and market selling advisories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant="eco" icon="verified">
            AgriPulse APMC Live Sync
          </StatusBadge>
          <Button
            variant="secondary"
            size="md"
            icon="refresh"
            onClick={loadPrices}
          >
            Refresh Rates
          </Button>
        </div>
      </section>

      {/* Top 3 Market Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Highest Gainer Today</span>
          <div className="font-metric-num text-2xl sm:text-3xl text-[#1D1D1F] my-1">
            Red Chilli (Guntur)
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#34C759] font-semibold flex items-center">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> +₹350/Qtl
            </span>
            <span className="text-[#6E6E73]">Current: ₹18,500/Qtl</span>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Estate Crop Benchmark</span>
          <div className="font-metric-num text-2xl sm:text-3xl text-[#1D1D1F] my-1">
            Sona Masoori Rice
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#34C759] font-semibold flex items-center">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> +₹45/Qtl
            </span>
            <span className="text-[#6E6E73]">Modal: ₹2,350 (MSP: ₹2,300)</span>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Market Inflow Volume</span>
          <div className="font-metric-num text-2xl sm:text-3xl text-[#1D1D1F] my-1">
            4,760 <span className="text-sm font-normal text-[#6E6E73]">Tonnes</span>
          </div>
          <StatusBadge variant="optimal">High Trading Liquidity</StatusBadge>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-[24px] p-4 shadow-sm border border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707972] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop or mandi..."
            className="w-full h-9 pl-9 pr-3 rounded-full bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.04] focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Main Grid: Commodity Price Table (8 cols) + Detail & Calculator (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Commodities Table */}
        <div className="lg:col-span-8 bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.04]">
            <div>
              <span className="font-label-caps text-[#6E6E73]">Live Price Quotations</span>
              <h3 className="text-lg font-medium text-[#1D1D1F]">Commodity Market Spot Rates</h3>
            </div>
            <span className="text-xs text-[#6E6E73]">{filteredPrices.length} Commodities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] text-[#707972] font-medium">
                  <th className="pb-3 pl-2">Commodity & Variety</th>
                  <th className="pb-3">Mandi / State</th>
                  <th className="pb-3 text-right">Modal Price</th>
                  <th className="pb-3 text-right">MSP Floor</th>
                  <th className="pb-3 text-right">Change</th>
                  <th className="pb-3 pr-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {filteredPrices.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedCommodity(item)}
                    className={`cursor-pointer transition-colors ${
                      selectedCommodity?.id === item.id ? 'bg-[#E8F3EC]/60' : 'hover:bg-[#F6F3F5]'
                    }`}
                  >
                    <td className="py-3.5 pl-2">
                      <div className="font-semibold text-[#1D1D1F]">{item.commodity}</div>
                      <div className="text-[11px] text-[#6E6E73]">{item.variety}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="text-[#1D1D1F] font-medium">{item.mandi}</div>
                      <div className="text-[11px] text-[#707972]">{item.state}</div>
                    </td>
                    <td className="py-3.5 text-right font-semibold text-[#1D1D1F] text-sm">
                      ₹{item.modalPrice.toLocaleString()}
                      <span className="block text-[10px] font-normal text-[#707972]">Range: ₹{item.minPrice} - ₹{item.maxPrice}</span>
                    </td>
                    <td className="py-3.5 text-right">
                      {item.msp ? (
                        <span className="font-medium text-[#1D1D1F]">₹{item.msp.toLocaleString()}</span>
                      ) : (
                        <span className="text-[#707972] text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right font-medium">
                      {item.change > 0 ? (
                        <span className="text-[#34C759] flex items-center justify-end">
                          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                          +₹{item.change}
                        </span>
                      ) : item.change < 0 ? (
                        <span className="text-[#BA1A1A] flex items-center justify-end">
                          <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                          ₹{item.change}
                        </span>
                      ) : (
                        <span className="text-[#707972]">₹0</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCommodity(item);
                          setSelectedCalcCommodityId(item.id);
                        }}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/5 hover:bg-[#125238] hover:text-white transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Commodity Advisory & Revenue Calculator */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Selected Commodity Detail Card */}
          {selectedCommodity && (
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-black/[0.04]">
                <div>
                  <span className="font-label-caps text-[#6E6E73]">{selectedCommodity.category}</span>
                  <h3 className="text-xl font-medium text-[#1D1D1F] mt-0.5">{selectedCommodity.commodity}</h3>
                  <div className="text-xs text-[#6E6E73]">{selectedCommodity.variety}</div>
                </div>
                <StatusBadge variant={selectedCommodity.trend === 'UP' ? 'optimal' : selectedCommodity.trend === 'DOWN' ? 'critical' : 'neutral'}>
                  {selectedCommodity.trend === 'UP' ? 'Price Bullish' : selectedCommodity.trend === 'DOWN' ? 'Price Bearish' : 'Stable'}
                </StatusBadge>
              </div>

              {/* Price Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#F6F3F5]">
                  <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Modal Market Price</div>
                  <div className="text-lg font-bold text-[#1D1D1F] mt-0.5">₹{selectedCommodity.modalPrice.toLocaleString()}</div>
                  <div className="text-[10px] text-[#707972]">per Quintal (100 kg)</div>
                </div>

                <div className="p-3 rounded-xl bg-[#F6F3F5]">
                  <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Government MSP</div>
                  <div className="text-lg font-bold text-[#1D1D1F] mt-0.5">
                    {selectedCommodity.msp ? `₹${selectedCommodity.msp.toLocaleString()}` : 'Free Market'}
                  </div>
                  <div className="text-[10px] text-[#707972]">{selectedCommodity.msp ? 'Official Benchmark' : 'No MSP'}</div>
                </div>
              </div>

              {/* Mandi & Arrivals */}
              <div className="p-3 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] space-y-1 mb-4">
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Primary Mandi:</span>
                  <span className="font-medium">{selectedCommodity.mandi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Daily Inflow:</span>
                  <span className="font-medium">{selectedCommodity.arrivalsTons} Tonnes</span>
                </div>
              </div>

              {/* AI Market Advisory */}
              <div className="p-4 rounded-2xl bg-[#E8F3EC]/70 border border-[#2F6B4F]/20">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#125238] mb-1">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  Agronomic Market Advisory
                </div>
                <p className="text-xs text-[#1D1D1F] leading-relaxed">
                  {selectedCommodity.advisory}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Harvest Revenue Calculator */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
            <div className="pb-3 mb-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#125238] text-[20px]">calculate</span>
                <h3 className="text-base font-semibold text-[#1D1D1F]">Harvest Revenue Calculator</h3>
              </div>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Calculate estimated farm-gate revenue based on current Mandi prices.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1D1D1F] mb-1">Select Crop</label>
                <select
                  value={selectedCalcCommodityId}
                  onChange={(e) => setSelectedCalcCommodityId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none"
                >
                  {prices.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.commodity} (₹{p.modalPrice}/Qtl)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-medium text-[#1D1D1F]">Harvest Volume (Quintals)</label>
                  <span className="text-[#2F6B4F] font-semibold">{calcQuantityQtl} Qtl ({calcQuantityQtl * 100} kg)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={calcQuantityQtl}
                  onChange={(e) => setCalcQuantityQtl(Number(e.target.value))}
                  className="w-full accent-[#2F6B4F] cursor-pointer"
                />
              </div>

              {/* Calculated Outputs */}
              <div className="p-4 rounded-2xl bg-[#F6F3F5] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6E6E73]">Current Mandi Realization:</span>
                  <span className="text-base font-bold text-[#1D1D1F]">₹{projectedMandiRevenue.toLocaleString()}</span>
                </div>
                {projectedMspRevenue && (
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-black/[0.04]">
                    <span className="text-[#6E6E73]">MSP Minimum Assurance:</span>
                    <span className="text-sm font-semibold text-[#707972]">₹{projectedMspRevenue.toLocaleString()}</span>
                  </div>
                )}
                {projectedMspRevenue && projectedMandiRevenue > projectedMspRevenue && (
                  <div className="text-[11px] text-[#34C759] font-medium">
                    +₹{(projectedMandiRevenue - projectedMspRevenue).toLocaleString()} premium over Government MSP!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPricesPage;
