let addressBits;
let cacheSizeBytes;
let associativity;
let numCacheIndexes;
let wordsPerCacheLine;
let blockSizeBytes;
let blockOffsetBits;
let cacheIndexBits;
let tagBits;

document.getElementById("calculate-btn").addEventListener("click", function() {
  addressBits = parseInt(document.getElementById("address-bits").value);
  cacheSizeBytes = parseInt(document.getElementById("cache-size").value);
  associativity = parseInt(document.getElementById("cache-associativity").value);
  numCacheIndexes = parseInt(document.getElementById("cache-index").value);
  wordsPerCacheLine = parseInt(document.getElementById("word-size").value);

  blockSizeBytes = cacheSizeBytes / (associativity * numCacheIndexes)
  blockOffsetBits = Math.log2(wordsPerCacheLine);
  cacheIndexBits = Math.log2(numCacheIndexes);
  tagBits = addressBits - cacheIndexBits - blockOffsetBits;

  document.getElementById("block-size-bytes").textContent = `${blockSizeBytes} bytes`;
  document.getElementById("block-offset-bits").textContent = `${blockOffsetBits} bits`; // I switched the blockOffsetBits and cacheIndexBits
  document.getElementById("cache-index-bits").textContent = `${cacheIndexBits} bits`;
  document.getElementById("tag-bits").textContent = `${tagBits} bits`;
});

document.getElementById("cache-associativity-display").textContent = document.getElementById("cache-associativity").value;

function addRow(tableID) {
  const table = document.getElementById(tableID);
  const row = document.createElement('tr');
  const inputCell = document.createElement('td');
  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputCell.appendChild(inputElement);
  row.appendChild(inputCell);

  if (tableID === "memory-accesses") {
    const binaryCell = document.createElement('td');
    const binaryInput = document.createElement('input');
    binaryInput.type = 'text';
    binaryInput.readOnly = true;
    binaryCell.appendChild(binaryInput);
    row.appendChild(binaryCell);

    inputElement.addEventListener('input', () => {
      const decimalValue = parseInt(inputElement.value, 10);
      const binaryValue = numToBinary(decimalValue, addressBits);
      const formattedBinaryValue = formatBinary(binaryValue);
      binaryInput.value = formattedBinaryValue;
    });

    const hitOrMissCell = document.createElement('td');
    const hitOrMissInput = document.createElement('input');
    hitOrMissInput.type = 'text';
    hitOrMissCell.appendChild(hitOrMissInput);
    row.appendChild(hitOrMissCell);

    const cacheTagCell = document.createElement('td');
    const cacheTagInput = document.createElement('input');
    cacheTagInput.type = 'text';
    cacheTagCell.appendChild(cacheTagInput);
    row.appendChild(cacheTagCell);

    const cacheIndexCell = document.createElement('td');
    const cacheIndexInput = document.createElement('input');
    cacheIndexInput.type = 'text';
    cacheIndexCell.appendChild(cacheIndexInput);
    row.appendChild(cacheIndexCell);
  }

  table.appendChild(row);
}

function removeRow(tableId) {
  const table = document.getElementById(tableId);
  if (table.rows.length > 1) {
    table.deleteRow(-1);
  }
}


document.getElementById("add-row-memory-contents").addEventListener("click", function() {
  addRow("memory-contents");
});

document.getElementById("remove-row-memory-contents").addEventListener("click", function() {
  removeRow("memory-contents");
});

document.getElementById("add-row-memory-accesses").addEventListener("click", function() {
  addRow("memory-accesses");
});

document.getElementById("remove-row-memory-accesses").addEventListener("click", function() {
  removeRow("memory-accesses");
});

document.getElementById("add-row-final-cache-status").addEventListener("click", function() {
  addRow("final-cache-status");
});

document.getElementById("remove-row-final-cache-status").addEventListener("click", function() {
  removeRow("final-cache-status");
});

document.getElementById("cache-associativity").addEventListener("input", function() {
  const inputValue = this.value;
  document.getElementById("cache-associativity-display").innerText = inputValue;
});

function numToBinary(num, bitLength) {
  const binary = (num >>> 0).toString(2);
  const paddedBinary = binary.padStart(bitLength, '0');
  return paddedBinary;
}

const memory_headers = [
  "Decimal Address",
  "Data",
  "Decimal Address",
  "Data",
  "Decimal Address",
  "Data"
];

const memory_rows = [
  [0, "Four", 20, "year", 40, "s_br"],
  [4, "Scor", 24, "s_ag", 44, "Ough"],
  [8, "e_an", 28, "o_ou", 48, "t_fo"],
  [12, "d_se", 32, "r_fa", 52, "rth,"],
  [16, "ven_", 36, "ther", 56, "_on_"]
];

const cache_associativity_headers = [
  "Decimal Address",
  "Binary Address",
  "Hit (H) or Miss (M)",
  "Cache Tag",
  "Cache Index",
];

const cache_associativity_rows = [
  ["8", "", "", "", ""],
  ["12", "", "", "", ""],
  ["8", "", "", "", ""],
  ["24", "", "", "", ""],
  ["20", "", "", "", ""],
  ["12", "", "", "", ""]
];

const final_cache_status_headers = [
  "Cache Index",
  "Cache Tag",
  "Data"
];

const final_cache_status_rows = [
  ["0", "", ""],
  ["1", "", ""],
  ["2", "", ""],
  ["3", "", ""]
];

function createTable(headers, rows, id) {
  const table = document.getElementById(id);
  let tableContent = "<tr>";

  // Add headers
  headers.forEach(header => {
    tableContent += `<th>${header}</th>`;
  });
  tableContent += "</tr>";

  // Add rows
  rows.forEach(row => {
    tableContent += "<tr>";
    row.forEach(cell => {
      tableContent += `<td><input type="text" value="${cell}"></td>`;
    });
    tableContent += "</tr>";
  });

  table.innerHTML = tableContent;
}

createTable(memory_headers, memory_rows, 'memory-contents');
createTable(cache_associativity_headers, cache_associativity_rows, 'memory-accesses');
createTable(final_cache_status_headers, final_cache_status_rows, 'memory-status-1');
createTable(final_cache_status_headers, final_cache_status_rows, 'memory-status-2');

function numToBinary(num, bitLength) {
  const binary = (num >>> 0).toString(2);
  const paddedBinary = binary.padStart(bitLength, '0');
  return paddedBinary;
}

function formatBinary(binary) {
  const chunkSize = 4;
  const chunks = [];
  for (let i = 0; i < binary.length; i += chunkSize) {
    chunks.push(binary.slice(i, i + chunkSize));
  }
  return chunks.join(' ');
}

function formatBinaryWithLength(binary, length) {
  return binary.padStart(length, '0').replace(/(\d{4})/g, '\$1 ').trim();
}

const table = document.getElementById('memory-accesses');
const cacheIndices = new Set();

function updateCacheColumns(row) {
  const decimalValue = parseInt(row.cells[0].querySelector('input').value, 10);
  const binaryValue = numToBinary(decimalValue, addressBits);
  const formattedBinaryValue = formatBinary(binaryValue);
  row.cells[1].querySelector('input').value = formattedBinaryValue;

  const tagBits = parseInt(document.getElementById("tag-bits").textContent);
  const cacheTag = binaryValue.slice(0, tagBits);

  const blockOffsetBits = parseInt(document.getElementById("block-offset-bits").textContent);
  const shiftedBinaryValue = binaryValue.slice(0, -blockOffsetBits);

  const cacheIndexBits = parseInt(document.getElementById("cache-index-bits").textContent);
  const cacheIndex = shiftedBinaryValue.slice(-cacheIndexBits);

  const hitOrMissInput = document.createElement('input');
  hitOrMissInput.type = 'text';
  hitOrMissInput.readOnly = true;

  if (cacheIndices.has(cacheIndex)) {
    hitOrMissInput.value = "H";
  } else {
    hitOrMissInput.value = "M";
    cacheIndices.add(cacheIndex);
  }

  row.cells[2].innerHTML = '';
  row.cells[2].appendChild(hitOrMissInput);


  row.cells[3].querySelector('input').value = formatBinary(cacheTag);
  row.cells[4].querySelector('input').value = cacheIndex;
}

const calculateButton = document.getElementById("calculate-btn");
calculateButton.addEventListener("click", function() {
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const inputElement = row.cells[0].querySelector('input');
    inputElement.addEventListener('input', () => {
      updateCacheColumns(row);
    });
    updateCacheColumns(row);
  }
});

calculateButton.addEventListener("click", function() {
  const memoryData = [];

  if (memoryData.length) {
    memoryData.length = 0;
  }

  for (let i = 0; i < memory_rows.length; i++) {
    const rowData = [];
    for (let j = 0; j < memory_rows[i].length; j += 2) {
      rowData.push([memory_rows[i][j], memory_rows[i][j+1]]);
    }
    memoryData.push(rowData);
  }

  console.log(memoryData);

  const memoryAccessesTable = document.getElementById('memory-accesses');
  const numRows = memoryAccessesTable.rows.length;

  // Initialize final_cache_status_rows with empty entries
  for (let i = 0; i < 4; i++) {
    final_cache_status_rows[i] = [i, "", ""];
  }

  for (let i = 1; i < numRows; i++) {
    const row = memoryAccessesTable.rows[i];
    const decimalAddress = parseInt(row.cells[0].querySelector('input').value, 10);
    const blockOffset = decimalAddress & 0b111;
    const cacheIndex = (decimalAddress >> 3) & 0b11;
    const cacheTag = (decimalAddress >> 5).toString(2).padStart(7, "0");

    let data = "";
    for (let j = 0; j < 8; j++) {
      const addressInRange = (decimalAddress - blockOffset) & ~0b111 | j;
      const memoryRow = memoryData.find(r => r.some(([addr, _]) => addr === addressInRange));

      if (memoryRow) {
        const columnIndex = memoryRow.findIndex(([addr, _]) => addr === addressInRange);
        data += memoryRow[columnIndex][1];
      }
    }

    final_cache_status_rows[cacheIndex] = [cacheIndex, cacheTag, data];
  }

  createTable(final_cache_status_headers, final_cache_status_rows, 'memory-status-1');
  // createTable(final_cache_status_headers, final_cache_status_rows, 'memory-status-2');
});

