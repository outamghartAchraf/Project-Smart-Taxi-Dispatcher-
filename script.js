var prompt = require('prompt-sync')();

try{
  
let Taxis = [ 
{ id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 
0 }, 
{ id: 2, position: 12, available: true, timeRemaining: 0, 
totalRides: 0 }, 
{ id: 3, position: 20, available: true, timeRemaining: 0, 
totalRides: 0 } 
] 
 
let Requests = [ 
{ reqId: 1, position: 10, duration: 3, time: 0 }, 
{ reqId: 2, position: 3, duration: 4, time: 2 }, 
{ reqId: 3, position: 18, duration: 2, time: 4 }, 
{ reqId: 4, position: 7, duration: 5, time: 5 } 
]

let waitingQueue = [];

  //   ADD NEW REQUEST

  try{
   
    let newPosition = Number(prompt("Enter request position: "));
    let newDuration = Number(prompt("Enter request duration: "));
    let newTime = Number(prompt("Enter request time: "));

        if (isNaN(newPosition) || isNaN(newDuration) || isNaN(newTime)) {
      throw new Error(" please enter numbers only");
    }
    
    Requests.push({ reqId: Taxis.length + 1, position: newPosition, duration: newDuration, time: newTime });
 
}catch(e){
  console.log(e.message);
}
// A. Trouver le taxi le plus proche et disponible 

function findTaxi(request) {
  let closestTaxi = null;
  let minDistance = Infinity;

  for (let i = 0; i < Taxis.length; i++) {
    let taxi = Taxis[i];

    if (taxi.available) {
      let distance = Math.abs(taxi.position - request.position);

      if (distance < minDistance) {
        minDistance = distance;
        closestTaxi = taxi;
      }
    }
  }

  return closestTaxi;
}


// assign taxi

function assignTaxi(taxi, request, minute) {

  try {
    if (!taxi || !request){
      throw new Error("Taxi or request not valid");
    }

    taxi.available = false;
    taxi.timeRemaining = request.duration;
    taxi.totalRides++;
    console.log(`Minute ${minute}: Request ${request.reqId} assigned to Taxi ${taxi.id} (distance: ${Math.abs(taxi.position - request.position)})`);
    taxi.position = request.position;
     }catch(e){
      console.log(e.message);
     }
}

// update taxi for munite

function updateTaxis(minute) {
  for (let i = 0; i < Taxis.length; i++) {
    let taxi = Taxis[i];

    if (!taxi.available && taxi.timeRemaining > 0) {
      taxi.timeRemaining--;

      if (taxi.timeRemaining === 0) {
        taxi.available = true;
        console.log(`Minute ${minute}: Taxi ${taxi.id} is now free in position ${taxi.position}`);

         if (waitingQueue.length > 0) {
          let req = waitingQueue.shift();
           assignTaxi(taxi, req, minute);
         }

       }
    }
  }
}

let minute  = 0;
while (Requests.length > 0){

     
updateTaxis(minute);

 
  for (let i = 0; i < Requests.length; i++) {
    let req = Requests[i];
    if (req.time === minute) {
      let taxi = findTaxi(req);
      if (taxi) {
        assignTaxi(taxi, req, minute);
      }else {
        waitingQueue.push(req);
        console.log(`Minute ${minute}: Request ${req.reqId} added to queue`);
      }

      Requests.splice(i,1);
      i--;
    }
  }

  minute++;


}



console.log("\n--- Final Report ---");

let totalRides = 0;

for (let i = 0; i < Taxis.length; i++) {
  let taxi = Taxis[i];
  console.log(`Taxi ${taxi.id}: ${taxi.totalRides} ride(s), final position ${taxi.position}`);
  totalRides += taxi.totalRides;
}

console.log(`Total rides: ${totalRides}`);
console.log(`Total simulated time: ${minute} minutes`);





  

}catch(e){
  console.log(e.message);
}