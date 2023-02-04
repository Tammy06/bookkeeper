
let customerController = (function(){
  //define customer's form variables
  let customerAddBtn = document.getElementById('customer-add-btn');
  let customerUpdateBtn = document.getElementById('customer-update-btn');
  let customerForm = document.getElementById('customer-form');
  let customerName = document.getElementById('name');
  let customerphoneNum = document.getElementById('phone-num');
  let customerEmail = document.getElementById('email');
  let customerAddress = document.getElementById('address');
  let customerErrorSuccessMsg = document.getElementById('customer-error-success-msg');
  let editMode = 0;
  let customersData = [];
  customerForm.onsubmit = setCustomerData;

  //function to add customers data to storsge
  function setCustomerData(e){
    e.preventDefault();
    var formValues = [];
    if(customerName.value == ""){
      formValues.push("error: 'Name' field is empty!");
    }

    if(customerphoneNum.value == ""){
      formValues.push("error: 'Phone No.' field is empty!");
    }

    if(formValues.length == 0){
      //Remove error message if all conditions are met.
      customerErrorSuccessMsg.innerHTML = "";

      let customer = {
        name: customerName.value,
        phone: customerphoneNum.value,
        email: customerEmail.value,
        address: customerAddress.value
      };

      customersData.push(customer);
      customerForm.reset();
      saveCustomersData();
      displayCustomersData();
      setTimeout(alertRecordAddedMsg, 500);
    }else{
      customerErrorSuccessMsg.innerHTML = "AT LEAST NAME AND PHONE NUMBER IS REQUIRED!<br>";
      for (var i = 0; i < formValues.length; i++) {
        customerErrorSuccessMsg.innerHTML += formValues[i] + "<br>";
      }
      return false;
    }
  };

  //display customers data
  function displayCustomersData(){
    let customerOutput = "<table border='' id='customers-table'><thead><tr id='customers-table-heading'><th>S/N</th><th>NAME</th><th>PHONE NO</th><th>EMAIL</th><th>ADDRESS</th></tr></thead><tbody>";

    if(customersData.length !== 0){
      for (var i = 0; i < customersData.length; i++) {
        var index = i % 2;
        if(index == 0){
          customerOutput += "<tr class='even'><td>" + (i + 1) +
          "</td><td>"+customersData[i].name+"</td><td>"+
          customersData[i].phone+"</td><td>"+customersData[i].email+
          "</td><td>"+customersData[i].address+
          "</td><td class='edit-delete-cell'><button type='button' name='button' id='edit-customer-btn' data-customer-id='"+
          i +"' onclick='customerController.editCustomer("+
          i +")'>Edit</button></td><td class='edit-delete-cell'><button type='button' name='button' id='delete-customer-btn' data-customer-id='"+ i +"' onclick='customerController.deleteCustomer("+
          i +")'>&#x2715;</button></td>"+
          "</tr>";
        }else{
          customerOutput += "<tr class='odd'><td>" + (i + 1) +
          "</td><td>"+customersData[i].name+"</td><td>"+customersData[i].phone+
          "</td><td>"+customersData[i].email+"</td><td>"+customersData[i].address+
          "</td><td class='edit-delete-cell'><button type='button' name='button' id='edit-customer-btn' data-customer-id='"+
          i +"' onclick='customerController.editCustomer("+ i +")'>Edit</button></td><td class='edit-delete-cell'><button type='button' name='button' id='delete-customer-btn' data-customer-id='"+ i +"' onclick='customerController.deleteCustomer("+
          i +")'>&#x2715;</button></td>"+
          "</tr>";
        }
      }
      customerOutput += "</tbody></table>";
    }else{
      customerOutput = "<p id='empty-customer-list'>You Have No Customers</p>";
    }
    document.getElementById('display-customer-table').innerHTML = customerOutput;
  }

  //save customers data
  function saveCustomersData(){
    fs.writeFile('customersdb.json', JSON.stringify(customersData), (err) => {
      if(err){
        alert('Something went wrong');
        return;
      };
    });
  }

  //load customers data from storage
  function loadCustomersData(){
    customersData = JSON.parse(fs.readFileSync('./customersdb.json'));
  }

  //envokes loadCustomersData function
  loadCustomersData();

  //envoke displayCustomersData() function as page loads
  displayCustomersData();

  let customerControllerObject = {};

  // delete customer function
  customerControllerObject.deleteCustomer = function(c){

    if(editMode){
      alertMessage();
      return;
    }

    if(confirmDelete()){
      var deletedName = customersData[c].name;
      if(customersData.splice(c, 1)){
        saveCustomersData();
        displayCustomersData();
        setTimeout(function(){
          custDelSuccessMsg(deletedName);
        }, 500);
      }
    }
  }

  // edit customer function
   customerControllerObject.editCustomer = function(c){
    customerName.value = customersData[c].name;
    customerphoneNum.value = customersData[c].phone;
    customerEmail.value = customersData[c].email;
    customerAddress.value = customersData[c].address;
    customerAddBtn.style.display = "none";
    customerUpdateBtn.style.display = "block";
    customerUpdateBtn.addEventListener('click', customerControllerObject.updateCustomer);
    customerUpdateBtn.setAttribute('data-updateId', c);
    customerForm.style.height = "400px";
    editMode = 1;
  }

  //function to update customer's data
  customerControllerObject.updateCustomer = function(e){
    e.preventDefault();
    var dataUpdateId = this.attributes["data-updateId"].value;

    customersData[dataUpdateId].name = customerName.value;
    customersData[dataUpdateId].phone = customerphoneNum.value;
    customersData[dataUpdateId].email = customerEmail.value;
    customersData[dataUpdateId].address = customerAddress.value;
    customerUpdateBtn.setAttribute('data-updateId', '');
    customerAddBtn.style.display = "block";
    customerUpdateBtn.style.display = "none";
    editMode = 0;
    customerForm.reset();
    saveCustomersData();
    displayCustomersData();
    setTimeout(alertUpdateMsg, 500);
  }

  return customerControllerObject;

})();
