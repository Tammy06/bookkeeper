const app = require("electron").remote;
//const ipc = app.ipcRenderer;
const fs = require('fs');
const dialog = app.dialog;

// define form initial variables and form buttons
(function(){
  //initialize form button variables
  let addCustomerBtn = document.getElementById('add-customer-btn');
  let addLedgerBtn = document.getElementById('add-ledger-btn');
  addCustomerBtn.addEventListener('click', showCustomerForm);
  addLedgerBtn.addEventListener('click', showLedgerForm);

  //envoke date variables
  setDateTime();

  //envoke tab controller
  showTab("customer-tab-btn", "customers-container");

  //envoke default view
  showViews("default-view");
})();

//define date variables
function setDateTime(){
  let setDate = document.getElementById('date');
  let setTime = document.getElementById('time');
  let date = new Date();
  let min = date.getMinutes();
  let hr = date.getHours();
  let sec = date.getSeconds();
  let tDate = date.getDate();
  let mon = date.getMonth() + 1;
  let yr = date.getFullYear();
  setDate.innerHTML = tDate + " / " + mon + " / " + yr;
  setTime.innerHTML = hr + " : " + min + " : " + sec;
  setTimeout(setDateTime, 1000);
}

// tab controller
function showTab(btnId, containerId){
  let tab = document.getElementsByClassName('tab');
  let customerLedgerBtn = document.getElementsByClassName('customer-ledger-btn');

  for(var i = 0; i < tab.length; i++){
    tab[i].style.display = "none";
  }

  for(var i = 0; i < customerLedgerBtn.length; i++){
    customerLedgerBtn[i].classList.remove("btn-background");
  }

  document.getElementById(containerId).style.display = "block";
  document.getElementById(btnId).classList.add("btn-background");
}

function showCustomerForm(){
  let customerForm = document.getElementById('customer-form');
  if(customerForm.style.height == "400px"){
    customerForm.style.height = "0px";
  }else{
    customerForm.style.height = "400px";
  }
};

function showLedgerForm(){
  let ledgerForm = document.getElementById('ledger-form');
  if(ledgerForm.style.height == "600px"){
    ledgerForm.style.height = "0px";
  }else{
    ledgerForm.style.height = "600px";
  }
};

//handle views
function showViews(id){
  let views = document.getElementsByClassName('views');

  for(var i = 0; i < views.length; i++){
    views[i].style.display = "none";
  }

  document.getElementById(id).style.display = "block";
}

//alert message if customer or ledger record was added sucessfully
function alertRecordAddedMsg(){
  dialog.showMessageBox({
    'message': 'Added',
    'detail': 'Record added successfully'
  });
}

//alert message if customer or ledger record was uptdated sucessfully
function alertUpdateMsg(){
  dialog.showMessageBox({
    'message': 'Updated',
    'detail': 'Record was updated successfully'
  });
}

//customer delete message function
function custDelSuccessMsg(x){
  dialog.showMessageBox({
    'message': 'Deleted',
    'detail': x + '\'s record was successfully deleted'
  });
}

//ledger delete message function
function ledgerDelSuccessMsg(){
  dialog.showMessageBox({
    'message': 'Deleted',
    'detail': 'Record was successfully deleted'
  });
}

//confirm delete
function confirmDelete(){
  return dialog.showMessageBox({
    'message': 'Are you sure?',
    'buttons': ['No', 'Yes']
  });
}

function alertMessage(){
  dialog.showMessageBox({
    'message': 'Oops!',
    'detail': 'Records on edit mode can\'t be deleted. Update first then try again'
  });
}
