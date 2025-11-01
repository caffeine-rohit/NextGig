import { X, Filter } from 'lucide-react';
import { JobFilters } from '../../types';
import { JOB_CATEGORIES } from '../../constants/categories';
import { INDIA_LOCATIONS, JOB_TYPES, EXPERIENCE_LEVELS } from '../../constants/locations';
import { PrimaryButton } from '../common/PrimaryButton';
import { SelectField } from '../common/SelectField';
import { useState } from 'react';

interface FilterPanelProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onClear: () => void;
}

export function FilterPanel({ filters, onFiltersChange, onClear }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof JobFilters, value: string | boolean | undefined) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  );

  return (
    <div className="bg-white rounded-card shadow-custom">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-dark font-heading">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-5">
          <SelectField
            label="Category"
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...JOB_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
            ]}
          />

          <SelectField
            label="Location"
            value={filters.location || ''}
            onChange={(e) => updateFilter('location', e.target.value)}
            options={[
              { value: '', label: 'All Locations' },
              ...INDIA_LOCATIONS.map((loc) => ({ value: loc, label: loc })),
            ]}
          />

          <SelectField
            label="Job Type"
            value={filters.job_type || ''}
            onChange={(e) => updateFilter('job_type', e.target.value)}
            options={[
              { value: '', label: 'All Types' },
              ...JOB_TYPES.map((type) => ({ value: type, label: type })),
            ]}
          />

          <SelectField
            label="Experience Level"
            value={filters.experience_level || ''}
            onChange={(e) => updateFilter('experience_level', e.target.value)}
            options={[
              { value: '', label: 'All Levels' },
              ...EXPERIENCE_LEVELS.map((level) => ({ value: level, label: level })),
            ]}
          />

          <div className="pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.is_remote || false}
                onChange={(e) => updateFilter('is_remote', e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700 font-body">
                Remote Only
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
