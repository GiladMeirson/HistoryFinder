const calendarBody = document.getElementById('calendar-body');
const currentMonthElement = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const resultsDiv = document.getElementById('results');
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

let currentDate = new Date();
let selectedDate = null;

function renderCalendar() {
    calendarBody.innerHTML = '';
    currentMonthElement.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = i;
        dayElement.addEventListener('click', () => selectDate(i));
        calendarBody.appendChild(dayElement);
    }

    if (selectedDate && selectedDate.getMonth() === currentDate.getMonth()) {
        const selectedDay = calendarBody.children[selectedDate.getDate() - 1];
        selectedDay.classList.add('selected');
    }
}

function selectDate(day) {
    if (selectedDate) {
        const previousSelectedDay = calendarBody.children[selectedDate.getDate() - 1];
        previousSelectedDay.classList.remove('selected');
    }

    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const selectedDay = calendarBody.children[day - 1];
    selectedDay.classList.add('selected');

    fetchEvents(selectedDate.getMonth() + 1, selectedDate.getDate());
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

function fetchEvents(month, day) {
    const loading = document.getElementById('loading');
    resultsDiv.style.display = 'none';
    loading.style.display = 'block';
    resultsDiv.innerHTML = '';

    fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`)
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            resultsDiv.style.display = 'block';
            
            data.events.sort((a, b) => b.year - a.year);

            data.events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.innerHTML = `
                    <div class="event-year">${event.year}</div>
                    <div class="event-text">${event.text}</div>
                    <div class="event-details">
                        <p>Loading additional details...</p>
                    </div>
                `;
                eventCard.addEventListener('click', () => toggleEventDetails(event, eventCard));
                resultsDiv.appendChild(eventCard);
            });
        })
        .catch(error => {
            loading.style.display = 'none';
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = 'An error occurred while fetching data. Please try again.';
            console.error('Error:', error);
        });
}

function toggleEventDetails(event, eventCard) {
    const detailsElement = eventCard.querySelector('.event-details');
    if (detailsElement.style.display === 'block') {
        detailsElement.style.display = 'none';
    } else {
        detailsElement.style.display = 'block';
        fetchEventDetails(event, detailsElement);
    }
}

function fetchEventDetails(event, detailsElement) {
    let detailsHTML = `<p>${event.text}</p>`;
    
    if (event.pages && event.pages.length > 0) {
        const page = event.pages[0];
        if (page.thumbnail && page.thumbnail.source) {
            detailsHTML += `<img src="${page.thumbnail.source}" alt="${page.title}" class="event-image">`;
        }
        if (page.extract) {
            detailsHTML += `<p>${page.extract}</p>`;
        }
    }

    detailsElement.innerHTML = detailsHTML;
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}



function createBackgroundElements() {
    const symbols = ['⚔️', '👑', '🏛️', '🏺', '📜', '⚓', '🔥', '🌍', '⚖️', '🎭'];
    const years = [1776, 1789, 1492, 1969, 1989, 1945, 1215, 1939, 1517, 1969];
    const container = document.body;

    // Create floating symbols
    for (let i = 0; i < 20; i++) {
        const symbol = document.createElement('div');
        symbol.className = 'history-symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.left = `${Math.random() * 100}vw`;
        symbol.style.animationDuration = `${15 + Math.random() * 10}s`;
        symbol.style.animationDelay = `${Math.random() * 5}s`;
        
        // Set initial position to be below the viewport
        symbol.style.transform = `translateY(${window.innerHeight + 20}px)`;
        
        container.appendChild(symbol);
        
        // Force reflow to ensure the initial position is applied before animation starts
        void symbol.offsetWidth;
        
        // Remove the initial transform to start the animation
        setTimeout(() => {
            symbol.style.transform = '';
        }, 50);
    }

    // Create floating years
    for (let i = 0; i < 10; i++) {
        const year = document.createElement('div');
        year.className = 'year';
        year.textContent = years[i];
        year.style.left = `${Math.random() * 90}vw`;
        year.style.top = `${Math.random() * 90}vh`;
        year.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
        year.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
        year.style.animationDuration = `${20 + Math.random() * 10}s`;
        year.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(year);
    }

    // Create multiple floating Earths
    for (let i = 0; i < 3; i++) {
        const earth = document.createElement('div');
        earth.className = 'earth';
        earth.style.left = `${Math.random() * 90}vw`;
        earth.style.top = `${Math.random() * 90}vh`;
        earth.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
        earth.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
        earth.style.animationDuration = `${60 + Math.random() * 30}s`;
        earth.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(earth);
    }
}







window.addEventListener('load', () => {
    createBackgroundElements();
   
    
});


renderCalendar();