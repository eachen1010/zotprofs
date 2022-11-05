const departmentName = document.getElementById("dept");
const courseNumber = document.getElementById("courseNum");     
const passNoPass = document.getElementById("p_np"); 

const form = document.getElementById("question");                  
form.addEventListener('submit', (event) => {
    const departmentN = encodeURIComponent(departmentName.value);
    const courseN = parseInt(courseNumber.value);
    const passnp = p_np.value;
    const baseurl = 'https://api.peterportal.org/rest/v0/grades/raw'
    const resources = "?department=" + departmentN + "&number=" + courseN + "&excludePNP=" + passnp
    const entireurl = baseurl + resources
    async function getUsers(){
        let response = await fetch(entireurl);
        let data = await response.json()
        return data;
    }
    getUsers().then(data => console.log(data));
    
});
