const handleConfirmationPage = async()=>{
    const id = location.search.split('=')[1];
    const res = await fetch(`/reservations/:${id}`);
    const reservation = await res.json();
    console.log(reservation);
    // define and do DOM manipulations
    document.getElementById('flight').innerHTML = reservation.flight;
    document.getElementById('seat').innerHTML = reservation.seat;
    document.getElementById('name').innerHTML = `${reservation.givenName} ${reservation.surname}`;
    document.getElementById('email').innerHTML = reservation.email;
}

handleConfirmationPage();

