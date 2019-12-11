//Joseph Proper, Brody McKenna, Benny Strawser, Shawn Camus
//CPSC 215 Final App - JavaScript

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Function that adds a new task to the list and writes task to the file
//Shawn
function addToList() {
    //Declared Variables
    var task;   //User Task
    var date;   //User due Date
    var prior;  //User Priority
    var category;   //User Category
    var list;      //Entire List
    
    //Initialize Variables - Gets Values from user
    task = document.getElementById('task').value;
    date = document.getElementById('date').value;
    prior = document.getElementById('prior').value;
    category = document.getElementById('category').value;
    list = document.getElementById('table');
    
    //User data is inserted onto the list, at the end of the list until sorted. Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
    //Talked with other students in class for input
    //Tasks can be deleted by double-clicking their names. Modified: https://stackoverflow.com/questions/17399897/hide-parent-element-with-onclick-function
        list.insertAdjacentHTML('beforeend',
                             `<tr>
                                <center>
                                    <td><input type="checkbox" name="complete" value=""></td>
                                    <td style = "width: 170px" ondblclick="this.parentNode.parentNode.style.display='none'; newList();">
                                        ${task}
                                    </td>
                                    <td class="dates ${name}" style = "width: 130px; text-align: left">
                                        ${date}
                                    </td>
                                    <td style = "width: 10px; text-align: center">
                                        <center>
                                            <select id="prior" name="priority">
                                                <option value="${prior}">${prior}</option>
                                                <option value="low">!</option>
                                                <option value="med">!!</option>
                                                <option value="high">!!!</option>
                                            </select></center>
                                    </td>
                                    <td style = "width: 60px">
                                        ${category}
                                    </td>
                                </center>
                            </tr>`);
    
    checkSort();    //Checks dates and Sorts
    
    //Resets Inputs to null, so a new task can easily be added
    document.getElementById('task').value=null;
    document.getElementById('date').value=null; 
    document.getElementById('prior').value=null;
    document.getElementById('category').value=null; 

    
    //Writes user data onto the file. Modified from: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCall, errorCall);
    function successCall(fs) {
        fs.root.getFile('allan.txt',{create:true, exclusive: false}, function(fileEntry) 
        {
            fileEntry.createWriter(function(fileWriter)
            {
                fileWriter.onerror = function(e)
                {
                    alert("write failed: "+ e.toString());
                };
                var output = document.getElementById('table').innerHTML;
                fileWriter.write(output);
            }, errorCall);    
        }, errorCall);   
    };
    
    newList(); //Calls for a refresh to the file
} 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Function that updates the table with the current tasks. 
//Modified from: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/
//Brody
function newList() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCall, errorCall);
    function successCall(fs) {
        fs.root.getFile('allan.txt',{create:true, exclusive: false}, function(fileEntry) 
        {
            fileEntry.createWriter(function(fileWriter)
            {
                fileWriter.onerror = function(e)
                {
                    alert("write failed: "+ e.toString());
                };
                var output = document.getElementById('table').innerHTML;
                fileWriter.write(output);
            }, errorCall);    
        }, errorCall);  
    };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Function that shows the list when the app is re-opened. 
//Modified from: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/
//Brody
function showList() {  
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCall, errorCall);
    function successCall(fs)
    {
        fs.root.getFile('allan.txt',{create: true, exclusive: false},function(fileEntry)
        {
            fileEntry.file(function(file)
            {
                var reader = new FileReader();
                reader.onloadend = function(e)
                {  
                    var list = document.getElementById('table');
                    list.insertAdjacentHTML('beforeend', this.result);
                };
                reader.readAsText(file);
            }, errorCall);    
        }, errorCall);
    };
} 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Function that checks the date and sorts by date
//Overdue Items become red, Items due today become bold
//Benny
function checkSort()
{
    var finalIndex;
    var todaysDate = new Date();
    var table = document.getElementById('table');
    var row = table.rows;
    var listOfDates = document.getElementsByClassName('dates');

    for(var i = 0; i < listOfDates.length; i++)
    {
        var dueDate = new Date(listOfDates[i].textContent + 'EST');
        
        if(dueDate.getDate() < todaysDate.getDate())
        {
            var pickedDate = listOfDates[i];  
            pickedDate.style.color = "red";
            pickedDate.style.fontWeight = "bold";
        }
        else if(dueDate.getDate() === todaysDate.getDate())
        {
            var pickedDate = listOfDates[i];  
            pickedDate.style.fontWeight = "bold";
        } 
    };
    
    for (var i = 0; i < row.length; i++)
    {
        for (j = 0, finalIndex = row.length - 1; j < finalIndex; j++ )
        {
            var dateOne = new Date(listOfDates[j].textContent + 'EST');
            var dateTwo = new Date(listOfDates[j+1].textContent + 'EST');
            if (dateOne > dateTwo)
            {
                row[j].parentNode.insertBefore(row[j + 1], row[j]);
            };
        };
    };
    
   newList();   //refreshes the list
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Event Listener and onDeviceReady Source: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/
//Requests a file be made. 
//Source: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/
//Brody
document.addEventListener('deviceready', onDeviceReady, false);   
function onDeviceReady() {
    var type = LocalFileSystem.PERSISTENT;  
    window.requestFileSystem(type, 0, fileSuccess, errorCall);
        function fileSuccess(fs)
        {
            fs.root.getFile('allan.txt', {create: true, exclusive: false}, function(fileEntry)
            {
                if (!fileEntry.isFile)
                    writeFile(fileEntry, null);
            }, errorCall);
        }
    showList();
    checkSort();
}
//Error Detection for file
function errorCall(error)
{
    alert("Error Code: "+ error.code + error);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////