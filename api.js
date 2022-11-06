const departmentName = document.getElementById("deptselect");
const courseNumber = document.getElementById("courseNum");  

const form = document.getElementById("inputs");                  
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    let output = "";
    let type_sort = "";
    for (const entry of data) {
        output = `${output}${entry[0]}=${entry[1]}\r`;
        type_sort = entry[1]
    }


    const departmentN = encodeURIComponent(departmentName.value);
    const courseN = courseNumber.value;
    console.log(courseN)
    console.log(departmentN)
    const baseurl = 'https://api.peterportal.org/rest/v0/grades/raw'
    const resources = "?department=" + departmentN + "&number=" + courseN
    const entireurl = baseurl + resources

    async function getUsers(){
        let response = await fetch(entireurl);
        let data = await response.json()
        return data;
    }
    

    getUsers().then(data => {
        console.log(data)
        var grade_rates = {}
        /* Run through the data and sort */
        for(let i = 0; i < data.length; i++){
            /* A Rate */
            let total = data[i].gradeACount + data[i].gradeBCount + data[i].gradeCCount + data[i].gradeDCount + data[i].gradeFCount
            let percentageATotal = data[i].gradeACount / total 
            
            /* Passing Rate */
            let passingTotal = data[i].gradeACount + data[i].gradeBCount + data[i].gradeCCount
            let passingPercent = passingTotal / total
            if(!(data[i].instructor in grade_rates)){
                
                grade_rates[data[i].instructor] = [percentageATotal, passingPercent, 1, data[i]]
                console.log("NEW: " + grade_rates[data[i].instructor][0])
            } 
            else{
                grade_rates[data[i].instructor][0] += percentageATotal 
                grade_rates[data[i].instructor][1] += passingPercent
                grade_rates[data[i].instructor][2] += 1
            }
            
        }
        
        let grade_rates_array= []
        
        for (const [key, value] of Object.entries(grade_rates)) {
            grade_rates[key][0] /=  grade_rates[key][2];
            grade_rates[key][1] /= grade_rates[key][2];
            grade_rates_array.push(grade_rates[key]);
        }


        let resultElementhead = document.getElementById("head");
        let resultElementbody = document.getElementById("body");
        
        let row_head = "<tr class = \"content\"> <th>Ranking</th> <th>Name</th> <th>% Passing</th> <th>% Of As</th> <th>Average GPA</th></tr>"
        
        let row_table = ""
        
        
        if(type_sort == 'a'){
            grade_rates_array.sort(sortFunctionA);
        }
        else{
            grade_rates_array.sort(sortFunctionPassing)
        }
        console.log(grade_rates_array)
        for(let row = 0; row < grade_rates_array.length; row++){
            if (row <=2){
                row_table += "<tr class = \"content top-3\">"
            }
            else{
                row_table += "<tr class = \"content\">"
            }

            row_table+="<td>" + String(row+1) + "</td>"
            row_table+="<td>" + grade_rates_array[row][3].instructor + "</td>"
            row_table+="<td>" + (grade_rates_array[row][1]*100).toFixed(1) + "</td>"
            row_table+="<td>" + (grade_rates_array[row][0]*100).toFixed(1) + "</td>"
            row_table+="<td>" + grade_rates_array[row][3].averageGPA + "</td>"
            row_table += "</tr>"
        }
        resultElementhead.innerHTML = row_head;
        resultElementbody.innerHTML = row_table;
    
        document.getElementById("border-table").style.border = '2px solid black';
    
        function sortFunctionPassing(a, b) {
            if (a[1] === b[1]) {
                return 0;
            }
            else {
                return (a[1] > b[1]) ? -1 : 1;
            }
        }

        function sortFunctionA(a, b) {
            if (a[0] === b[0]) {
                return 0;
            }
            else {
                return (a[0] > b[0]) ? -1 : 1;
            }
        }
        

    });



});
