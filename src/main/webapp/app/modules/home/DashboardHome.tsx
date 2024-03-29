import { useAppDispatch, useAppSelector } from 'app/config/store';
import AdminCards from 'app/shared/components/cards/AdminCards';
import BarChart, { generateRandomColors } from 'app/shared/components/charts/BarChart';
// import { Data } from 'app/shared/components/charts/Test';
import React, { useEffect, useState } from 'react';
// import { fetchStatsData, getCountStats, getZonesPerCity } from './home.reducer';
import { fetchStatsData } from './home.reducer';
import LoadingSpinner from 'app/shared/components/LoadingSpinner';
import LineChart from 'app/shared/components/charts/LineChart';

const DashboardHome = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.dashboard.loading);
  const countStats = useAppSelector(state => state.dashboard.countStats);
  const zonesPerCity = useAppSelector(state => state.dashboard.zonesPerCity);
  const pharmaciesPerVille = useAppSelector(state => state.dashboard.pharmacyPerCity);
  const pharmaciesPerZone = useAppSelector(state => state.dashboard.pharmacyPerZone);

  const [zonesPerCityChart, setZonesPerCityChart] = useState({});

  const [PharmaciesPerVilleChart, setPharmaciesPerVilleChart] = useState({});
  const [PharmaciesPerZoneChart, setPharmaciesPerZoneChart] = useState({});

  // const [pwsPerGroupChart, setPwsPerGroupChart] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchStatsData());
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    if (zonesPerCity && zonesPerCity.length > 0 && pharmaciesPerVille && pharmaciesPerVille.length > 0 && !loading) {
      const names = zonesPerCity.map(item => item.name);
      const counts = zonesPerCity.map(item => item.count);
      const ville = pharmaciesPerVille.map(item => item.name);
      const counties = pharmaciesPerVille.map(item => item.count);
      const zone = pharmaciesPerZone.map(item => item.name);
      const counters = pharmaciesPerZone.map(item => item.count);

      // const pwsCounts = pwsPerGroup.map(item => item.count);
      setZonesPerCityChart({
        labels: names,
        datasets: [
          {
            label: 'Zones',
            data: counts,
            backgroundColor: generateRandomColors(counts.length),
            borderColor: 'black',
            borderWidth: 1,
          },
        ],
      });
      setPharmaciesPerZoneChart({
        labels: zone,
        datasets: [
          {
            label: 'Zones',
            data: counters,
            backgroundColor: generateRandomColors(counters.length),
            borderColor: 'black',
            borderWidth: 1,
          },
        ],
      });

      setPharmaciesPerVilleChart({
        labels: ville,
        datasets: [
          {
            label: 'pharmacies',
            data: counties,
            backgroundColor: generateRandomColors(counties.length),
            borderColor: 'black',
            borderWidth: 1,
          },
        ],
      });
      setIsLoading(false);
    }
    return () => {};
  }, [loading]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="header-body mt-6 mb-5">
            <AdminCards {...countStats} />
          </div>
          <div className="row">
            <div className="col-xl-6">
              <BarChart title="Number of Zones Per City" subtitle="Overview" chartData={zonesPerCityChart} />
            </div>
            <div className="col-xl-6">
              <BarChart title="Number of Pharmacies Per City" subtitle="Overview" chartData={PharmaciesPerVilleChart} />
            </div>
            <div className="col-xl-6">
              <BarChart title="Number of Pharmacies Per Zone" subtitle="Overview" chartData={PharmaciesPerZoneChart} />
            </div>
            <div className="col-xl-6">
              <LineChart title="Latitude of Pharmacies Per Pharmacist" subtitle="Overview" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardHome;
