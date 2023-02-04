//defiine ledger variables
let ledgerController = (function(){
  // edit mode
  let editMode = 0;

  let ledgerAddBtn = document.getElementById('ledger-add-btn');
  let ledgerUpdateBtn = document.getElementById('ledger-update-btn');
  let ledgerForm = document.getElementById('ledger-form');
  let displayRange = document.getElementById('display-range');

  let creditCash = document.getElementById('credit-cash');
  let debitCash = document.getElementById('debit-cash');
  let creditAccount = document.getElementById('credit-account');
  let debitAccount = document.getElementById('debit-account');
  let ledgerDescription = document.getElementById('ledger-description');

  let ledgerErrorSuccessMsg = document.getElementById('ledger-error-success-msg');
  let ledgersData = [];
  let filteredLedgersData = [];
  displayRange.addEventListener('change', envokeFilterLedger);
  ledgerForm.onsubmit = setLedgerData;

  //function to add ledger's data to storsge
  function setLedgerData(e){
    e.preventDefault();
    var ledgerDate = new Date;
    var ledgerFields = document.getElementsByClassName('ledger-data');
    var formValues = [];

    for (var i = 0; i < ledgerFields.length; i++) {
      if(ledgerFields[i].value == ""){
        formValues.push(i);
      }
    }

    if(formValues.length == 4){
      ledgerErrorSuccessMsg.innerHTML = "AT LEAST ONE VALUE IS REQUIRED!";
    }else{
      //Remove error message if all conditions are met.
      ledgerErrorSuccessMsg.innerHTML = "";

      //set form values to zero if it is empty.
      for (var i = 0; i < ledgerFields.length; i++) {
        if(ledgerFields[i].value == ""){
          ledgerFields[i].value = 0;
        }
      }

      let ledger = {
        cashCreditAmount: creditCash.value,
        cashDebitAmount: debitCash.value,
        accountCreditAmount: creditAccount.value,
        accountDebitAmount: debitAccount.value,
        description: ledgerDescription.value,
        ledgerTime: {
          minutes: ledgerDate.getMinutes(),
          seconds: ledgerDate.getSeconds(),
          hours: ledgerDate.getHours(),
          year: ledgerDate.getFullYear(),
          month: ledgerDate.getMonth() + 1,
          day: ledgerDate.getDate()
        }
      };

      ledgersData.push(ledger);
      filteredLedgersData.push(ledger);
      ledgerForm.reset();
      saveLedgersData();
      displayLedgersData();
      setTimeout(alertRecordAddedMsg, 500);
    }
  }

  //display ledgers data as page loads
  function displayLedgersData(){
    var totalCreditCash = 0;
    var totalDebitCash = 0;
    var totalCreditAccount = 0;
    var totalDebitAccount = 0;

    for (var i = 0; i < filteredLedgersData.length; i++) {
      totalCreditCash += parseFloat(filteredLedgersData[i].cashCreditAmount);
      totalDebitCash += parseFloat(filteredLedgersData[i].cashDebitAmount);
      totalCreditAccount += parseFloat(filteredLedgersData[i].accountCreditAmount);
      totalDebitAccount += parseFloat(filteredLedgersData[i].accountDebitAmount);
    }

    var balancedLedgerCash = totalCreditCash - totalDebitCash;
    var balancedLedgerAcct = totalCreditAccount - totalDebitAccount;

    let ledgerOutput = "<table border='' id='ledgers-table'><thead><tr id='ledgers-table-heading'><th>S/N</th><th>DATE</th><th>DESCRIPTION</th><th colspan='2'>CASH (N)</th><th colspan='2'>ACCOUNT (N)</th><th colspan='2'>BALANCE (N)</th></tr>"+
        "<tr class='even'><td></td><td></td><td></td><td>CR</td><td>DB</td><td>CR</td><td>DB</td><td>CA</td><td>AC</td></tr></thead><tbody>";

        if(filteredLedgersData.length !== 0){
          for (var i = 0; i < filteredLedgersData.length; i++) {
            var index = i % 2;
            if(index == 0){
              ledgerOutput += "<tr class='odd'><td>"+(i + 1)+"</td>"+
                "<td>"+filteredLedgersData[i].ledgerTime.day+"/"+filteredLedgersData[i].ledgerTime.month+"/"+filteredLedgersData[i].ledgerTime.year+" "+filteredLedgersData[i].ledgerTime.hours+":"+filteredLedgersData[i].ledgerTime.minutes+"</td>"+
                "<td>"+filteredLedgersData[i].description+"</td><td>"+filteredLedgersData[i].cashCreditAmount+"</td>"+
                "<td>"+filteredLedgersData[i].cashDebitAmount+"</td><td>"+filteredLedgersData[i].accountCreditAmount+"</td>"+
                "<td>"+filteredLedgersData[i].accountDebitAmount+"</td><td></td><td></td>"+
                "<td class='edit-delete-cell'><button type='button' name='button' id='edit-ledger-btn' onclick='ledgerController.editLedger("+i+")'>Edit</button></td>"+
                "<td class='edit-delete-cell'><button type='button' name='button' id='delete-ledger-btn' onclick='ledgerController.deleteLedger("+i+")'>&#x2715;</button></td>"+
                "</tr>";
            }else{
              ledgerOutput += "<tr class='even'><td>"+(i + 1)+"</td>"+
                "<td>"+filteredLedgersData[i].ledgerTime.day+"/"+filteredLedgersData[i].ledgerTime.month+"/"+filteredLedgersData[i].ledgerTime.year+" "+filteredLedgersData[i].ledgerTime.hours+":"+filteredLedgersData[i].ledgerTime.minutes+"</td>"+
                "<td>"+filteredLedgersData[i].description+"</td><td>"+filteredLedgersData[i].cashCreditAmount+"</td>"+
                "<td>"+filteredLedgersData[i].cashDebitAmount+"</td><td>"+filteredLedgersData[i].accountCreditAmount+"</td>"+
                "<td>"+filteredLedgersData[i].accountDebitAmount+"</td><td></td><td></td>"+
                "<td class='edit-delete-cell'><button type='button' name='button' id='edit-ledger-btn' onclick='ledgerController.editLedger("+i+")'>Edit</button></td>"+
                "<td class='edit-delete-cell'><button type='button' name='button' id='delete-ledger-btn' onclick='ledgerController.deleteLedger("+i+")'>&#x2715;</button></td>"+
                "</tr>";
            }
          }
          ledgerOutput += "</tbody><tfoot><tr class='odd'><td colspan='3'>TOTAL</td>"+
              "<td>"+totalCreditCash+"</td>"+
              "<td>"+totalDebitCash+"</td>"+
              "<td>"+totalCreditAccount+"</td>"+
              "<td>"+totalDebitAccount+"</td>"+
              "<td>"+balancedLedgerCash+"</td>"+
              "<td>"+balancedLedgerAcct+"</td></tr>"+
          "</tfoot></table>";
        }else{
          ledgerOutput = "<p id='empty-ledger-list'>You Have No Records</p>";
        }
        document.getElementById('display-ledger-table').innerHTML = ledgerOutput;
  }

  // A function to envoke filterLedger function
  function envokeFilterLedger(){
    filterLedger(this.value);
  }

  // filter ledger data
  function filterLedger(n){
    filteredLedgersData = [];
    let now = new Date();
    if(n == 0){
      for (var i = 0; i < ledgersData.length; i++) {
        filteredLedgersData.push(ledgersData[i]);
      }
      displayLedgersData();
    }else if(n > 0 && n < 13){
      for (var i = 0; i < ledgersData.length; i++) {
        if (ledgersData[i].ledgerTime.month == n && ledgersData[i].ledgerTime.year == now.getFullYear()) {
          filteredLedgersData.push(ledgersData[i]);
        }
      }
      displayLedgersData();
    }else {
      for (var i = 0; i < ledgersData.length; i++) {
        if (ledgersData[i].ledgerTime.year == n) {
          filteredLedgersData.push(ledgersData[i]);
        }
      }
      displayLedgersData();
    }
  }

  //handle date drop down list
  (function filterDropdown(){
    //year variables
    let getFullDate = new Date();
    let yearOfProd = 2019;
    let presentYear = getFullDate.getFullYear();
    let yearDiff = presentYear - yearOfProd;
    let presentYearOutput = "<option value='"+presentYear+"'>Pres. Year</option>";
    let yearOutput = "";

    //months variables
    let selectMonths = "";
    let thisMonth = getFullDate.getMonth() + 1;
    let selectedMonthsList = [];
    let monthsList = [{monthValue : 0, monthStr: "<option value='0'>All time</option>"},
      {monthValue : 1, monthStr: "<option value='1'>Jan</option>"},
      {monthValue : 2, monthStr: "<option value='2'>Feb</option>"},
      {monthValue : 3, monthStr: "<option value='3'>Mar</option>"},
      {monthValue : 4, monthStr: "<option value='4'>Apr</option>"},
      {monthValue : 5, monthStr: "<option value='5'>May</option>"},
      {monthValue : 6, monthStr: "<option value='6'>Jun</option>"},
      {monthValue : 7, monthStr: "<option value='7'>Jul</option>"},
      {monthValue : 8, monthStr: "<option value='8'>Aug</option>"},
      {monthValue : 9, monthStr: "<option value='9'>Sep</option>"},
      {monthValue : 10, monthStr: "<option value='10'>Oct</option>"},
      {monthValue : 11, monthStr: "<option value='11'>Nov</option>"},
      {monthValue : 12, monthStr: "<option value='12'>Dec</option>"}
    ];

    for (var i = 0; i < monthsList.length; i++) {
      if(monthsList[i].monthValue <= thisMonth){
        selectedMonthsList.push(monthsList[i]);
      }
    }

    selectedMonthsList[selectedMonthsList.length - 1].monthStr = "<option value='"+
    (selectedMonthsList.length - 1)+
    "'>Pres. Mon.</option>";

    for (var i = 0; i < selectedMonthsList.length; i++) {
      selectMonths += selectedMonthsList[i].monthStr;
    }

    if (yearDiff !== 0) {
      for (var i = 0; i < yearDiff; i++) {
        yearOutput += "<option value='"+(yearOfProd + i)+"'>"+ (yearOfProd + i) +"</option>";
      }
    }

    displayRange.innerHTML = presentYearOutput + selectMonths + yearOutput;

  })();

  //save ledger's data
  function saveLedgersData(){
    fs.writeFile('ledgerdb.json', JSON.stringify(ledgersData), (err) => {
      if(err){
        alert('Something went wrong');
        return;
      };
    });
  }

  //load ledger's data from storage
  function loadLedgerData(){
    ledgersData = JSON.parse(fs.readFileSync('./ledgerdb.json'));
    let presentYear = new Date().getFullYear();

    //envoke filterLedger function to show data for the present year by default.
    filterLedger(presentYear);
  }

  // envoke loadLedgerData function as soon as page loads
  loadLedgerData();

  // envoke displayLedgersData function as soon as page loads
  displayLedgersData();

  let ledgerControllerObject = {};

  ledgerControllerObject.deleteLedger = function(l){
    //if edit mode is on return
    if(editMode){
      alertMessage();
      return;
    }

    if(confirmDelete()){
      if(ledgersData.splice(l, 1) && filteredLedgersData.splice(l, 1)){
        saveLedgersData();
        displayLedgersData();
        setTimeout(function(){
          ledgerDelSuccessMsg();
        }, 500);
      }
    }
  };

  ledgerControllerObject.editLedger = function(l){
    creditCash.value = ledgersData[l].cashCreditAmount;
    debitCash.value = ledgersData[l].cashDebitAmount;
    creditAccount.value = ledgersData[l].accountCreditAmount;
    debitAccount.value = ledgersData[l].accountDebitAmount;
    ledgerDescription.value = ledgersData[l].description;
    ledgerAddBtn.style.display = "none";
    ledgerUpdateBtn.style.display = "block";
    ledgerUpdateBtn.addEventListener('click', ledgerControllerObject.updateLedger);
    ledgerUpdateBtn.setAttribute('data-updateId', l);
    ledgerForm.style.height = "600px";
    // turn on edit mode
    editMode = 1;
  };

  ledgerControllerObject.updateLedger = function(e){
    e.preventDefault();
    var dataUpdateId = this.attributes["data-updateId"].value;

    ledgersData[dataUpdateId].cashCreditAmount = creditCash.value;
    ledgersData[dataUpdateId].cashDebitAmount = debitCash.value;
    ledgersData[dataUpdateId].accountCreditAmount = creditAccount.value;
    ledgersData[dataUpdateId].accountDebitAmount = debitAccount.value;
    ledgersData[dataUpdateId].description = ledgerDescription.value;

    filteredLedgersData[dataUpdateId].cashCreditAmount = creditCash.value;
    filteredLedgersData[dataUpdateId].cashDebitAmount = debitCash.value;
    filteredLedgersData[dataUpdateId].accountCreditAmount = creditAccount.value;
    filteredLedgersData[dataUpdateId].accountDebitAmount = debitAccount.value;
    filteredLedgersData[dataUpdateId].description = ledgerDescription.value;

    ledgerUpdateBtn.setAttribute('data-updateId', '');
    ledgerAddBtn.style.display = "block";
    ledgerUpdateBtn.style.display = "none";
    ledgerForm.reset();
    saveLedgersData();
    displayLedgersData();
    // turn off edit mode
    editMode = 0;
    setTimeout(alertUpdateMsg, 500);
  }

  return ledgerControllerObject;

})();
