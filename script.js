let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transaction-form");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");
const list = document.getElementById("transactionlist");
const filterType = document.getElementById("filter-type");
const filterCategory = document.getElementById("filtercategory");

dateInput.value = new Date().toISOString().split("T")[0];

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const description = descriptionInput.value.trim();

  if (!amount || amount <= 0) return;
  if (category === "") return;
  if (date === "") return;
  if (description === "") return;

  const transaction = {
    id: Date.now(),
    amount,
    type,
    category,
    date,
    description
  };

  transactions.push(transaction);
  saveData();
  form.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
  displayTransactions();
  updateSummary();
});

function displayTransactions() {
  list.innerHTML = "";
  let filtered = transactions.filter(transaction => {
    const typeMatch = filterType.value === "all" || transaction.type === filterType.value;
    const categoryMatch = filterCategory.value === "" || transaction.category.includes(filterCategory.value);
    return typeMatch && categoryMatch;
  });

  if (filtered.length === 0) {
    list.innerHTML = "<p>No transactions found.</p>";
    return;
  }

  filtered.forEach(transaction => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${transaction.description} | ${transaction.category} | ${transaction.date}</span>
      <strong class="${transaction.type}">
        ${transaction.type === "income" ? "+" : "-"} ₹${transaction.amount.toFixed(2)}
      </strong>
      <button onclick="deleteTransaction(${transaction.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  displayTransactions();
  updateSummary();
}

function updateSummary() {
  let income = 0;
  let expense = 0;
  transactions.forEach(transaction => {
    if (transaction.type === "income") income += transaction.amount;
    else expense += transaction.amount;
  });
  const balance = income - expense;
  document.getElementById("income").textContent = `₹${income.toFixed(2)}`;
  document.getElementById("expense").textContent = `₹${expense.toFixed(2)}`;
  document.getElementById("balance").textContent = `₹${balance.toFixed(2)}`;
}

filterType.addEventListener("change", displayTransactions);
filterCategory.addEventListener("input", displayTransactions);

displayTransactions();
updateSummary();