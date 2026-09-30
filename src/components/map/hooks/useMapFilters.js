import { useState, useEffect } from 'react';

const useMapFilters = (initialCategory, workers, initialTimeRange = 'threemonths') => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filtered_workers, set_filtered_workers] = useState([]);
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [properties, set_properties] = useState([]);
  const [tick_properties, set_tick_properties] = useState([]);
  const [normal_fields, set_normal_fields] = useState([]);
  const [tick_fields, set_tick_fields] = useState([]);
  const [predefine_fields, set_predefine_fields] = useState([]);

  // Your exact same filter functions
  const now = new Date();
  const is_within_time_range = (worker, range = timeRange) => {
    const createdAt = new Date(worker.updated_at);
    const diffInMs = now - createdAt;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    switch (range) {
      case 'week':
        return diffInDays <= 7;
      case 'month':
        return diffInDays <= 30;
      case 'threemonths':
        return diffInDays <= 90;
      case 'all':
      default:
        return true;
    }
  };

  const is_worker_in_range = worker => {
    let is_googd_to_go = true;
    var decoded_pr = JSON.parse(worker.json_properties);

    var selected_decoded_pr = decoded_pr.filter(pr => {
      if (pr.special == 1) return pr;
    });
    
    normal_fields.map(nf => {
      if (nf.special == 1) {
        if (nf.low > 0 || nf.high > 0) {
          const matched_pr_nf = selected_decoded_pr.find(function (pr) {
            return pr.name == nf.value;
          });
          const lower = nf.low > 0 ? parseInt(nf.low) : parseInt(nf.min_range);
          const higher = nf.high > 0 ? parseInt(nf.high) : parseInt(nf.max_range);
          if (matched_pr_nf) {
            if (matched_pr_nf.value > lower && matched_pr_nf.value < higher) {
              // Good
            } else {
              is_googd_to_go = false;
            }
          }
        }
      }
    });

    tick_properties.map(ps => {
      var selected_decoded_pr = decoded_pr.filter(pr => {
        if (pr.kind == 2) return pr;
      });
      const matched_pr_tk = selected_decoded_pr.find(function (pr) {
        return pr.name == ps.name;
      });
      if (!matched_pr_tk) {
        is_googd_to_go = false;
      }
    });

    return is_googd_to_go;
  };

  // Your exact same useEffect for filtering
  useEffect(() => {
    if (!selectedCategory?.id || workers.length === 0) {
      set_filtered_workers([]);
      return;
    }

    const filterWorkers = () => {
      let filtered = workers.filter(worker => {
        if (selectedCategory === 'all') return true;
        return worker.category_id == selectedCategory?.id;
      });
      filtered = filtered.filter(worker => is_within_time_range(worker));
      filtered = filtered.filter(worker => is_worker_in_range(worker));
      return filtered;
    };
    
    set_filtered_workers(filterWorkers());
  }, [selectedCategory, workers, timeRange, properties, tick_properties, normal_fields]);

  return {
    // State
    selectedCategory,
    filtered_workers,
    timeRange,
    properties,
    tick_properties,
    normal_fields,
    tick_fields,
    predefine_fields,
    
    // Setters
    setSelectedCategory,
    setTimeRange,
    set_properties,
    set_tick_properties,
    set_normal_fields,
    set_tick_fields,
    set_predefine_fields,
    
    // Functions
    is_within_time_range,
    is_worker_in_range
  };
};

export default useMapFilters;