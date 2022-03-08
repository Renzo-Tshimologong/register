



let MyChart = document.getElementById("chart1").getContext('2d');
let title = document.getElementById("title");
let timer = document.querySelector('.time');
let dateMon = document.getElementById('MonDate');
const currentUser = sessionStorage.getItem('username');
const database = firebase.firestore();
const userCollection = database.collection(`users`);
const day = 1;
const present = [];
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

        