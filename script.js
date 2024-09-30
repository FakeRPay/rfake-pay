// Sample user data
const users = [
    { username: "dunn", password: "dunn123", balance: 1000, isAdmin: false },
    { username: "mall", password: "mall123", balance: 2000, isAdmin: false },
    { username: "rani", password: "rani123", balance: 1500, isAdmin: false },
    { username: "vish", password: "vishadmin", balance: 5000, isAdmin: true },
];

let currentUser = null;
let borrowRequests = [];
let borrowList = [];

// Show Login Page
function showLoginPage() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('loginPage').classList.add('active');
}

// Login Function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        document.getElementById('currentUserName').innerText = user.username;
        document.getElementById('currentBalance').innerText = user.balance;
        showHomePage();
    } else {
        document.getElementById('loginError').innerText = 'Invalid username or password.';
    }
}

// Show Home Page
function showHomePage() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('homePage').classList.add('active');
}

// Show Transfer Money Page
function showTransferPage() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('transferPage').classList.add('active');
}

// Transfer Money
function transferMoney() {
    const receiverUsername = document.getElementById('receiverUsername').value;
    const transferAmount = Number(document.getElementById('transferAmount').value);
    const receiver = users.find(u => u.username === receiverUsername);

    if (receiver && currentUser.balance >= transferAmount) {
        currentUser.balance -= transferAmount;
        receiver.balance += transferAmount;
        alert(`Transferred ₹${transferAmount} to ${receiver.username}.`);
        document.getElementById('currentBalance').innerText = currentUser.balance; // Update balance display
        showHomePage();
    } else {
        document.getElementById('transferError').innerText = 'Transfer failed. Check the details and try again.';
    }
}

// Show Borrow Page
function showBorrowPage() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('borrowPage').classList.add('active');
}

// Request to Borrow Money
function requestBorrow() {
    const borrowUser = document.getElementById('borrowUser').value;
    const borrowAmount = Number(document.getElementById('borrowAmount').value);
    const lender = users.find(u => u.username === borrowUser);

    if (lender) {
        borrowRequests.push({ from: currentUser.username, to: lender.username, amount: borrowAmount });
        alert(`Borrow request of ₹${borrowAmount} sent to ${lender.username}.`);
        showHomePage();
    } else {
        document.getElementById('borrowError').innerText = 'User not found.';
    }
}

// Show Borrow Requests
function showBorrowRequests() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('borrowRequestsPage').classList.add('active');

    const requests = borrowRequests.map(req => `
        <p>From: ${req.from}, Amount: ₹${req.amount} 
           <button onclick="acceptBorrowRequest('${req.from}', ${req.amount}, this)">Accept</button>
           <button onclick="rejectBorrowRequest('${req.from}', this)">Reject</button>
        </p>
    `).join('');

    document.getElementById('borrowRequests').innerHTML = requests || "<p>No borrow requests available.</p>";
}

// Accept Borrow Request
function acceptBorrowRequest(from, amount, btn) {
    const lender = users.find(u => u.username === from);

    if (lender && currentUser.balance >= amount) {
        lender.balance += amount; // Lender receives the amount
        currentUser.balance -= amount; // Deduct from borrower's balance
        alert(`You have accepted ₹${amount} from ${from}.`);
        // Add to borrow list
        borrowList.push({ from: lender.username, to: currentUser.username, amount });
        // Remove from borrow requests
        borrowRequests = borrowRequests.filter(req => !(req.from === from && req.amount === amount));
        btn.parentElement.remove(); // Remove the buttons from the DOM
        document.getElementById('currentBalance').innerText = currentUser.balance; // Update balance display
    } else {
        alert('Borrower not found or insufficient balance.');
    }
}

// Reject Borrow Request
function rejectBorrowRequest(from, btn) {
    borrowRequests = borrowRequests.filter(req => req.from !== from);
    alert(`You have rejected the borrow request from ${from}.`);
    btn.parentElement.remove(); // Remove the buttons from the DOM
}

// Show Borrow List
function showBorrowList() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('borrowListPage').classList.add('active');

    const listItems = borrowList.map(item => `
        <p>From: ${item.from}, Amount: ₹${item.amount} 
           <button onclick="markBorrowAsComplete('${item.from}', ${item.amount}, this)">Mark as Complete</button>
        </p>
    `).join('');

    document.getElementById('borrowList').innerHTML = listItems || "<p>No borrow transactions available.</p>";
}

// Mark Borrow as Complete
function markBorrowAsComplete(from, amount, btn) {
    borrowList = borrowList.filter(item => !(item.from === from && item.amount === amount));
    alert(`Marked the borrow from ${from} of ₹${amount} as complete.`);
    btn.parentElement.remove(); // Remove the buttons from the DOM
}

// Show Edit User Page
function showEditUser() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('editUserPage').classList.add('active');
}

// Edit User Balance
function editUserBalance() {
    const username = document.getElementById('editUsername').value;
    const newBalance = Number(document.getElementById('editAmount').value);
    const user = users.find(u => u.username === username);

    if (user) {
        user.balance = newBalance;
        alert(`User ${username}'s balance has been updated to ₹${newBalance}.`);
        showHomePage();
    } else {
        alert('User not found.');
    }
}

// Logout Function
function logout() {
    currentUser = null;
    showLoginPage();
}

// Initialize Application
showLoginPage();
