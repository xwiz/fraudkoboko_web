
function generateSingleErrorOutput(error){
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


// check if a user is logged in 
function authUser(){
	if (sessionStorage.length == 0){
		document.getElementById('noUser').style.visibility = "visible";
	}else{
		document.getElementById('noUser').style.visibility = "hidden";
		document.getElementById('yesUser').style.visibility = "visible";

	}
}

// shows tooltip on search field
$('[data-toggle="tooltip"]').tooltip();

// $(window).on('shown.bs.modal', function(){
//     $('#viewFullFraudModal').modal('show');

//             alert('fjnfdjgnjgn');
//         });
//     })

// run search term
function handle(e){
	if(e.keyCode === 13){
        e.preventDefault(); // Ensure it is only this code that runs
        search();
    }
}

// redirects to login page if user is logged out
function redirect(){
	if (sessionStorage.length == 0){
		window.location.href = "C:/xampp/htdocs/consume/webApp/index.html";
	}
}


/*
*	validate form inputs
*	Register a new User
*/
function registerUser(){
	var fname = document.getElementById('fnameerror');
	var lname = document.getElementById('lnameerror');
	var mail = document.getElementById('emailerror');
	var phone = document.getElementById('phoneerror');
	var pass = document.getElementById('passworderror');
	var success = document.getElementById('successmessage');
	
	let userData = new FormData();
	userData.append('first_name', document.getElementById('first_name').value);
	userData.append('last_name', document.getElementById('last_name').value);
	userData.append('email', document.getElementById('email').value);
	userData.append('password', document.getElementById('password').value);
	userData.append('phone_number', document.getElementById('phone_number').value);
	axios.post('http://localhost:8000/api/v1/users', userData)
	.then(function (response){
		fname.innerHTML = "";
		lname.innerHTML = "";
		mail.innerHTML = "";
		phone.innerHTML = "";
		pass.innerHTML = "";
		success.innerHTML = "Congratulations, New User created Successfully!!! Please Click Login to continue";
	})
	.catch(function (error){
		
		fname.innerHTML = generateErrorFirstName(error);
		lname.innerHTML = generateErrorLastName(error);
		mail.innerHTML = generateErrorEmailName(error);
		phone.innerHTML = generateErrorPhoneNumber(error);
		pass.innerHTML = generateErrorPassword(error);
	});
}

/*
*	Authenticate New User and Logins him In
*/
function authenticateUser(){
	let userData = new FormData();
	userData.append('email', document.getElementById('loginemail').value);
	userData.append('password', document.getElementById('loginpassword').value);
	var loginerror = document.getElementById('validlogin');
	axios.post('http://localhost:8000/api/v1/auth/authenticate', userData)
	.then(function (authentication){
		window.sessionStorage.setItem('token', authentication.data.token);
		if(window.sessionStorage.getItem('token') == "undefined"){
			window.sessionStorage.removeItem('token');
			loginerror.innerHTML = "<b>"+"User Record doesn't exist."+"</b>"

		}
	})
	.then(function getProfilePage(){
		const auth = {
			'headers' : {
				'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
			}
		};

		axios.post('http://localhost:8000/api/v1/users/me', {}, auth)
		.then(function (response){
			window.location.href = "C:/xampp/htdocs/consume/webApp/profile.html";
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
		$('#userProfile').empty();
		document.getElementById('edited').style.visibility = "visible"
		document.getElementById('deleted').style.visibility = "visible"
		var uFname = response.data.user.first_name
		var uLname = response.data.user.last_name
		var uMail = response.data.user.email
		var uPhone = response.data.user.phone_number
		$('#userProfile').append("<div class=\"card\"><div class=\"card-header\"><div class=\"row\"><h6 class=\"col-md-12 card-title\">" + uFname +" " + uLname + "</h6></div><div class=\"row\"><h6 class=\"col-md-12 card-title\">" + uMail + " </h6></div><div class=\"row\"><h6 class=\"col-md-12 card-title\">" + uPhone + "</h6></div></div>")
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
		.then(function (response){
			$('#allFrauds').empty();
			$('#searchResult').empty();
			response.data.data.forEach(function($fraud){
 			var file = $fraud.fraudcase_files.data;
 			var email = $fraud.fraud_emails.data;
 			var website = $fraud.fraud_websites.data;
 			var c_file = "";
 			var c_email = "";
 			var c_website = "";

 			if(file.length == 0){
 				c_file = "";
 			}
 			else{
 				$fraud.fraudcase_files.data.forEach(function($file){
 					if(c_file.length == 0){
 						c_file += $file.picture_url
 					}
 					else{
 						c_file += ", " + $file.picture_url
 					}

 				})
 			}
 			if(email.length == 0){
 				c_email = "<h6 style=\"color:#f4eeee\">Not Provided</h6>";
 			}
 			else{
 				$fraud.fraud_emails.data.forEach(function($email){
 					if(c_email.length == 0){
 						c_email += $email.email
 					}
 					else{
 						c_email += ", " + $email.email

 					}
 				})
 			}
 			if(website.length == 0){
 				c_website = "<h6 style=\"color:#f4eeee\">Not Provided</h6>";
 			}
 			else{
 				$fraud.fraud_websites.data.forEach(function($website){
 					if(c_website.length == 0){
 						c_website += $website.website_url
 					}
 					else{
 						c_website += ", " + $website.website_url
 					}
 				})
 			}
 			$('#searchResult').append("<div class=\"col-sm-6 col-md-3\"><div class=\"card\"><div class=\"card-block\"><div class=\"text-center\"><img src= \"http://localhost:8000/"+c_file +" \"class=\"thumbnail img-responsive \" style=\"height:200px;width:200px\"></div><h6 class=\"card-text\">SCAMMER'S NAME : "+ $fraud.scammer_name + " </h6><h6 class=\"card-text\">AMOUNT INVOLVED : "+"₦" + $fraud.amount_scammed_off +"</h6><h6 class=\"card-text\">SCAM EMAIL : "+ c_email +"</h6><h6 class=\"card-text\">SCAM WEBSITE : "+ c_website +"</h6><div class=\"text-center\"><button type=\"button\" class=\"use btn btn-info\" data-dismiss=\"modal\" data-toggle=\"modal\"  id= " +  $fraud.id + ">More Details</button></div></div></div></div>")
 			})
			$('.use').click(function(){
				ida = $(this).attr('id');
				// console.log(ids);
				$('#fullCase').empty();
				fullShowCase();
				setTimeout(function(){
					$('#viewFullFraudModal').modal();
				}, 250);
			})
		})
		.catch(function (error){
			//console.log(error);
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
	window.sessionStorage.removeItem('token');
 	window.location.href = "C:/xampp/htdocs/consume/webApp/index.html";
}

/*
*	Show All reported fraud Cases
*/
var ida;
function showAllFrauds(){
	axios.get('http://localhost:8000/api/v1/frauds')
	.then(function (response){
		$('#allFrauds').empty();
 		$('#searchResult').empty();
		response.data.data.forEach(function($fraud){
 			var file = $fraud.fraudcase_files.data;
 			var email = $fraud.fraud_emails.data;
 			var website = $fraud.fraud_websites.data;
 			var c_file = "";
 			var c_email = "";
 			var c_website = "";

 			if(file.length == 0){
 				c_file = "";
 			}
 			else{
 				$fraud.fraudcase_files.data.forEach(function($file){
 					if(c_file.length == 0){
 						c_file += $file.picture_url
 					}
 					else{
 						c_file += ", " + $file.picture_url

 					}
 				})
 			}
 			if(email.length == 0){
 				c_email = "<h6 style=\"color:#f4eeee\">Not Provided</h6>";
 			}
 			else{
 				$fraud.fraud_emails.data.forEach(function($email){
 					if(c_email.length == 0){
 						c_email += $email.email
 					}
 					else{
 						c_email += ", " + $email.email

 					}
 				})
 			}
 			if(website.length == 0){
 				c_website = "<h6 style=\"color:#f4eeee\">Not Provided</h6>";
 			}
 			else{
 				$fraud.fraud_websites.data.forEach(function($website){
 					if(c_website.length == 0){
 						c_website += $website.website_url
 					}
 					else{
 						c_website += ", " + $website.website_url

 					}
 				})
 			}
 			$('#searchResult').append("<div class=\"col-sm-6 col-md-3\"><div class=\"card\"><div class=\"card-block\"><div class=\"text-center\"><img src= \"http://localhost:8000/"+c_file +" \"class=\"thumbnail img-responsive \" style=\"height:200px;width:200px\"></div><h6 class=\"card-text\">SCAMMER'S NAME : "+ $fraud.scammer_name + " </h6><h6 class=\"card-text\">AMOUNT INVOLVED : "+"₦" + $fraud.amount_scammed_off +"</h6><h6 class=\"card-text\">SCAM EMAIL : "+ c_email +"</h6><h6 class=\"card-text\">SCAM WEBSITE : "+ c_website +"</h6><div class=\"text-center\"><button type=\"button\" class=\"all btn btn-info\" data-dismiss=\"modal\" data-toggle=\"modal\"  id= " +  $fraud.id + ">More Details</button></div></div></div></div>")
 		})
		$(".all").click(function(){
			ida = $(this).attr('id');
			// console.log(ids);
			$('#fullCase').empty();
			fullShowCase();
			setTimeout(function(){
				$('#viewFullFraudModal').modal();
			}, 250);
		})
	})
	.catch(function (error){
		//console.log(error);
	})
}


function fullShowCase(){
	axios.get('http://localhost:8000/api/v1/fraud/' + ida)
 	.then(function (response){
 		// console.log(ids)
 		var startDate = response.data.data.scam_start_date;
 		var startRealize = response.data.data.scam_realization_date;
 		var amount = response.data.data.amount_scammed_off;
 		var scammerName = response.data.data.scammer_name;
 		var scammerRealName = response.data.data.scammer_real_name;
 		var itemName = response.data.data.item_name;
 		// var mail = response.data.data.fraud_emails.data[0].email;
 		// var account_name = response.data.data.fraud_accounts.data[0].account_name;
 		// var account_no = response.data.data.fraud_accounts.data[0].account_no;
 		// var web_url = response.data.data.fraud_websites.data[0].website_url;
 		// var number = response.data.data.mobiles.data[0].phone_number;
 		// var file = response.data.data.fraudcase_files.data[0].picture_url;
 		$('#fullCase').append("<div class=\"col-md-12\"><div class=\"card\"><div class=\"card-block\"><div class=\"text-center\"><h6 class=\"card-title\">"+ startDate +"</h6></div><h6 class=\"card-text\">SCAMMER'S NAME : "+ scammerName+ " </h6><h6 class=\"card-text\">AMOUNT INVOLVED : "+"₦" + amount +"</h6><h6 class=\"card-text\">SCAM EMAIL : "+ startRealize +"</h6><h6 class=\"card-text\">SCAM WEBSITE : "+ scammerRealName +"</h6><h6 class=\"card-text\">ITEM NAME : "+ itemName +"</h6><div class=\"text-center\"></div></div></div></div>")
 	
 	})
	.catch(function (error){
		//console.log(error);
	})
}
/*
*	Report a fraud case
*/
function reportFraud(){
	fraudErrorResult.innerHTML = "";
	var start_date = document.getElementById('scam_start_date').value
	var realize_date = document.getElementById('scam_realization_date').value
	var s_date = moment(start_date, 'DD/MM/YYYY').format('YYYY/MM/DD')
	var r_date = moment(realize_date, 'DD/MM/YYYY').format('YYYY/MM/DD')
	var fraudErrorResult = document.getElementById('reportError')
	var fraudSuccessResult = document.getElementById('successReport')
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
		fraudData.append('scam_start_date', s_date);
		fraudData.append('scam_realization_date', r_date);
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
				console.log("ddf "+ email.value);
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
		console.log(fraudData);

		axios.post('http://localhost:8000/api/v1/frauds', fraudData)
		.then(function (response){
			// window.location.reload(true);
			// document.getElementById('successReport').style.visibility = "visible";
			fraudSuccessResult.style.visibility = "visible";
		})
		.catch(function (error){
			fraudErrorResult.innerHTML = "Please check your submitted fields, Amount Scammed Off and Scammer's Name are Required!";
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

/*
 *
 *
 */
 var ids;
function search(){
 	var keyword = document.getElementById('searchbox').value;
 	var searcherror = document.getElementById('searcherror');
 	axios.get('http://localhost:8000/api/v1/frauds/search?keyword=' + keyword)
 	.then(function (response){
 		if (keyword == "" | !response.data.data){
 			searcherror.innerHTML = "<b>"+" Oops! Sorry, I couldn't satisfy your Expectation(s)."+"</b>";
 			return;
 		}

 		searcherror.innerHTML = "";
 		$('#searchResult').empty();
 		$('#allFrauds').empty();

 		response.data.data.forEach(function($fraud){
 			var file = $fraud.fraudcase_files.data;
 			var email = $fraud.fraud_emails.data;
 			var website = $fraud.fraud_websites.data;
 			var c_file = "";
 			var c_email = "";
 			var c_website = "";

 			if(file.length == 0){
 				c_file = "";
 			}
 			else{
 				$fraud.fraudcase_files.data.forEach(function($file){
 					if(c_file.length == 0){
 						c_file += $file.picture_url
 					}
 					else{
 						c_file += ", " + $file.picture_url

 					}
 				})
 			}
 			if(email.length == 0){
 				c_email = "<h6 style=\"color:#f4eeee\">Not Provided</h6>";
 			}
 			else{
 				$fraud.fraud_emails.data.forEach(function($email){
 					if(c_email.length == 0){
 						c_email += $email.email
 					}
 					else{
 						c_email += ", " + $email.email

 					}
 				})
 			}
 			if(website.length == 0){
 				c_website = "<h6 style=\"color:#f4eeee\">Not Provided</h6>";
 			}
 			else{
 				$fraud.fraud_websites.data.forEach(function($website){
 					if(c_website.length == 0){
 						c_website += $website.website_url
 					}
 					else{
 						c_website += ", " + $website.website_url

 					}
 				})
 			}

 			$('#searchResult').append("<div class=\"col-sm-6 col-md-3\"><div class=\"card\"><div class=\"card-block\"><div class=\"text-center\"><img src= \"http://localhost:8000/"+c_file +" \"class=\"thumbnail img-responsive \" style=\"height:200px;width:200px\"></div><h6 class=\"card-text\">SCAMMER'S NAME : "+ $fraud.scammer_name + " </h6><h6 class=\"card-text\">AMOUNT INVOLVED : "+"₦" + $fraud.amount_scammed_off +"</h6><h6 class=\"card-text\">SCAM EMAIL : "+ c_email +"</h6><h6 class=\"card-text\">SCAM WEBSITE : "+ c_website +"</h6><div class=\"text-center\"><button type=\"button\" class=\"sea btn btn-info\" data-dismiss=\"modal\" data-toggle=\"modal\"  id= " +  $fraud.id + ">More Details</button></div></div></div></div>")
 			
 			})
				$(".sea").click(function(){
					ids = $(this).attr('id');
					// console.log(ids);
					$('#searchCase').empty();
					fullSearchCase();
					setTimeout(function(){
						$('#viewFullSearchModal').modal();
					}, 250);
				})
	})
	.catch(function (error){
		//console.log(error);
	})
}


function fullSearchCase(){
	axios.get('http://localhost:8000/api/v1/fraud/' + ids)
 	.then(function (response){
 		var fraud = response
 		var startDate = response.data.data.scam_start_date;
 		var startRealize = response.data.data.scam_realization_date;
 		var amount = response.data.data.amount_scammed_off;
 		var scammerName = response.data.data.scammer_name;
 		var scammerRealName = response.data.data.scammer_real_name;
 		var itemName = response.data.data.item_name;
 		// var mail = response.data.data.fraud_emails.data[0].email;
 		// var account_name = response.data.data.fraud_accounts.data[0].account_name;
 		// var account_no = response.data.data.fraud_accounts.data[0].account_no;
 		// var web_url = response.data.data.fraud_websites.data[0].website_url;
 		// var number = response.data.data.mobiles.data[0].phone_number;
 		// var file = response.data.data.fraudcase_files.data[0].picture_url;
 		$('#searchCase').append("<div class=\"col-md-12\"><div class=\"card\"><div class=\"card-block\"><div class=\"text-center\"><img src= \"http://localhost:8000/"+c_file +" \"class=\"thumbnail img-responsive \" style=\"height:200px;width:200px\"><h6 class=\"card-title\">"+ startDate +"</h6></div><h6 class=\"card-text\">SCAMMER'S NAME : "+ scammerName+ " </h6><h6 class=\"card-text\">AMOUNT INVOLVED : "+"₦" + amount +"</h6><h6 class=\"card-text\">SCAM EMAIL : "+ startRealize +"</h6><h6 class=\"card-text\">SCAM WEBSITE : "+ scammerRealName +"</h6><h6 class=\"card-text\">ITEM NAME : "+ itemName +"</h6><div class=\"text-center\"></div></div></div></div>")
 	
 	})
	.catch(function (error){
		//console.log(error);
	})
}

/*
 *
 *
 */

