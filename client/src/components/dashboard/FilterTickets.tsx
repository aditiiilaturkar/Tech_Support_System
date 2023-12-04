
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

interface FilterTicketsProps {
    filter: boolean;
    setFilter: any;
    filterOptions: any;
    setFilterOptions: any;
}


export const FilterTickets = ({filter, setFilter, setFilterOptions, filterOptions} :FilterTicketsProps) => {
    const [dates, setDates] = useState({
        from : filterOptions.from,
        to: filterOptions.to
    })
    const [sortBy, setSortBy] = useState(filterOptions.factor);
    const [resolvedDates, setResolvedDates] = useState({
        from : filterOptions.from,
        to: filterOptions.to
    })


    const handleFilterToggle = (event: any) => {
        const { name, value } = event.target;
        console.log("\n resolvedOn -- ", value);
          setSortBy(value);
    }
    const handleSave = () => {
        if(sortBy == 'createdOn') {
            setFilterOptions({
                ...filterOptions,
                factor: 'createdOn',
                from: dates.from,
                to: dates.to
              });    
        }else{
            setFilterOptions({
                ...filterOptions,
                factor: 'resolvedOn',
                from: resolvedDates.from,
                to: resolvedDates.to
              });    
        }
        console.log("filterOptions --- ", filterOptions);
        setFilter(!filter);
        
      };

    const handleClose = () => {
        setFilter(!filter);
    }
    if(!filter) {
        return <></>;
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-md mx-auto">
            <div className="mt-4">
            <div className="flex items-center mt-4">
        <label className="text-sm text-gray-600 mr-2">
          Filter by:
        </label>
        <select
          name="factor"
          value={sortBy}
          onChange={handleFilterToggle}
          className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="createdOn"> created date</option>
          <option value="resolvedOn">Resolved Date</option>
        </select>
      </div>    
        {sortBy == 'resolvedOn' ? (
               <div className="mt-4">
               <h2 className="text-lg font-bold mb-2">Filter by resolved date</h2>
               <div className="flex flex-col mb-4">
                 <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">
                   resolved from:
                 </label>
                 <input
                   type="date"
                   id="startDate"
                   className="border border-gray-300 rounded px-3 py-2"
                   value={resolvedDates.from}
                   onChange={(e) =>
                     setResolvedDates({
                       ...resolvedDates,
                       from: e.target.value 
                     })
                   }
                 />
               </div>
               <div className="flex flex-col mb-4">
                 <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">
                  resolved before:
                 </label>
                 <input
                   type="date"
                   id="endDate"
                   className="border border-gray-300 rounded px-3 py-2"
                   value={resolvedDates.to}
                   onChange={(e) =>
                     setResolvedDates({
                       ...resolvedDates,
                       to: e.target.value 
                     })
                   }
 
                 />
               </div>
             </div>
       
        ) : (
            <>
                    <h2 className="text-lg font-bold mb-2">Filter by created date</h2>
              <div className="flex flex-col mb-4">
                <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">
                  Start Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="border border-gray-300 rounded px-3 py-2"
                  value={dates.from}
                  onChange={(e) =>
                    setDates({
                      ...dates,
                      from: e.target.value 
                    })
                  }
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">
                  End Date:
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="border border-gray-300 rounded px-3 py-2"
                  value={dates.to}
                  onChange={(e) =>
                    setDates({
                      ...dates,
                      to: e.target.value 
                    })
                  }

                />
              </div>
            </>
        )}
        
      
            </div>
      
      
                
            <div className="mt-auto flex flex-col items-end">
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-full hover:bg-blue-600 transition-colors"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
        
      );
    }
    
