const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '180px';
container.style.right = '10px';
container.style.backgroundColor = 'white';
container.style.border = '1px solid #ccc';
container.style.padding = '10px';
container.style.zIndex = '1000';

container.innerHTML = `
  <input type="number" id="maxYTD" placeholder="Enter max YTD">
  <button id="filterButton">Filter</button>
  <button id="stopButton">Stop</button>
  <button id="saveButton">Save</button>
`;

document.body.appendChild(container);

let filteredData = 'Name,Region,Type,ISIN,MinimalInv,YTD\n';
let flag = false;
function filterAndSave(maxYTD) {
	const rows = document.querySelectorAll('table[role="grid"] tr');
	rows.forEach(row => {
	  const cells = row.querySelectorAll('td');
	  const ytdCell = cells[8]; 
	  const nameCell = cells[0];
	  const regionCell = cells[11];
      const typeCell = cells[3];	
      const isinCell = cells[14];	
      const miniCell = cells[17];		  
	  if (ytdCell && nameCell) {
		const ytd = parseFloat(ytdCell.innerText.replace(/[^0-9.]/g, ''));
		if (ytd >= maxYTD) {
		  filteredData += nameCell.innerText.replace(/,/g, '')+','+ regionCell.innerText +','+typeCell.innerText+','+isinCell.innerText+','+miniCell.innerText+','+ ytd + '\n';
		}
	  }
	});
	const nextPageButton = document.querySelector('button[aria-label="Next Page"]');
	if (nextPageButton && flag) {
		nextPageButton.click();
		setTimeout(() => filterAndSave(maxYTD), 6000);
	} else {
		alert('error or done');
	}
}

function saveFile() {
  // Save filtered data to a text file
  const blob = new Blob([filteredData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Data.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.getElementById('filterButton').addEventListener('click', () => {
  const maxYTD = parseFloat(document.getElementById('maxYTD').value);
  flag = true;
  filterAndSave(maxYTD);
});
document.getElementById('saveButton').addEventListener('click', () => {
  const maxYTD = parseFloat(document.getElementById('maxYTD').value);
  saveFile();
});
document.getElementById('stopButton').addEventListener('click', () => {
  flag = false;
});