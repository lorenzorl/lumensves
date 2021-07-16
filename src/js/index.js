export default () => {
	
const priceInLumensElement = document.querySelector('input[name="lumens_price"]');
const priceInVesElement = document.querySelector('input[name="ves_price"]');
const priceInUsdElement = document.querySelector('input[name="usd_price"]');

const Lumens = 'LUMENS';
const Ves = 'VES';
const Usd = 'USD';

let lumensToUsdPrice = 0;
let vesToUsdPrice = 0;

priceInLumensElement.addEventListener('input', e => updateValue(Lumens, e.target.value));
priceInVesElement.addEventListener('input', e => updateValue(Ves, e.target.value));
priceInUsdElement.addEventListener('input', e => updateValue(Usd, e.target.value));

priceInLumensElement.addEventListener('blur', e => resetValues(e));
priceInVesElement.addEventListener('blur', e => resetValues(e));
priceInUsdElement.addEventListener('blur', e => resetValues(e));

const getLumensPrice = async newValue => {
	const url = 'https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd';
	try{
		const res = await fetch(url);
		const data = await res.json();
		lumensToUsdPrice = data.stellar.usd;
		priceInLumensElement.value = 1;
		updateValue(Lumens, priceInLumensElement.value);
		checkData();
	} catch (e){
		console.log(e);
	}
}
const getVesPrice = async newValue => {
	const url = 'https://s3.amazonaws.com/dolartoday/data.json';
	try{
		const res = await fetch(url);
		const data = await res.json();
		vesToUsdPrice = data.USD.dolartoday;
		priceInLumensElement.value = 1;
		updateValue(Lumens, priceInLumensElement.value);
		checkData();
	} catch (e){
		console.log(e);
	}
}

const updateValue = (currency, value) => {

	const parsedValue = value === '' ? 1 : parseFloat(value);

	if(currency === Lumens){
		priceInVesElement.value =  (parsedValue * lumensToUsdPrice * vesToUsdPrice).toFixed(2);
		priceInUsdElement.value = (parsedValue * lumensToUsdPrice).toFixed(2);

	} else if(currency === Ves){
		priceInLumensElement.value = (parsedValue / (lumensToUsdPrice * vesToUsdPrice)).toFixed(2);
		priceInUsdElement.value = (parsedValue / vesToUsdPrice).toFixed(2);

	} else if(currency === Usd){
		 priceInLumensElement.value = (parsedValue / lumensToUsdPrice).toFixed(2);
		 priceInVesElement.value = (parsedValue * vesToUsdPrice).toFixed(2);
	}
}
const resetValues = e => {
	if (e.target.value === '' || parseFloat(e.target.value) === 0) {
		priceInLumensElement.value = 1;
		updateValue(Nano, 1);
	};
}

const checkData = () => {
	if (lumensToUsdPrice !== 0 && vesToUsdPrice !== 0) {
		setTimeout(() => {
			document.querySelector('.card').classList.toggle('animation');
			document.querySelector('.card .card__loader').classList.toggle('card__loader--loading');
			setTimeout(() => {
				document.querySelector('.card .card__loader').style.display = 'none';
			}, 500);
		}, 500);
	}
}

getLumensPrice();
getVesPrice();
}