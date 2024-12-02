import React from 'react';

export function InvestmentFilters() {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Catégorie
          </label>
          <select
            id="category"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Toutes les catégories</option>
            <option value="elevage">Élevage</option>
            <option value="agriculture">Agriculture</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            id="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="termine">Terminé</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
            Période
          </label>
          <select
            id="dateRange"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Toutes les périodes</option>
            <option value="lastMonth">Dernier mois</option>
            <option value="lastQuarter">Dernier trimestre</option>
            <option value="lastYear">Dernière année</option>
          </select>
        </div>

        <div>
          <label htmlFor="performance" className="block text-sm font-medium text-gray-700">
            Performance
          </label>
          <select
            id="performance"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Toutes les performances</option>
            <option value="profit">En profit</option>
            <option value="loss">En perte</option>
          </select>
        </div>
      </div>
    </div>
  );
}