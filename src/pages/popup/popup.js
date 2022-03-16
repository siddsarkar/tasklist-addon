/* eslint-disable no-alert */
/* eslint-disable no-undef */

const input = document.querySelector('.task-info-input');
const type = document.querySelector('.task-type-input');
const addTask = document.querySelector('.task-add');
const list = document.querySelector('.list-flex');
const listHdr = document.querySelector('.right-list-h3');
const verifyContainer = document.querySelector('.verify');
const verifyBtns = document.querySelector('.verify-btns');

const typeBC = ['LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow'];
let slate = [];

chrome.storage.local.get('slate', ls => {
	if (ls.slate) {
		slate = JSON.parse(ls.slate);

		console.log(slate);
		if (slate.length === 0) {
			listHdr.innerHTML = 'Add a task to begin.';
		} else {
			makeList();
			listHdr.innerHTML = 'Up coming tasks.';
		}
	} else {
		listHdr.innerHTML = 'Add a task to begin.';
	}
});

addTask.addEventListener('click', addToList);

function addToList() {
	const inputType = type.value;
	const inputValue = input.value;

	if (inputValue === '' || inputType === '') {
		return alert('enter value');
	}

	const foundTypeColor = slate.find(v => v.type === inputType);
	const typeColor = foundTypeColor ? foundTypeColor.labelColor : typeBC[Math.floor(Math.random() * typeBC.length)];

	const obj = {
		value: inputValue,
		type: inputType,
		labelColor: typeColor,
	};

	const val = slate.length;
	slate.unshift(obj);
	input.value = '';
	type.value = '';
	makeListItem(obj, val);
	input.focus();
	listHdr.innerHTML = 'Up coming tasks.';

	makeList();
	chrome.storage.local.set({slate: JSON.stringify(slate)});
}

function makeList() {
	list.innerHTML = '';
	slate.forEach((element, index) => {
		makeListItem(element, index);
	});
}

function makeListItem(el, indx) {
	const itemDiv = document.createElement('div');
	itemDiv.classList.add('list-item');
	list.append(itemDiv);

	const valueDiv = document.createElement('div');
	valueDiv.classList.add('list-item-value');
	valueDiv.textContent = `${el.value}`;

	const typeDiv = document.createElement('div');
	typeDiv.style.backgroundColor = el.labelColor;
	typeDiv.classList.add('list-item-type');
	typeDiv.textContent = `${el.type}`;

	const removeDiv = document.createElement('div');
	removeDiv.classList.add('list-item-remove');
	removeDiv.innerHTML = '<img src="' + chrome.runtime.getURL('/assets/delete.svg') + '" />';
	itemDiv.append(valueDiv);
	itemDiv.append(typeDiv);
	itemDiv.append(removeDiv);

	removeDiv.addEventListener('click', () => {
		itemDiv.style.backgroundColor = '#ffffff45';
		verifyContainer.style.display = 'flex';
		verifyBtns.addEventListener('click', e => {
			const click = e.target.closest('.verify-btn');
			if (!click) {
				return;
			}

			const dataSet = click.dataset.delete;
			if (dataSet === 'yes') {
				itemDiv.remove();
				slate.splice(indx, 1);
			} else {
				verifyContainer.style.display = 'none';
			}

			if (slate.length === 0) {
				listHdr.innerHTML = 'Add a task to begin.';
			}

			verifyContainer.style.display = 'none';
			itemDiv.style.backgroundColor = 'var(--primary-dark)';
			chrome.storage.local.set({slate: JSON.stringify(slate)});
		});
	});
}
