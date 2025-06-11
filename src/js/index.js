// Components
export { toSentenceCase } from './Components/toSentenceCase.js'
export { showNotification } from './Components/notification.js';
export { dateFormat } from './Components/dateFormat.js'

//CRUD (Database)
export { getProducts } from './functions/getProducts.js'
export { getAccounts } from './functions/getAccounts.js'
export { createItem } from './functions/createItem.js';
export { deleteItem } from './functions/deleteItem.js';
export { deleteAccount } from './functions/deleteAccount.js'
export { editItem } from './functions/editItem.js'
export { editAccount } from './functions/editAccount.js'
export { exportData } from './functions/exportData.js'
export { createAccount } from './functions/createAccount.js'

// Generate Print
export { generateAndPrintQR } from './functions/generateAndPrintQR.js';
export { generateAndPrintReport } from './functions/generateAndPrintReport.js';

//Populate
export { populateTable } from './functions/populateTable.js'
export { populateDepartmentModal } from './functions/populateDepartmentModal.js'
export { populateDataCounter } from './functions/populateDataCounter.js'
export { populateOverviewModal } from './functions/populateOverviewModal.js'
export { populateTransaction } from './functions/populateTransactionModal.js'
export { populateManageUsers } from './functions/populateManageUser.js'

//Clear
export { clearReportModal } from './functions/clearReportModal.js'
export { clearFilterModal } from './functions/clearFilterModal.js'
export { clearoverviewModal } from './functions/clearoverviewModal.js'
export { applyFilter } from './functions/applyFilter.js'

//Bind
export { bindSuperadminModalEvents } from './functions/bindSuperadminModalEvents.js'