// ------------------------------------------------------Declaritives-------------------------------------------------------//

let MyChart = document.getElementById("chart1").getContext('2d');
let title = document.getElementById("title");
let timer = document.querySelector('.time');
let dateMon = document.getElementById('MonDate');
let table = document.getElementById('myTable');
const currentUser = sessionStorage.getItem('username');
const database = firebase.firestore();
const userCollection = database.collection(`users`);
const currentDate = new Date();
const day = currentDate.getDay();
const present = [];

function statsLogic(){
    // ---------------------------------Admin UI---------------------------------------------------------//
    if (currentUser === "Renzo1" || currentUser === "Renzo2") {
        title.innerText = `Hello, ${currentUser.slice(0,-1)}!`;
       
        const date = currentDate.toLocaleDateString();
        
        const time = currentDate.toLocaleTimeString();
        const hour = time[0] + time[1];
        
        // displays table when admin
        table.style.display = "inline-block";
    
        
    
        let formatDate = date.replaceAll('/','-');
        const adminCollection = database.collection('admin');
    
        const users = ["Renzo", "Molefe"];
    
        let userData = [];
       
       
    
        
    
        users.map(user=>{
    
            adminCollection.doc(`${formatDate}`).collection(user).doc('1').get().then(data=>{
                if(data.exists){
                   
                        if(hour >= '10'){
                            adminCollection.doc(`${formatDate}`).collection(user).doc('1').update({
                                signature:'absent'
                            }).catch((e)=>console.error(e));
                            userCollection.doc(user).collection('day').doc(day.toString()).get().then(data=>{
                                if(data.exists){
        
                                }else{
                                    userCollection.doc(user).collection('day').doc(day.toString()).set({
                                        first: user,
                                        time: time,
                                        date: date,
                                        day: currentDate.getDay(),
                                        present: 'absent',
          
                                    })
                                }
                            })
                        }
                   
                    
                    userData = [data.data()]
                 
                    
    
                    for(let x = 0; x< userData.length; x++){
    
                        let tr = document.createElement('tr');
                        tr.className = "item";
                        let td1 = document.createElement('td');
                        let td2 = document.createElement('td');
                        let td3 = document.createElement('td');
                
                        td1.className = 'username';
                        td2.className = 'date';
                        td3.className = 'signature';

                        td1.innerText = userData[x].name.slice(0,-1);
                        td2.innerText = userData[x].date;
                        td3.innerText = userData[x].signature;
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);
                        table.appendChild(tr);
    
                        
                    }
                    daysContainer.remove()
                    chartContainer.remove()
                }
                
            })
        })
        
        const daysContainer = document.querySelector(".daysContainer")
        const chartContainer = document.querySelector(".chartContainer")
        
       
    
    
    
    
    }
    else{
        // ---------------------------------------------User UI-------------------------------------------//

        // hides table when not admin
        table.style.display = "none";
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
}
statsLogic();




 
