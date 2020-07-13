const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
let flightNumber;
let selection = '';

const renderFlightsMenu = async () => {
  //get an array with the names of the flights
  const res = await fetch('http://localhost:8000/flights');
  const allFlights = await res.json();

  //Create an option for each flight and append to the select element
  allFlights.forEach(flight => {
    const option = document.createElement('option');
    option.text = flight;
    option.value = flight;
    document.getElementById('flight').appendChild(option);
  })
}

const renderSeats =  async () => {
  document.querySelector('.form-container').style.display = 'block';
  const flightNumber = document.getElementById('flight').value;
  const res = await fetch(`http://localhost:8000/flights/${flightNumber}`)
  const flightData = await res.json();

  const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement('ol');
    row.classList.add('row');
    row.classList.add('fuselage');
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement('li');

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      // TODO: render the seat availability based on the data...
      //Let's find the seat on the flight
      const seatAvailability = flightData.filter(seat => seat.id == seatNumber)[0].isAvailable;
      //Render is as available or not
      if(seatAvailability === true){
        seat.innerHTML = seatAvailable;
        row.appendChild(seat);
      } else {
        seat.innerHTML = seatOccupied;
        row.appendChild(seat);
      }
    }
  }

  let seatMap = document.forms['seats'].elements['seat'];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove('selected');
        }
      });
      document.getElementById(seat.value).classList.add('selected');
      document.getElementById('seat-number').innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  console.log('toggleFormContent: ', flightNumber);
  fetch(`/flights/${flightNumber}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
    });
  // TODO: contact the server to get the seating availability
  //      - only contact the server if the flight number is this format 'SA###'.
  //      - Do I need to create an error message if the number is not valid?

  // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
  renderSeats();
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  // TODO: everything in here!
  fetch('/users', {
    method: 'POST',
    body: JSON.stringify({
      givenName: document.getElementById('givenName').value,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

renderFlightsMenu();
flightInput.addEventListener('blur', toggleFormContent);
