
async function createUlFromTxt(fin, elem, h2) {
	console.log("Loading html ads from " + fin);
	let title = document.createElement('p');
	title.innerHTML = h2;
	elem.appendChild(title);
	fetch(fin)
  		.then(response => response.text())
  		.then((rawFile) => {
    		const arrayOfLines = rawFile.match(/[^\r\n]+/g); // https://stackoverflow.com/a/5035058/1166518
    		var ul = document.createElement('ul');
    		for (let link of arrayOfLines) {
    			let li = document.createElement('li');
    			li.innerHTML = link;
    			ul.appendChild(li);
    		}
    		elem.appendChild(ul);
  		})
}

// FIXME: hardcode id
async function set_sidebar_recommendation() {
	
	let elem = document.getElementById("sidebar_recommendation"); 

	const bookListFile = '/assets/advertise/books_html.txt';
	createUlFromTxt(bookListFile, elem, '书籍');

}


console.log("Set ads");

set_sidebar_recommendation();
