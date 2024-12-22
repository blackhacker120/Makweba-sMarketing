export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetLength * 34} 65% 50%`;
};

export const fetchData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.error("Error reading from localStorage", e);
    return null;
  }
};

export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

export const deleteItem = ({ key, id }) => {
  try {
    const existingData = fetchData(key);
    if (id) {
      const newData = existingData.filter((item) => item.id !== id);
      return localStorage.setItem(key, JSON.stringify(newData));
    }
    return localStorage.removeItem(key);
  } catch (e) {
    console.error("Error deleting from localStorage", e);
  }
};

export const createBudget = ({ name, amount }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    color: generateRandomColor(),
  };
  const existingBudgets = fetchData("budgets") ?? [];
  try {
    localStorage.setItem(
      "budgets",
      JSON.stringify([...existingBudgets, newItem])
    );
  } catch (e) {
    console.error("Error saving budget to localStorage", e);
  }
};

export const createExpense = ({ name, amount, budgetId }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    budgetId: budgetId,
  };
  const existingExpenses = fetchData("expenses") ?? [];
  try {
    localStorage.setItem(
      "expenses",
      JSON.stringify([...existingExpenses, newItem])
    );
  } catch (e) {
    console.error("Error saving expense to localStorage", e);
  }
};

export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    if (expense.budgetId !== budgetId) return acc;
    return (acc += expense.amount);
  }, 0);
  return budgetSpent;
};

export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

export const formatCurrency = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};
