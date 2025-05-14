import { populateTable, populateDataCounter } from '../index.js';

export function applyFilter(e) {
  e.preventDefault();

  const selected = Array.from(document.querySelectorAll('#FilterForm input:checked'))

    const filters = {
        department: [],
        status: [],
        year: []
    };

    selected.forEach(input => {
      if (filters.hasOwnProperty(input.name)) {
          filters[input.name].push(input.value);
      }
    });


    const reportItems = window.allItems.filter(item => {
      const itemDate = new Date(item.created_at);
      const itemYear = itemDate.getFullYear().toString();

      const matchDepartment = filters.department.length ? filters.department.includes(item.department) : true;
      const matchStatus = filters.status.length ? filters.status.includes(item.status) : true;
      const matchYear = filters.year.length ? filters.year.includes(itemYear) : true;
      return matchDepartment && matchStatus && matchYear;
    });

  const filteredItems = reportItems.length ? reportItems : window.allItems;


  populateTable(filteredItems);
  populateDataCounter();
  filterModal.style.display = "none";
}