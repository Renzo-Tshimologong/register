
let MyChart = document.getElementById("chart1").getContext('2d');
let title = document.getElementById("title");
let timer = document.querySelector('.time');
let dateMon = document.getElementById('MonDate');
const currentUser = sessionStorage.getItem('username');
const database = firebase.firestore();
const userCollection = database.collection(`users`);
const currentDate = new Date();
const day = currentDate.getDay();
const present = [];

console.log(currentUser);
if (currentUser === "Renzo1" || currentUser === "Renzo2") {
    title.innerText = `Hello, ${currentUser.slice(0,-1)}!`;

    const daysContainer = document.querySelector(".daysContainer")
    const chartContainer = document.querySelector(".chartContainer")
    const adminDiv = document.querySelector(".adminDiv");
    const loadAdmin=
    `
    <style>
        .w3-container{
            padding:5rem 5rem;
        }
        nav{
            display: flex;
            padding: 0;
            margin: 0;
            background-color: #0b2343;
        }
        nav h1{
            margin-top: 2rem;
            margin-left: 85%;
            color: #ffcc05;
        }
    </style>
    <!--<h1>Hello, ${currentUser.slice(0,-1)}!</h1>-->

    <div class="w3-container">
                
                        <table id="myTable" class="w3-table-all">
                        <tr>
                            <th onclick="w3.sortHTML('#myTable', '.item', 'td:nth-child(1)')" style="cursor:pointer">Name</th>
                            <th onclick="w3.sortHTML('#myTable', '.item', 'td:nth-child(2)')" style="cursor:pointer">Date</th>
                            <th onclick="w3.sortHTML('#myTable', '.item', 'td:nth-child(3)')" style="cursor:pointer">Signature</th>
                        </tr>
                        <tr class="item">
                            <td>Berglunds snabbköp</td>
                            <td>01/01/2022</td>
                            <td>k.l</td>
                        </tr>
                        <tr class="item">
                            <td>North/South</td>
                            <td>01/01/2022</td>
                            <td>k.l</td>
                        </tr>
                        <tr class="item">
                            <td>Alfreds Futterkiste</td>
                            <td>02/01/2022</td>
                            <td>k.l</td>
                        </tr>
                        <tr class="item">
                            <td>Königlich Essen</td>
                            <td>03/01/2022</td>
                            <td>k.l</td>
                        </tr>
                        <tr class="item">
                            <td>Magazzini Alimentari Riuniti</td>
                            <td>01/01/2022</td>
                            <td>l.l</td>
                        </tr>
                        <tr class="item">
                            <td>Paris spécialités</td>
                            <td>05/01/2022</td>
                            <td>k.l</td>
                        </tr>
                        <tr class="item">
                            <td>Island Trading</td>
                            <td>04/01/2022</td>
                            <td>k.l</td>
                        </tr>
                        <tr class="item">
                            <td>Laughing Bacchus Winecellars</td>
                            <td>01/01/2022</td>
                            <td>k.u</td>
                        </tr>
                        </table>
    </div>

    `
    adminDiv.innerHTML = loadAdmin

    daysContainer.remove()
    chartContainer.remove()




}
else{
    for(let x = 1; x < 6; x++){
    
        userCollection.doc(`${currentUser.slice(0,-1)}`).collection('day').doc(x.toString()).get().then(user=>{
            if(user.exists){
                console.log(user.data());
                let username = user.data().first;
                let time = user.data().time;
                let date = user.data().date;
                let pres = user.data().present;
                console.log(pres);
                if(currentUser === username){
                    title.innerText = `Hello, ${username.slice(0,-1)}!`;
    
                    
                }
    
                let section = document.getElementById(x.toString());
                if(section.id === x.toString()){
                    section.childNodes[3].innerText = date;
                    section.childNodes[5].innerText = time;
                    present[x] = pres;
                    console.log(present[x]);
                    let massPopChart = new Chart(MyChart, {
                        type:'bar',
                        data:{
                            labels:['Days Attended', 'Days Absent'],
                            datasets:[{
                                label:'Register',
                                data:[present[x], 1],
                                backgroundColor:['#0b2343', '#ffcc05'],
                                borderWidth: 1,
                                borderColor:'white',
                                hoverBorderColor:'orange'
                            }],
                        },
                        options:{
                            title:{
                                display:true,
                                text:'The Days Marking The Register',
                                fontSize: 25,
                            }
                        }
            
                    })
                }
            
            }
        }).catch(error=> console.error(error));
    }

}


 
