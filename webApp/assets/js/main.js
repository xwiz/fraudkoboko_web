
function generateSingleErrorOutput(error) {
	html = '<pre style="color:red; ">' + error + '</pre>'
	return error ? html : '';
}

function generateErrorFirstName(error){
	return generateSingleErrorOutput(error.response.data.error.first_name);
}
function generateErrorLastName(error){
	return generateSingleErrorOutput(error.response.data.error.last_name);
}
function generateErrorEmailName(error){
	return generateSingleErrorOutput(error.response.data.error.email);
}
function generateErrorPhoneNumber(error){
	return generateSingleErrorOutput(error.response.data.error.phone_number);
}
function generateErrorPassword(error){
	return generateSingleErrorOutput(error.response.data.error.password);
}

/*
*	validate form inputs
*	Register a new User
*/

var firstname = document.getElementById('fnameerror');
var lastname = document.getElementById('lnameerror');
var email = document.getElementById('emailerror');
var phonenumber = document.getElementById('phoneerror');
var password = document.getElementById('passworderror');
var resultElement = document.getElementById('message');


function registerUser(){
	let userData = new FormData();
	userData.append('first_name', document.getElementById('first_name').value);
	userData.append('last_name', document.getElementById('last_name').value);
	userData.append('email', document.getElementById('email').value);
	userData.append('password', document.getElementById('password').value);
	userData.append('phone_number', document.getElementById('phone_number').value);

	axios.post('http://localhost:8000/api/v1/users', userData)
	.then(function (response){
		firstname.innerHTML = "";
		lastname.innerHTML = "";
		email.innerHTML = "";
		phonenumber.innerHTML = "";
		password.innerHTML = "";
		resultElement.innerHTML = response.data.message;
	})
	.catch(function (error){
		firstname.innerHTML = generateErrorFirstName(error);
		lastname.innerHTML = generateErrorLastName(error);
		email.innerHTML = generateErrorEmailName(error);
		phonenumber.innerHTML = generateErrorPhoneNumber(error);
		password.innerHTML = generateErrorPassword(error);
	});
}

/*
*	Authenticate New User and Logins him In
*/
function authenticateUser(){
	let userData = new FormData();
	userData.append('email', document.getElementById('loginemail').value);
	userData.append('password', document.getElementById('loginpassword').value);

	axios.post('http://localhost:8000/api/v1/auth/authenticate', userData)
	.then(function (authentication){
		window.sessionStorage.setItem('token', authentication.data.token);
	})
	.then(function getProfilePage(){
		const auth = {
			'headers' : {
				'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
			}
		};

		axios.post('http://localhost:8000/api/v1/users/me', {}, auth)
		.then(function (response){
			window.location.href = "C:/xampp/htdocs/consume/webApp/fraud.html";
		})
		.catch (function (error){
			console.log(error);
		})

	})
}

/*
*	View logged-in User details
*/
function viewMe(){

	const config = {
		'headers' : {
			'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
		}
	}

	axios.get('http://localhost:8000/api/v1/users/me', config)
	.then(function (response){
		console.log(response.data);
	})
	.catch (function (error){
		console.log(error);
	})
}


/*
*Get all fraud cases reported by a user.
*/


function userCase(){
	const config = {
		'headers' : {
			'Authorization' : 'Bearer ' + window.sessionStorage.getItem('token')
		}
	};
	axios.get('http://localhost:8000/api/v1/users/me', config)
	.then(function (response){
		var id = response.data.user.id
		axios.get('http://localhost:8000/api/v1/frauds/user/' + id)
		.then (function (response){
			console.log(response.data.data);
		})

	})
}
/*
*	Delete User Account Details
*/
function deleteUser(){
	const config = {
		'headers' : {
			'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
		}
	};
	axios.get('http://localhost:8000/api/v1/users/me', config)
	.then(function (response){
		var id = response.data.user.id
	axios.delete('http://localhost/api/v1/users/' + id)
		.then(function (response){
			//redirect User
			console.log("user deleted successfully");
		})
		.catch(function (error){
			//return error
			console.log(error);
		})
	})
	.catch(function (error){
		//
		console.log(error);
	})
}


/*
 *	Logs User out
 *
*/
function logOut(){
	
}

/*
*	Show All reported fraud Cases
*/
function showAllFrauds(){
	axios.get('http://localhost:8000/api/v1/frauds')
	.then(function (response) {
		console.log(response.data);
	})
	.catch(function (error) {
		console.log(error);
	});
}

/*
*	Report a fraud case
*/
function reportFraud(){
	const config = {
		'headers' : {
			'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
		}
	};
	axios.get('http://localhost:8000/api/v1/users/me', config)
	.then(function (response){
		let fraudData = new FormData();
		fraudData.append('user_id', response.data.user.id);
		fraudData.append('scammer_name', document.getElementById('scammer_name').value);
		fraudData.append('scammer_real_name', document.getElementById('scammer_real_name').value);
		fraudData.append('amount_scammed_off', document.getElementById('amount_scammed_off').value);
		fraudData.append('severity_id', document.getElementById('severity_id').value);
		fraudData.append('scam_start_date', document.getElementById('scam_start_date').value);
		fraudData.append('scam_realization_date', document.getElementById('scam_realization_date').value);
		fraudData.append('item_type_id', document.getElementById('item_type_id').value);
		fraudData.append('item_name', document.getElementById('item_name').value);
		fraudData.append('fraud_category_id', document.getElementById('fraud_category_id').value);
		if(file.value){
			fraudData.append('fraud_file', document.getElementById('file').files[0]);
		}

		let accountArray = [];
		let names = $('.account-name');
		let numbers = $('.account-no');
		let accountBankIds = $('.bankAccount-id');
		for (let i=0;i<names.length;i++){
			let number = numbers[i];
			let name = names[i];
			let accountBankId = accountBankIds[i];
			if (accountBankId.value){
				accountArray.push({bank_id: accountBankId.value,account_name: name.value, account_no: number.value});
			}
		}
		fraudData.append('accountData', JSON.stringify(accountArray));

		let emailArray = [];
		let emails = $('.scammer-email');
		for(let i = 0; i < emails.length; i++){
			let email = emails[i];
			if (email.value){
				emailArray.push({email:email.value});
			}
		}
		fraudData.append('emailData', JSON.stringify(emailArray));


		let phoneArray = [];
		let phones = $('.phone-number');
		for(let i = 0; i < phones.length; i++){
			let phone = phones[i];
			if (phone.value){
				phoneArray.push({phone_number: phone.value});
			}
		}
		fraudData.append('phoneData', JSON.stringify(phoneArray));

		let websiteArray = [];
		let webUrls = $('.web-url');
		let webBankIds = $('.bankWebsite-id');
		for (let i=0;i<webBankIds.length;i++){
			let webBankId = webBankIds[i];
			let webUrl = webUrls[i];
			if (webBankId.value){
				websiteArray.push({bank_id: webBankId.value,website_url: webUrl.value})
			}
		}
		fraudData.append('websiteData', JSON.stringify(websiteArray));


		axios.post('http://localhost:8000/api/v1/frauds', fraudData)
		.then(function (response){
			console.log(response.data);
		})
		.catch(function (error){
			console.log(error);
		});
	})
}

/*
*	Delete a fraud case
*/
function deleteFraud(){
	//todo:: optimize
	var id = $button_id;
	axios.delete('http://localhost:8000/api/v1/frauds/' + id)
	.then(function (response){
		console.log("Fraud deleted successfully");
	})
}


/*
*	Update a FraudCase
*/
function updateFraud(){
	//todo:: optimize
	var id = $button_id;
	axios.put('http://localhost:8000/api/v1/frauds/' + id)
	.then(function (response){
		console.log(response);
	})
}

