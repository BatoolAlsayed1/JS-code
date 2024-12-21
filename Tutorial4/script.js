// Cookie Management
function setCookie(name, value) {
    document.cookie = name + "=" + value;

}

function getCookie(name) {
    const cookie = document.cookie
        .split(';')
        .find(c => c.trim().startsWith(name + "="));

    if (cookie)
        return cookie.substring(name.length + 1);
    else
        return null;

}

// Theme management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('theme-selector').value = theme;
    setCookie('theme', theme);
}

// Filter management
function filterItems(filterValue) {
    const items = document.querySelectorAll('#shopping-list li');
    items.forEach(item => {
        const article = item.querySelector('article');
        switch (filterValue) {
            case 'active':
                item.style.display = article.querySelector('span').classList.contains('completed') ? 'none' : '';
                break;
            case 'completed':
                item.style.display = article.querySelector('span').classList.contains('completed') ? '' : 'none';
                break;
            default: // 'all'
                item.style.display = '';
        }
    });
}

// Create list item element
function createListItem(text, completed = false) {
    const li = document.createElement('li');

    li.innerHTML = `
        <article><div class="grid">
            <span class="${completed ? 'completed' : ''}">${text}</span>
            <div>
                <button class="complete-btn outline ${completed ? 'secondary' : ''}">
                    ${completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn contrast">Delete</button>
            </div>
        </div></article>
    `;

    // Complete button event
    li.querySelector('.complete-btn').addEventListener('click', function (event) {
        event.stopPropagation();
        const span = li.querySelector('span');
        span.classList.toggle('completed');
        this.textContent = span.classList.contains('completed') ? 'Undo' : 'Complete';
        this.classList.toggle('secondary');
        saveItems();
        filterItems(document.getElementById('filter-select').value);
    });

    // Delete button event
    li.querySelector('.delete-btn').addEventListener('click', function (event) {
        event.stopPropagation();
        li.remove();
        saveItems();
    });

    return li;
}

function addItem(text, completed = false) {
    const list = document.getElementById('shopping-list');
    const li = createListItem(text, completed);
    list.appendChild(li);
    filterItems(document.getElementById('filter-select').value);
}

function saveItems() {
    const items = [];
    document.querySelectorAll('#shopping-list article').forEach(article => {
        items.push({
            text: article.querySelector('span').textContent,
            completed: article.querySelector('span').classList.contains('completed')
        });
    });
    localStorage.setItem('shoppingList', JSON.stringify(items));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Load theme
    const savedTheme = getCookie('theme') || 'light';
    console.log("savedTheme: " + savedTheme);
    setTheme(savedTheme);

    // Load items
    const savedItems = JSON.parse(localStorage.getItem('shoppingList') || '[]');
    savedItems.forEach(item => addItem(item.text, item.completed));
});

document.getElementById('theme-selector').addEventListener('change', function (event) {
    setTheme(event.target.value);
});

document.getElementById('filter-select').addEventListener('change', function (event) {
    filterItems(event.target.value);
});

document.getElementById('clear-completed').addEventListener('click', function () {
    document.querySelectorAll('#shopping-list span.completed').forEach(span => {
        span.closest('li').remove();
    });
    saveItems();
});

document.getElementById('add-item-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('item-input');
    const itemName = input.value.trim();

    if (itemName) {
        addItem(itemName);
        input.value = '';
        saveItems();
    }
})