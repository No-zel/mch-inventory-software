// Components
export { toSentenceCase } from './Components/toSentenceCase.js'
export { showNotification } from './Components/notification.js';
export { dateFormat } from './Components/dateFormat.js'

//CRUD (Database)
export { getProducts } from './functions/getProducts.js'
export { createItem } from './functions/createItem.js';
export { deleteItem } from './functions/deleteItem.js';
export { editItem } from './functions/editItem.js'
export { exportData } from './functions/exportData.js'

// Generate Print
export { generateAndPrintQR } from './functions/generateAndPrintQR.js';
export { generateAndPrintReport } from './functions/generateAndPrintReport.js';

//Populate
export { populateTable } from './functions/populateTable.js'
export { populateDepartmentModal } from './functions/populateDepartmentModal.js'
export { populateDataCounter } from './functions/populateDataCounter.js'
export { populateOverviewModal } from './functions/populateOverviewModal.js'

//Clear
export { clearReportModal } from './functions/clearReportModal.js'
export { clearFilterModal } from './functions/clearFilterModal.js'
export { clearoverviewModal } from './functions/clearoverviewModal.js'