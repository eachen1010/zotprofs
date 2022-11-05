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
    console.log(type_sort)



    const departmentN = departmentName.value;
    const courseN = courseNumber.value;
    const baseurl = 'https://api.peterportal.org/rest/v0/grades/raw'
    const resources = "?department=" + departmentN + "&number=" + courseN
    const entireurl = baseurl + resources

    async function getUsers(){
        let response = await fetch(entireurl);
        let data = await response.json()
        return data;
    }

    getUsers().then(data => {

        var grade_rates = []
        /* Run through the data and sort */
        for(let i = 0; i < data.length; i++){
            /* A Rate */
            let total = data[i].gradeACount + data[i].gradeBCount + data[i].gradeCCount + data[i].gradeDCount + data[i].gradeFCount
            let percentageATotal = data[i].gradeACount / total 
            
            /* Passing Rate */
            let passingTotal = data[i].gradeACount + data[i].gradeBCount + data[i].gradeCCount
            let passingPercent = passingTotal / total

            grade_rates.push([percentageATotal, passingPercent, data[i]])
        }
        console.log(grade_rates)


        let resultElementhead = document.getElementById("head");
        let resultElementbody = document.getElementById("body");
        
        let row_head = "<tr class = \"content\"> <th>Ranking</th> <th>Name</th> <th>% Passing</th> <th>% Of As</th> <th>Average GPA</th> <th>Term</th> <th>Year</th></tr>"
        
        let row_table = ""
        if(type_sort == 'a'){
            grade_rates.sort(sortFunctionA);
        }
        else{
            grade_rates.sort(sortFunctionPassing)
        }

        for(let row = 0; row < grade_rates.length; row++){
            row_table += "<tr class = \"content\">"
            row_table+="<td>" + String(row+1) + "</td>"
            row_table+="<td>" + grade_rates[row][2].instructor + "</td>"
            row_table+="<td>" + (grade_rates[row][1]*100).toFixed(1) + "</td>"
            row_table+="<td>" + (grade_rates[row][0]*100).toFixed(1) + "</td>"
            row_table+="<td>" + grade_rates[row][2].averageGPA + "</td>"
            row_table+="<td>" + grade_rates[row][2].quarter + "</td>"
            row_table+="<td>" + grade_rates[row][2].year + "</td>"
            row_table += "</tr>"
        }
        resultElementhead.innerHTML = row_head;
        resultElementbody.innerHTML = row_table;
    
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
