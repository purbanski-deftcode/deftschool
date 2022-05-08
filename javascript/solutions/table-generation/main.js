const NUM_OF_COLUMNS_FIELD_ID = 'number-of-columns';
const NUM_OF_ROWS_FIELD_ID = 'number-of-rows';
const SELECTED_COLUMN_FIELD_ID = 'selected-column';
const SELECTED_ROW_FIELD_ID = 'selected-row';
const TABLE_CONTAINER_CLASS = 'table-container';
const SELECTED_ROW_CLASS = 'selected-row';
const SELECTED_COLUMN_CLASS = 'selected-column';
const INPUT_ERROR_CLASS = 'is-danger';
const ERROR_VISIBILITY_CLASS = 'is-hidden';
const ERROR_CLASS = 'help';
const TABLE_MAIN_CLASS = 'table';
const TABLE_CLASSES = [TABLE_MAIN_CLASS, 'is-bordered', 'is-fullwidth'];
const FORM_FIELDS = [NUM_OF_COLUMNS_FIELD_ID, NUM_OF_ROWS_FIELD_ID, SELECTED_ROW_FIELD_ID, SELECTED_COLUMN_FIELD_ID];

FORM_FIELDS.forEach(fieldId => document.getElementById(fieldId).addEventListener('input', () => {
  removeExistingTable();
  hideValidationErrors();

  const formValues = getFormValues();
  const isDataValid = validateAndMarkFormFields(formValues);

  if (!isDataValid) {
    return;
  }

  const table = createTableElement(formValues);

  document.querySelector('.' + TABLE_CONTAINER_CLASS).append(table);
}));

function getFormValues() {
  return {
    numberOfColumns: getFormFieldValue(NUM_OF_COLUMNS_FIELD_ID),
    numberOfRows: getFormFieldValue(NUM_OF_ROWS_FIELD_ID),
    selectedRow: getFormFieldValue(SELECTED_ROW_FIELD_ID),
    selectedColumn: getFormFieldValue(SELECTED_COLUMN_FIELD_ID),
  }
}

function getFormFieldValue(elementId) {
  const elementValue = document.getElementById(elementId).value;

  if (elementValue === '') {
    return null;
  }

  return Number(elementValue);
}

function createTableCells(numOfColumns, selectedColumnIdx, currentRowIdx) {
  return Array(numOfColumns).fill(null).map((_, idx) => {
    const cell = document.createElement('td');

    cell.innerText = `${currentRowIdx + 1}${idx + 1}`;

    if (idx === selectedColumnIdx - 1) {
      cell.classList.add(SELECTED_COLUMN_CLASS);
    }

    return cell;
  });
}

function createTableRows(formValues) {
  return Array(formValues.numberOfRows).fill(null).map((_, idx) => {
    const tableRow = document.createElement('tr');

    const tableCells = createTableCells(
      formValues.numberOfColumns,
      formValues.selectedColumn,
      idx,
    );

    if (idx === formValues.selectedRow - 1) {
      tableRow.classList.add(SELECTED_ROW_CLASS)
    }

    tableRow.append(...tableCells);

    return tableRow;
  });
}

function createTableElement(formValues) {
  const table = document.createElement('table');
  const tableBody = document.createElement('tbody');
  const tableRows = createTableRows(formValues);

  tableBody.append(...tableRows)
  table.append(tableBody);

  TABLE_CLASSES.forEach(cssClass => table.classList.add(cssClass));

  return table;
}

function hideValidationErrors() {
  FORM_FIELDS.forEach((fieldId) => {
    const element = document.getElementById(fieldId);

    element.classList.remove(INPUT_ERROR_CLASS);
    element.parentElement.parentElement.querySelector('.' + ERROR_CLASS).classList.add(ERROR_VISIBILITY_CLASS);
  });
}

function validateAndMarkFormFields(formValues) {
  const isNumberOfColumnsValid =  formValues.numberOfColumns > 0;
  const isNumberOfRowsValid = formValues.numberOfRows > 0;
  const isSelectedColumnValid = formValues.selectedColumn > 0 && formValues.selectedColumn <= formValues.numberOfColumns;
  const isSelectedRowValid = formValues.selectedRow > 0 && formValues.selectedRow <= formValues.numberOfRows;

  if (!isNumberOfColumnsValid && formValues.numberOfColumns !== null) {
    markFieldAsInvalid(NUM_OF_COLUMNS_FIELD_ID);
  }

  if (!isSelectedColumnValid && formValues.selectedColumn !== null) {
    markFieldAsInvalid(SELECTED_COLUMN_FIELD_ID);
  }

  if (!isNumberOfRowsValid && formValues.numberOfRows !== null) {
    markFieldAsInvalid(NUM_OF_ROWS_FIELD_ID);
  }

  if (!isSelectedRowValid && formValues.selectedRow !== null) {
    markFieldAsInvalid(SELECTED_ROW_FIELD_ID);
  }

  return !(!isNumberOfColumnsValid || !isSelectedColumnValid || !isNumberOfRowsValid || !isSelectedRowValid);
}

function markFieldAsInvalid(fieldId) {
  const field = document.getElementById(fieldId);

  field.classList.add(INPUT_ERROR_CLASS);
  field.parentElement.parentElement.querySelector('.' + ERROR_CLASS).classList.remove(ERROR_VISIBILITY_CLASS);
}

function removeExistingTable() {
  const currentTableElement = document.querySelector('.' + TABLE_MAIN_CLASS);

  if (currentTableElement) {
    currentTableElement.remove();
  }
}
