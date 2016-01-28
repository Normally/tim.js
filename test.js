var TIM = require('./index.js');

console.log("Converting string...");
console.log(TIM.convert("	Some shoes for £300 and a coat for £20\n"));

TIM.options(
		{
			yearlyWage: 500,
			monthlyWage: 200,
			tax: 0.1,
			workingDays: 5,
			workingHours: 5,
			isActive: true,
			replace: false
		}

);

console.log("Converting array of strings...");
console.log(TIM.convert([
	"Some shoes for £300 and a coat for £20.00",
	"Some glasses for £10 and a tie for £5.00"
	]));