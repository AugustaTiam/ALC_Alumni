console.log("running script!");

// Function to open the add event modal
function openAddEventModal() {
    document.getElementById('addEventModal').style.display = 'block';
}

// Function to close the add event modal
function closeAddEventModal() {
    document.getElementById('addEventModal').style.display = 'none';
}

// Function to submit the add event form using AJAX
function submitEventForm() {
    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('categorySelect').value,
        date: document.getElementById('date').value,
    };

    fetch('/addEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            window.location.reload()
        })
        .catch(error => {
            console.error('Error adding event:', error);
        });
}

// Fetch all events
document.addEventListener('DOMContentLoaded', () => {
    fetch('/allEvents')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(events => {
            displayEvents(events);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
});

// Display events
function displayEvents(events) {
    const eventListContainer = document.getElementById('eventList');
    eventListContainer.innerHTML = '';

    events.forEach((event) => {
        const eventDiv = document.createElement('div');

        eventDiv.style.borderRadius = '10px';
        eventDiv.style.backgroundColor = '#013220';
        eventDiv.style.marginBottom = '10px';

        eventDiv.innerHTML = `
            <h2 style="color: white;">${event.title}</h2>
            <div id="eventDetails_${event._id}" style="display: none; color: white;">
                <p class="eventintro">Description:</p>
                <p>${event.description}</p>
                <p class="eventintro">Category:</p>
                <p>${event.category}</p>
                <p class="eventintro">Date:</p>
                <p>${new Date(event.date).toLocaleDateString('en-GB')}</p>
            </div>
            <button id="toggleButton_${event._id}" onclick="adjustContent('${event._id}')">+</button>
            <button id="updateButton" onclick="openEditEventModal('${event._id}')">Edit</button>
            <button id="updateButton" onclick="deleteEvent('${event._id}')">Delete</button>
        `;

        eventListContainer.appendChild(eventDiv);
    });
}

let currentEventID;

// Function to handle content adjustment
function adjustContent(eventId) {
    const toggleButton = document.getElementById(`toggleButton_${eventId}`);
    const currentContent = toggleButton.textContent.trim();

    // Toggle between '+' and '-'
    const newContent = currentContent === '+' ? '-' : '+';

    toggleButton.textContent = newContent;

    // Toggle visibility based on the new content value
    const eventDetails = document.getElementById(`eventDetails_${eventId}`);

    if (newContent === '+') {
        eventDetails.style.display = 'none';
    } else {
        eventDetails.style.display = 'block';
    }
}

// Function to open the edit event modal with event ID
function openEditEventModal(eventId) {
    console.log('we can update');
    if (!eventId) {
        console.error('Invalid eventId:', eventId);
        return;
    }

    fetch(`/api/event/${eventId}`)
        .then(response => {

            console.log('fetch successful');

            if (!response.ok) {
                throw new Error(`Failed to fetch event details. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(event => {

            document.getElementById('editEventModal').style.display = 'block';
            document.getElementById('title1').value = event.title;
            document.getElementById('description1').value = event.description;
            document.getElementById('categorySelect1').value = event.category;
            document.getElementById('date1').value = event.date?.split("T")[0];

            currentEventID = event._id;

            // Pass the eventId to the submitEditEventForm function
            document.getElementById('updateButton').onclick = function () {
                console.log('EID', event._id)
               //submitEditEventForm(event._id);
            };
        })
        .catch(error => {
            console.error('Error fetching event details:', error);
        });
}

function submitEditEventForm() {
    // Get form data
    const editFormData = {
        title: document.getElementById('title1').value,
        description: document.getElementById('description1').value,
        category: document.getElementById('categorySelect1').value,
        date: document.getElementById('date1').value,
    };


    // Use AJAX to send the form data to update the event
    fetch(`/${currentEventID}/updateEvent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
    })
        .then(response => {
            window.location.href='/adminDashboard'
        })
        .catch(error => {
            console.error('Error updating event:', error);
        });
}

// Function to close the edit event modal
function closeEditEventModal() {
    document.getElementById('editEventModal').style.display = 'none';
}

// Function to delete an event
function deleteEvent(eventId) {
    const confirmDelete = confirm('Are you sure you want to delete this event?');
    console.log("the function is deleting")

    if (confirmDelete) {
        fetch(`/api/event/${eventId}/deleteEvent`, {
            method: 'DELETE',
        })
            .then(response => {
                console.log("deleted success")

                if (response.ok) {
                    console.log('Event deleted successfully');
                    // Optionally, you can reload the page or update the event list
                    window.location.reload();
                } else {
                    console.error('Error deleting event:', response.status);
                }
            })
            .catch(error => {
                console.error('Error deleting event:', error);
            });
    }
}

